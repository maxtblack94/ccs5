angular.module('starter').controller('SettingsCtrl', function(PopUpServices, ScriptServices, $rootScope, $scope, $http, $state, $ionicLoading, InfoFactories, PopUpServices) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.userInfo = InfoFactories.getUserInfo();
    
    $scope.setHasPicture = function() {
        $rootScope.hasPicture = !$rootScope.hasPicture;
        window.localStorage.setItem('hasPicture', $rootScope.hasPicture);
    };
    
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

    var counter = 0;
    $scope.deleteClienteContext = function(){
        if(counter===4){
            $scope.logout('clearClient');
        }else{
            counter++
        }
    }
})