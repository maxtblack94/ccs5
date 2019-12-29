angular.module('starter').controller('RegisterCtrl', function($filter, RegexService, $state, PopUpServices, $scope, InfoFactories, ScriptServices, $ionicLoading) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.request = {};
    $scope.step = 1;

    window.addEventListener('keyboardWillShow', function () {
        if (cordova.plugins && cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
      });

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
        if (!$scope.request.firstName || !$scope.request.lastName || !$scope.request.username) {
            PopUpServices.messagePopup('Compilare tutti i campi obbligatori', 'Attenzione');
        }else if(!$scope.request.accept1){
            PopUpServices.messagePopup("E' obbligatorio leggere l'informativa E-vai", 'Attenzione');
        }else if($scope.request.accept2 === undefined || $scope.request.accept3 === undefined || $scope.request.accept4 === undefined){
            PopUpServices.messagePopup("E' obbligatorio valorizzare tutti i consensi", 'Attenzione');
        }else{
            createAccount();
        }
    };

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
                    
                }else if(data.retcode === 5){
                    PopUpServices.errorPopup('Email già presente nel sistema. '+ $filter('translate')('commons.retry'));
                    $ionicLoading.hide(); 
                }else if(data.retcode === 3){
                    PopUpServices.errorPopup('Username già presente nel sistema. '+ $filter('translate')('commons.retry'));
                    $ionicLoading.hide(); 
                }else{
                    PopUpServices.errorPopup('Si è verificato un errore. '+ $filter('translate')('commons.retry'));
                    $ionicLoading.hide(); 
                }
                $ionicLoading.hide();
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            })
        });
    }
    $scope.openUrl = function(url){
        if (url) {
            window.open(url, '_system', 'location=yes');
        }
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

    $scope.onScroll = function (params) {
        if (cordova && cordova.plugins && cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
            cordova.plugins.Keyboard.close();
        }
    };

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

    $scope.onScroll();

    $scope.goToStep2 = function (params) {
        if (!$scope.request.email || !$scope.request.email.match(RegexService.getRegex().email)) {
            PopUpServices.messagePopup('Il campo Email non è corretto', 'Attenzione');
        }else if($scope.request.email !== $scope.request.confirmEmail ){
            PopUpServices.messagePopup('I campi Email non combaciano', 'Attenzione');
        }else if($scope.request.password !== $scope.request.confirmPassword){
            PopUpServices.messagePopup('I campi Password non combaciano', 'Attenzione');
        }else if(($scope.request.password && !$scope.request.password.match(RegexService.getRegex().password) )|| (!$scope.request.password || !$scope.request.confirmPassword)){
            PopUpServices.messagePopup('La Password deve contenere un minimo di 8 caratteri e massimo 20, che contenga almeno una lettera maiuscola e almeno un numero', 'Attenzione');
        } else {
            $scope.step = 2;
        }
        

    };


    /* var myInput = document.getElementById('confirmEmail');
    myInput.onpaste = function(e) {
        e.preventDefault();
    } */
    
})