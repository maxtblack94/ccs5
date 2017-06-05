angular.module('starter').controller('MenuCtrl', function($ionicSideMenuDelegate, $rootScope, $scope, $http, $state, $ionicLoading, InfoFactories, WebService) {
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.userInfo = InfoFactories.getUserInfo();

    $scope.$watch('userInfo', function(newValue, oldValue) {
        $scope.userInfo = newValue;
    });

    $scope.logout = function() {
        $ionicSideMenuDelegate.toggleLeft(false);
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