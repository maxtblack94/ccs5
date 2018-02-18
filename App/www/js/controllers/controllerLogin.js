angular.module('starter').controller('LoginCtrl', function($stateParams, ScriptServices, $scope, $rootScope, PopUpServices, InfoFactories, $http, $state, $ionicLoading, $ionicPopup) {
    function init(){
        $ionicLoading.show();
        $scope.locale = window.locale;
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

    function getClientList(action){
        ScriptServices.getXMLResource(589).then(function(res) {
            res = res.replace('{LANGUAGE}', 'Italiano');
            ScriptServices.callGenericService(res, 589, 'demo').then(function(data) {
                $ionicLoading.hide();
                $scope.clientList = data.clientListBooking;
                if(action === 'refresh'){
                    refreshClientConfigs($scope.selectedClient.clientCode);
                }
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup(error, 'Non è stato possibile recuperare le informazioni aziendali');
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
                break;
            }
        }
    }

    $scope.verifyCompanyCode = function(){
        if(!$scope.request.verifyCode){
            setTimeout(function() {
                $('#verifyCode-input').focus();
            });
        }else{
            refreshClientConfigs($scope.request.verifyCode);
            if($scope.configCompanyAccount === true){
                PopUpServices.errorPopup('Il codice cliente inserito non esiste, riprovare!', '1');
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
                    title: 'Esito richiesta',
                    template: data
                });
                pnrPopup.then(function(res) {
                    $scope.recorveryPasswordOn();
                });
                $ionicLoading.hide();
            }, function(error) {
                PopUpServices.errorPopup(error+', riprovare!');
                $ionicLoading.hide();
            })
        });
    }

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

    function callLoginService(user, pw){
        $ionicLoading.show(); 
        ScriptServices.getXMLResource(515).then(function(res) {
            res = res.replace('{USER_NAME}', user).replace('{PASSWORD}', pw);
            ScriptServices.callGenericService(res, 515).then(function(data) {
                if(data.data.DriverList.length > 0){
                    var userInfo = {
                        driverNumber : data.data.DriverList[0].Nr
                    };
                    getUserInfo(userInfo);
                }else{
                    PopUpServices.errorPopup('Email/Password sono errati, riprovare!');
                    $ionicLoading.hide(); 
                }
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup(error+', riprovare!');
            })
        });
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
                PopUpServices.errorPopup(error+', riprovare!');
            })
        });
    }

    function registerPushID (){
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

    init();
})