angular.module('starter').controller('AccountCtrl', function($rootScope, $scope, $http, $state, $ionicLoading, InfoFactories, WebService) {
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    
    $scope.setHasPicture = function() {
        $rootScope.hasPicture = !$rootScope.hasPicture;
        window.localStorage.setItem('hasPicture', $rootScope.hasPicture);
    };
    
    $scope.logout = function() {
    	var driverNumber = InfoFactories.userInfo().driverNumber;
    	window.localStorage.removeItem('userInfo');
        $ionicLoading.show();
        $http.get("res/569.xml").success(function(res) {
            $ionicLoading.hide();
    		res = res.replace('{USER_ID}', driverNumber);
    		WebService.ajaxPostRequest(res, 569, null);
            InfoFactories.resetService();
            $state.go('login');
    	});
    };

    var counter = 0;
    $scope.deleteClienteContext = function(){
        if(counter===4){
            window.localStorage.removeItem('selectedClient');
            $scope.logout();
        }else{
            counter++
        }
    }
})