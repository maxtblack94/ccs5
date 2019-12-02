angular.module('starter').controller('PlafondCtrl', function($scope, PopUpServices, InfoFactories, $filter, $state, $ionicLoading, ScriptServices, $ionicPopup) {
    $scope.request = {};
    $scope.plafondList = [];
    $scope.userInfo = InfoFactories.getUserInfo();
    $scope.requestCoupon = {};



    function getMoviments() {
        $ionicLoading.show();
        ScriptServices.getXMLResource(659).then(function(res) {
            res = res.replace('{DRIVERID}', InfoFactories.getUserInfo().driverNumber || null);
            ScriptServices.callGenericService(res, 659).then(function(data) {
                $scope.movimentsList = data.data.reloadList;
                $ionicLoading.hide();
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            });
        });
    }

    getMoviments();
    

    function startSetefy(plafondRequest) {
        $ionicLoading.show();
        ScriptServices.getXMLResource(656).then(function(res) {
            res = res.replace('{DRIVERID}', InfoFactories.getUserInfo().driverNumber || null)
            .replace('{PLAFONDREQUESTED}', plafondRequest);
            ScriptServices.callGenericService(res, 656).then(function(data) {
                $scope.refreshPlafond();
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            });
        });
    }

    function chargeAlert(params) {
        var modalContent = `Confermi la richiesta di addebito sulla tua carta di credito registrata di € ${params} per ricaricare il tuo credito residuo?`;
        var configObj = {
            "buttons": [{
                text: $filter('translate')('Annulla'),
                type: 'button-stable',
            }, {
                text: '<b>'+$filter('translate')('Conferma')+'</b>',
                type: 'button-positive',
                onTap: function () {
                    startSetefy(params);
                }
            }],
            "message": modalContent,
            "title": 'Conferma Ricarica',
        }
        PopUpServices.buttonsPopup(configObj);
    }

    $scope.charge = function () {
        $scope.plafondList = [];
        ScriptServices.directWithOutScriptID(658).then(function (data) {
            $scope.plafondList = data.data.amounts;
            $scope.selectPicklistValue('plafond');
            $ionicLoading.hide();
        }, function (error) {
            $ionicLoading.hide();
        });

    };

    $scope.selectPicklistValue = function (picklist, title, subTitle) {
        var templateUrl = "templates/picklists/plafond.html";

        if (picklist === 'plafond') {
            title = $filter('translate')('commons.chargePlafond');
            subTitle = $filter('translate')('commons.choosePlafond');
        }

        $ionicPopup.show({
            templateUrl: templateUrl,
            title: title,
            subTitle: subTitle,
            scope: $scope,
            buttons: [{
                text: $filter('translate')('commons.cancel'),
                type: 'button-stable',
            }, {
                text: '<b>'+$filter('translate')('commons.select')+'</b>',
                type: 'button-positive',
                onTap: function (e) {
                    if (!$scope.request.picklistValue) {
                        $scope.request.picklistValue = null;
                        e.preventDefault();
                    } else {
                        $scope.request[picklist] = $scope.request.picklistValue;
                        chargeAlert($scope.request[picklist]);
                        $scope.request.picklistValue = null;
                    }
                }
            }]
        });
    };


    

    $scope.refreshPlafond = function (){
        $scope.$broadcast('scroll.refreshComplete');
        getMoviments();
        refreshUser();
        
    };

    function refreshUser() {
        ScriptServices.getXMLResource(554).then(function(res) {
            res = res.replace('{NUMBER_DRIVER}', InfoFactories.getUserInfo().driverNumber);
            ScriptServices.callGenericService(res, 554).then(function(data) {
                var userInfo = InfoFactories.getUserInfo();
                userInfo.registry =  data.data.GetUser[0];
                $scope.userInfo.registry =  data.data.GetUser[0];
                window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            });
        });
    }


    function addCoupon(coupon) {
        $ionicLoading.show();
        ScriptServices.getXMLResource(680).then(function(res) {
            var driverNumber = $scope.userInfo.driverNumber;
            res = res.replace('{COUPONCODE}', coupon)
            .replace('{DRIVERNUMBER}', driverNumber);
            ScriptServices.callGenericService(res, 680).then(function(data) {
                $ionicLoading.hide();
                if(data.retcode && data.retcode === 2) {
                    PopUpServices.messagePopup(data.data, $filter('translate')('commons.attention')) ;
                } else {
                    PopUpServices.messagePopup($filter('translate')("Buono inserito con successo"),$filter('translate')('commons.success'));
                    $scope.refreshPlafond();
                }
                
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('editPassword.editFail'));
            });
        });
    }


    $scope.addCouponPopup = function() {
        $scope.requestCoupon = {};
        // An elaborate, custom popup
        $ionicPopup.show({
          template: '<input type="text" ng-model="requestCoupon.couponCode">',
          title: 'Aggiungi Buono',
          subTitle: 'Inserisci il codice buono',
          scope: $scope,
          buttons: [
            { text: $filter('translate')('commons.cancel'), type: 'button-stable' },
            {
              text: '<b>'+ $filter('translate')('commons.confirm') +'</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.requestCoupon.couponCode) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  return addCoupon($scope.requestCoupon.couponCode);
                }
              }
            }
          ]
        });
      
       };
});