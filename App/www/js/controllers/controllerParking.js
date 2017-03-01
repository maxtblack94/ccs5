angular.module('starter').controller('ParkingCtrl', function($scope, $rootScope, InfoFactories, $http, $state, $ionicLoading, WebService) {
    $scope.locale = window.locale;
  
     function init() {
        $ionicLoading.show();
		$http.get("res/512.xml").success(function(res) {
			var driver = window.localStorage.getItem('Nr');
			res = res.replace('{DRIVER_NUMBER}', driver);
			
			WebService.ajaxPostRequest(res, 512, function(data) {
                if(data.data.ParkingsList){
	               $scope.parkingList = data.data.ParkingsList;
                }else{
                    $scope.parkingList = new Array();
                }
                var favo = window.localStorage.getItem('favoriteParking') ? eval('('+window.localStorage.getItem('favoriteParking')+')') : null;
                if(favo){
                    for(var i = 0; i < $scope.parkingList.length; i++){
                        if($scope.parkingList[i].Nr == favo.Nr) {
                            $scope.parkingList[i].selected = true;
                            $scope.selectedParking = $scope.parkingList[i];
                        }
                    }
                }
                $ionicLoading.hide();
			});
		});
    };
    
    $scope.stopPropagation = function(e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
    };
    
    $scope.toggleFavorite = function(parking) {
        var b = parking.selected;
        
        for(var i = 0; i < $scope.parkingList.length; i++)
            $scope.parkingList[i].selected = false;
                
        if(!b) {
            parking.selected = true;
            window.localStorage.setItem('favoriteParking', JSON.stringify(parking));
        }
        else {
            parking.selected = false;
    	    window.localStorage.removeItem('favoriteParking');
        }
    };
    
    $scope.selectParking = function(parking) {
        InfoFactories.setPark(parking);
        $state.go('tab.resume');
    };

    $scope.refreshParks = function(){
        $scope.parkingList = null;
        init();
        $scope.$broadcast('scroll.refreshComplete');
    }
    
    init();
})