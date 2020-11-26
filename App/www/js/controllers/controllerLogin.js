angular.module('starter').controller('LoginCtrl', function($ionicSideMenuDelegate, $stateParams, ScriptServices, $scope, PopUpServices, InfoFactories, $filter, $state, $ionicLoading, $ionicPopup) {
    function init(){
        $ionicLoading.show();
        $scope.recorveryPassword = false;
        $scope.request = {};
        if ($stateParams.error401) {
            logoutError401();
        }else{
            checkAndUpdateClientInfo();
        }
    };

    function checkAndUpdateClientInfo (){
        if(verifyClientSelected()){
            getClientList('refresh');
            verifyUserLogged();
        }else{
            $scope.configCompanyAccount = true;
            getClientList();
        }
    }

    function logoutError401() {
    	var driverNumber = InfoFactories.getUserInfo().driverNumber;
        window.localStorage.removeItem('userInfo');
        InfoFactories.resetService();
        checkAndUpdateClientInfo();
        /* ScriptServices.getXMLResource(569).then(function(res) {
            res = res.replace('{USER_ID}', driverNumber);
            ScriptServices.callGenericService(res, 569);
        }); */
    };

    function verifyClientSelected(){
        $scope.selectedClient = InfoFactories.getClientSelected();
        return $scope.selectedClient?true:false
    }

    function getClientList(action, companyCode){
        ScriptServices.getXMLResource(589).then(function(res) {
            res = res.replace('{LANGUAGE}', navigator.language); //ask matteo
            ScriptServices.callGenericService(res, 589, 'demo').then(function(data) {
                $ionicLoading.hide();
                $scope.clientList = data.clientListBooking;
                console.log($scope.clientList);
                if(action === 'refresh'){
                    refreshClientConfigs(($scope.selectedClient || {}).clientCode || companyCode);
                }
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('login.companiesMissing'));
            })
        });
    }

    function verifyUserLogged(){
        var driverNumber = InfoFactories.getUserInfo().driverNumber;
        if (driverNumber) {
            if (!window.serverRootLocal && window.plugins && window.plugins.OneSignal) {
                registerPushID();
            }
            $state.go('tab.bookings');
        }
    }

    function refreshClientConfigs(clientCode){
        for (var i = 0; i < $scope.clientList.length; i++) {
            var element = $scope.clientList[i];
            if(clientCode === $scope.clientList[i].clientCode){
                $scope.selectedClient = $scope.clientList[i];
                InfoFactories.applyClientStyle($scope.clientList[i].clientStyle);
                window.localStorage.setItem('selectedClient', JSON.stringify($scope.clientList[i]));
                $scope.configCompanyAccount = false;
                console.log($scope.selectedClient.registration);
                $scope.registration = $scope.selectedClient.registration;
                break;
            }
        }
    }

    $scope.verifyCompanyCode = function(e){
        e.stopPropagation();
        if(!$scope.request.verifyCode){
            setTimeout(function() {
                $('#verifyCode-input').focus();
            });
        }else{
            refreshClientConfigs($scope.request.verifyCode);
            if($scope.configCompanyAccount === true){
                PopUpServices.errorPopup($filter('translate')('login.retryCompanyCode'), '1');
            }
        }
    }

    $scope.recorveryPasswordOn = function(){
        $scope.recorveryPassword = !$scope.recorveryPassword;
        $scope.request = {};
    } 

    $scope.callRecoverService = function(){
        if(!$scope.request.email){
            setTimeout(function() {
                $('#email-input').focus();
            });
        }else{
            getClientInfo('recover');
        }
    }

    function recoverPassowrd(){
        $ionicLoading.show();
        ScriptServices.getXMLResource(591).then(function(res) {
            res = res.replace('{EMAIL}', $scope.request.email);
            ScriptServices.callGenericService(res, 591).then(function(data) {
                var pnrPopup = $ionicPopup.alert({
                    title: $filter('translate')('login.result'),
                    template: data.data
                });
                pnrPopup.then(function(res) {
                    $scope.recorveryPasswordOn();
                });
                $ionicLoading.hide();
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            })
        });
    }
    $scope.newAccount = function (client) {
        if(client === 'Gpp') {
            $state.go('gppRegistration');
        } else {
            $state.go('register');
        }
        
    };
    getClientInfo = function(action){
        if(action === 'login'){
            callLoginService($scope.request.userid, $scope.request.password);
        }else if(action === 'recover'){
            recoverPassowrd();
        }
    }
    
    $scope.login = function() {
        if($scope.request.userid && $scope.request.password){
            getClientInfo('login');
        }else if(!$scope.request.userid){
            setTimeout(function() {
                $('#user-input').focus();
            });
        }else if(!$scope.request.password){
            setTimeout(function() {
                $('#password-input').focus();
            });
        }
    };

    $scope.userFix = function () {
        $scope.request.userid = $scope.request.userid.toLowerCase();
    }

    function callLoginService(user, pw){
        $ionicLoading.show(); 
        ScriptServices.getXMLResource(515).then(function(res) {
            res = res.replace('{USER_NAME}', user).replace('{PASSWORD}', pw);
            ScriptServices.callGenericService(res, 515).then(function(data) {
                if(data.data.DriverList.length > 0){
                    var userInfo = {
                        driverNumber : data.data.DriverList[0].Nr
                    };
                    getUserInfo(userInfo, data.retcode && data.retcode === 2);
                }else{
                    PopUpServices.errorPopup($filter('translate')('login.dataWrong')+ $filter('translate')('commons.retry'));
                    $ionicLoading.hide(); 
                }
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            })
        });
    }

    function getUserInfo(userInfo, isStatus2){
            ScriptServices.getXMLResource(554).then(function(res) {
            res = res.replace('{NUMBER_DRIVER}', userInfo.driverNumber);
            ScriptServices.callGenericService(res, 554).then(function(data) {
                userInfo.registry =  data.data.GetUser[0];
                window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
                registerPushID();
                if (isStatus2) {
                    window.localStorage.setItem('isNotRegistered', "true");
                    $state.go('completeRegistration');
                } else {
                    window.localStorage.removeItem('isNotRegistered');
                    $state.go('tab.bookings');
                }
                $ionicLoading.hide(); 
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
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
    $scope.$on('$ionicView.afterEnter', function(event) { 
        $ionicSideMenuDelegate.canDragContent(false); 
    });
    init();
});