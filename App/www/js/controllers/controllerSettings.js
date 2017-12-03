angular.module('starter').controller('SettingsCtrl', function($rootScope, $scope, $http, $state, $ionicLoading, InfoFactories) {
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    
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

    var counter = 0;
    $scope.deleteClienteContext = function(){
        if(counter===4){
            $scope.logout('clearClient');
        }else{
            counter++
        }
    }
})