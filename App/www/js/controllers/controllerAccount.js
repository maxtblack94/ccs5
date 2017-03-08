angular.module('starter').controller('AccountCtrl', function($rootScope, $scope, $http, $state, $ionicLoading, InfoFactories, WebService) {
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    
    $scope.setHasPicture = function() {
        $rootScope.hasPicture = !$rootScope.hasPicture;
        window.localStorage.setItem('hasPicture', $rootScope.hasPicture);
    };
    
    $scope.logout = function() {
    	var nr = window.localStorage.getItem('Nr');
    	window.localStorage.removeItem('Nr');
        
        $ionicLoading.show();
        $http.get("res/569.xml").success(function(res) {
            $ionicLoading.hide();
        
    		res = res.replace('{USER_ID}', nr);
    		WebService.ajaxPostRequest(res, 569, null);
            InfoFactories.resetService();
            window.localStorage.removeItem('selclient');
    	    window.localStorage.removeItem('favoriteParking');
            $state.go('login');
    	});
    };
})