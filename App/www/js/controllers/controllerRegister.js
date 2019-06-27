angular.module('starter').controller('RegisterCtrl', function($filter, $state, PopUpServices, $scope, InfoFactories, ScriptServices, $ionicLoading) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.request = {};

    function getConsensi(){
        $ionicLoading.show();
        ScriptServices.getXMLResource(651).then(function(res) {
            res = res.replace('{DRIVERID}', null);
            ScriptServices.callGenericService(res, 651).then(function(data) {
                $scope.acceptances = data.data.acceptances;
                $ionicLoading.hide();
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            });
        });
    }

    getConsensi();

    $scope.cancel = function (params) {
        $state.go('login');
    };

    $scope.create = function () {
        if (!$scope.request.firstName || !$scope.request.lastName || !$scope.request.email || !$scope.request.username || !$scope.request.password || !$scope.request.confirmPassword) {
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
            .replace('{PROMO}', $scope.request.promo || '')
            .replace('{COMPANY}', $scope.request.company || '')
            .replace('{USERNAME}', $scope.request.username || '')
            .replace('{ACCEPT1}', $scope.request.accept1 ? 'YES' : 'NO')
            .replace('{ACCEPT2}', $scope.request.accept2 || 'NO')
            .replace('{ACCEPT3}', $scope.request.accept3 || 'NO')
            .replace('{ACCEPT4}', $scope.request.accept4 || 'NO');/* 
            .replace('{TARIFCODE}', $scope.request.tarifCode || '73695'); */
            ScriptServices.callGenericService(res, 645).then(function(data) {
                if(data.data){
                    PopUpServices.messagePopup('Account creato con successo', 'Successo', function () {
                        callLoginService($scope.request.username, $scope.request.password);
                        
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
    
})