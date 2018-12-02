angular.module('starter').controller('CarCtrl', function($filter, ManipolationServices, PopUpServices, $scope, $state, InfoFactories, $timeout, $ionicLoading, $ionicPopup, ScriptServices) {
    $scope.dateTimeFrom = InfoFactories.getDateTimeFrom();
    $scope.dateTimeTo = InfoFactories.getDateTimeTo();
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.selectedParking = InfoFactories.getPark();
    $scope.hasTelepass  = InfoFactories.getTelepass();
    $scope.hasCC = InfoFactories.getCC();
    
    $scope.onSelect = function(car) {
        $state.go('confirmPrenotation', {'car':car});
    };

    $scope.goResume = function(){
        $state.go('tab.resume');
    }
    
     function loadVehicles () {
        $scope.vehicleList = null;
        var cc = !$scope.selectedClient.cc ? false : InfoFactories.getCC();
        var telepass = !$scope.selectedClient.telepass ? false : InfoFactories.getTelepass()
        $ionicLoading.show();
         ScriptServices.getXMLResource(571).then(function(res) {
            res = res.replace('{NUMBER_PARKING}', InfoFactories.getPark().Nr)
					 .replace('{NUMBER_DRIVER}', InfoFactories.getUserInfo().driverNumber)
					 .replace('{DATE_FROM}', moment($scope.dateTimeFrom).format('DD/MM/YYYY'))
					 .replace('{DATE_TO}', moment($scope.dateTimeTo).format('DD/MM/YYYY'))
					 .replace('{TIME_FROM}', moment($scope.dateTimeFrom).format('HH:mm'))
					 .replace('{TIME_TO}', moment($scope.dateTimeTo).format('HH:mm'))
					 .replace('{CC}', cc)
					 .replace('{TELEPASS}', telepass)
					 .replace('{DRIVING_RANGE}', InfoFactories.getSelectedRangeDriver().value)
                     .replace('{VEHICLETYPE}', InfoFactories.getSelectedVehicleType().value);
            ScriptServices.callGenericService(res, 571).then(function(data) {
                $scope.loading = false;
                $ionicLoading.hide();
                if(data.retcode == 2) {
                    PopUpServices.messagePopup($filter('translate')('vehicle.labelCannotReserve'), $filter('translate')('commons.attention'), callbackMissingRecords);
                }else if(data.retcode == 1 || data.retcode == 3){
                    PopUpServices.messagePopup($filter('translate')('vehicle.noVehiclesInThisMoment'), $filter('translate')('commons.attention'), callbackMissingRecords);
                }else if(data.retcode == 50 && data.retDescription){
                    PopUpServices.messagePopup(data.retDescription, $filter('translate')('commons.attention'), callbackMissingRecords);
                }else if(data.retcode == 51 && data.retDescription){
                    PopUpServices.messagePopup(data.retDescription, $filter('translate')('commons.attention'));
                    $scope.vehicleList = data.data.VehiclesList;
                    for(var i = 0; i < $scope.vehicleList.length; i++) {
                        $scope.vehicleList[i].fuel_quantity = ManipolationServices.trascodeFuel($scope.vehicleList[i].fuel_quantity);
                    }
                }else{
                    $scope.vehicleList = data.data.VehiclesList;
                    for(var i = 0; i < $scope.vehicleList.length; i++) {
                        $scope.vehicleList[i].fuel_quantity = ManipolationServices.trascodeFuel($scope.vehicleList[i].fuel_quantity);
                    }
                }
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup(error+', ' + $filter('translate')('commons.retry'));
            })
        });
    };

    function callbackMissingRecords (){
        $state.go('tab.resume');
    }

	$scope.refreshCars = function(){
		$scope.vehicleList = null;
        loadVehicles();
        $scope.$broadcast('scroll.refreshComplete');
    }

    if(!$scope.dateTimeFrom || !$scope.dateTimeTo){
        $timeout(function() {
            $state.go('tab.resume');
        }, 200);
    }else{
        loadVehicles();
    }
})