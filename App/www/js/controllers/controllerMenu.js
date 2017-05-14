angular.module('starter').controller('MenuCtrl', function($rootScope, $scope, $http, $state, $ionicLoading, InfoFactories, WebService) {
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.userInfo = InfoFactories.getUserInfo();

    $scope.logout = function() {
    	var driverNumber = InfoFactories.getUserInfo().driverNumber;
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
})