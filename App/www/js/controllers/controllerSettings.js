angular.module('starter').controller('SettingsCtrl', function(PopUpServices, LanguageService, ScriptServices, $rootScope, $scope, $http, $state, $ionicLoading, InfoFactories) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.userInfo = InfoFactories.getUserInfo();
    $scope.getCurrentLang =  function() {
        if (LanguageService.currentLanguage() && (LanguageService.currentLanguage().toUpperCase() === 'IT_IT' || LanguageService.currentLanguage().toUpperCase() === 'IT-IT')) {
            return "Italiano";
        } else {
            return "English";
        }
    };
    
    $scope.setHasPicture = function() {
        $rootScope.hasPicture = !$rootScope.hasPicture;
        window.localStorage.setItem('hasPicture', $rootScope.hasPicture);
    };

    $scope.changeLang = function () {
        if (LanguageService.currentLanguage().startsWith('it')) {
            LanguageService.changeLanguage('en');
        } else {
            LanguageService.changeLanguage('it_IT');
        }
    }

    $scope.checkActiveOrCredited = function () {
        return $scope.userInfo.registry.account_status === 'CREDITED' || $scope.userInfo.registry.account_status === 'ACTIVE';
    }
    
    $scope.logout = function(action) {
    	var driverNumber = InfoFactories.getUserInfo().driverNumber;
    	window.localStorage.removeItem('userInfo');
        $ionicLoading.show();
        ScriptServices.getXMLResource(569).then(function(res) {
            res = res.replace('{USER_ID}', driverNumber);
            $ionicLoading.hide();
            ScriptServices.callGenericService(res, 569);
            InfoFactories.resetService();
            if(action==='clearClient'){
                window.localStorage.removeItem('selectedClient');
            }
            $state.go('login');
        });
    };

    var counter = 0;
    $scope.deleteClienteContext = function(){
        if(counter===4){
            $scope.logout('clearClient');
        }else{
            counter++
        }
    }


    $scope.openLink = function () {
        $ionicLoading.show();
        ScriptServices.getXMLResource(663).then(function(res) {
            res = res.replace('{DRIVERID}', $scope.userInfo.driverNumber || null);
            ScriptServices.callGenericService(res, 663).then(function(data) {
                window.open(data.data, '_system', 'location=yes');
                $state.go('tab.bookings');
                $ionicLoading.hide();
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            });
        });
    }

    $scope.editAccount = function() {
        $state.go('completeRegistration', {isEdit: true});
    }

    $scope.startSetefy = function (params) {
        $ionicLoading.show();
        ScriptServices.getXMLResource(655).then(function(res) {
            res = res.replace('{DRIVERID}', InfoFactories.getUserInfo().driverNumber || null);
            ScriptServices.callGenericService(res, 655).then(function(data) {
                window.open(data.data, '_system', 'location=yes');
                $state.go('tab.bookings');
                $ionicLoading.hide();
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            });
        });
    };

});