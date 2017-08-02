angular.module('starter').controller('ParkingCtrl', function($scope, PopUpServices, InfoFactories, $http, $state, $ionicLoading, ScriptServices) {
    $scope.locale = window.locale;
  
     function init() {
        $ionicLoading.show();
        ScriptServices.getXMLResource(512).then(function(res) {
            var driverNumber = InfoFactories.getUserInfo().driverNumber;
            res = res.replace('{DRIVER_NUMBER}', driverNumber);
            ScriptServices.callGenericService(res, 512).then(function(data) {
	            $scope.parkingList = data.data.ParkingsList || [];
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
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup(error+', riprovare!');
            })
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