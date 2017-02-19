angular.module('starter').controller('CarCtrl', function($scope, $http, $rootScope, $state, InfoFactories, $timeout, $ionicModal, $ionicLoading, $ionicPopup, WebService) {
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.selectedParking = InfoFactories.getPark();
    $scope.hasTelepass  = InfoFactories.getTelepass();
    $scope.hasCC = InfoFactories.getCC();
    $scope.datesInfo = InfoFactories.getDatesInfo();
    
    $scope.onSelect = function(car) {
        $state.go('confirmPrenotation', {'car':car});
    };
    
     function loadVehicles () {
        $scope.vehicleList = null;
        var cc = !$scope.selectedClient.cc ? false : InfoFactories.getCC();
        var telepass = !$scope.selectedClient.telepass ? false : InfoFactories.getTelepass()
        $rootScope.cannotReserve = false;
        $ionicLoading.show();
		$http.get("res/571.xml").success(function(res) {                                       
			res = res.replace('{NUMBER_PARKING}', InfoFactories.getPark().Nr)
					 .replace('{NUMBER_DRIVER}', window.localStorage.getItem('Nr'))
					 .replace('{DATE_FROM}', moment($rootScope.dateFromPick.inputDate).format('DD/MM/YYYY'))
					 .replace('{DATE_TO}', moment($rootScope.dateToPick.inputDate).format('DD/MM/YYYY'))
					 .replace('{TIME_FROM}', moment($rootScope.timeFromPick.inputTime).format('HH:mm'))
					 .replace('{TIME_TO}', moment($rootScope.timeToPick.inputTime).format('HH:mm'))
					 .replace('{CC}', cc)
					 .replace('{TELEPASS}', telepass)
					 .replace('{DRIVING_RANGE}', InfoFactories.getSelectedRangeDriver().value);

            WebService.ajaxPostRequest(res, 571, function(data) {
                $scope.loading = false;
                $ionicLoading.hide();
                                       
                if(data.retcode == 1) {
                    $rootScope.cannotReserve = true; 
                    $state.go('tab.resume');
                }
                                       
				$scope.vehicleList = data.data.VehiclesList;
				
				for(var i = 0; i < $scope.vehicleList.length; i++) {
					switch($scope.vehicleList[i].fuel_quantity) {
						default: 
							break;
						case '0/4': 
							$scope.vehicleList[i].fuel_quantity = '0%';
						case '1/4': 
							$scope.vehicleList[i].fuel_quantity = '25%';
							break;
						case '2/4': 
							$scope.vehicleList[i].fuel_quantity = '50%';
							break;
						case '3/4': 
							$scope.vehicleList[i].fuel_quantity = '75%';
							break;
						case '4/4': 
							$scope.vehicleList[i].fuel_quantity = '100%';
							break;
					}
				}
					
			});
		});
    };

	$scope.refreshCars = function(){
		$scope.vehicleList = null;
        loadVehicles();
        $scope.$broadcast('scroll.refreshComplete');
    }

	loadVehicles();
    
})