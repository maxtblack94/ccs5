angular.module('starter').controller('RegisterCtrl', function($filter, $state, PopUpServices, $scope, InfoFactories, ScriptServices, $ionicLoading) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.request = {};



    $scope.cancel = function (params) {
        $state.go('login');
    }

    $scope.create = function () {
        if (!$scope.request.firstName || !$scope.request.lastName || !$scope.request.email || !$scope.request.password || !$scope.request.confirmPassword) {
            PopUpServices.messagePopup('Compilare tutti i campi obbligatori', 'Attenzione');
        }else if($scope.request.password !== $scope.request.confirmPassword ){
            PopUpServices.messagePopup('I campi password non combaciano', 'Attenzione');
        }else{
            createAccount();
        }
    }

    function createAccount(){
        $ionicLoading.show();
        ScriptServices.getXMLResource(645).then(function(res) {
            res = res.replace('{EMAIL}', $scope.request.email)
            .replace('{FIRSTNAME}', $scope.request.firstName)
            .replace('{LASTNAME}', $scope.request.lastName)
            .replace('{PASSWORD}', $scope.request.password)
            .replace('{PROMO}', $scope.request.promo || null)
            .replace('{COMPANY}', $scope.request.company || null);
            ScriptServices.callGenericService(res, 645).then(function(data) {
                if(data.data){
                    PopUpServices.messagePopup('Account creato con successo', 'Successo', function () {
                        var userInfo = {
                            driverNumber : data.data
                        };
                        getUserInfo(userInfo);
                    });
                    
                }else{
                    PopUpServices.errorPopup('Email già presente nel sistema. '+ $filter('translate')('commons.retry'));
                    $ionicLoading.hide(); 
                }
                $ionicLoading.hide();
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            })
        });
    }

    function registerPushID (){
        if (window.plugins && window.plugins.OneSignal) {
            window.plugins.OneSignal.getIds(function(ids) {
                if (ids && ids.userId) {
                    ScriptServices.getXMLResource(567).then(function(res) {
                        var driverNumber = InfoFactories.getUserInfo().driverNumber;
                        res = res.replace('{USER_ID}', driverNumber).replace('{PUSH_ID}', ids.userId);
                        ScriptServices.callGenericService(res, 567);
                    });
                }
            });
        }
    }

    function getUserInfo(userInfo){
        ScriptServices.getXMLResource(554).then(function(res) {
            res = res.replace('{NUMBER_DRIVER}', userInfo.driverNumber);
            ScriptServices.callGenericService(res, 554).then(function(data) {
                userInfo.registry =  data.data.GetUser[0];
                window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
                registerPushID();
                $state.go('tab.bookings');
                $ionicLoading.hide(); 
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            })
        });
    }
    
})