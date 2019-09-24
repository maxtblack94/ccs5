angular.module('starter').controller('PoolingTimesCtrl', function($filter, $ionicHistory, ReservationService, ManipolationServices, PopUpServices, $scope, $state, InfoFactories, $timeout, $ionicLoading, $ionicPopup, ScriptServices) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope = Object.assign($scope, ReservationService.instance);
    
    $scope.onSelect = function(time) {
        $state.go('pooling-confirm', {'time':time});
    };

    function loadVehicles () {
        getTimes();
    }


    $scope.back = function (params) {
       $ionicHistory.goBack();
    };

    $scope.cancel = function () {
        ReservationService.resetReservation();
        $state.go('tab.bookings');
    };

    function callbackMissingRecords (){
        $state.go('reserve');
    }

	$scope.refreshCars = function(){
		$scope.vehicleList = null;
        loadVehicles();
        $scope.$broadcast('scroll.refreshComplete');
    };

    function finalizeData(data) {
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
                if ($scope.vehicleList[i].fuel_quantity) {
                    $scope.vehicleList[i].fuel_quantity = ManipolationServices.trascodeFuel($scope.vehicleList[i].fuel_quantity);
                }
            }
        }else {
            $scope.vehicleList = data.data.VehiclesList;
            for(var k = 0; k < $scope.vehicleList.length; k++) {
                if ($scope.vehicleList[k].fuel_quantity) {
                    $scope.vehicleList[k].fuel_quantity = ManipolationServices.trascodeFuel($scope.vehicleList[k].fuel_quantity);
                }
            }
        }
    }

    function getTimes() {
        $scope.vehicleList = [
            {
                "Nr": "2004",
                "plate": "TEST086",
                "brand_model": "Panda Van",
                "displacement": "",
                "color": "Blu",
                "colorApp": "BLUE",
                "vehicle_status": "Ok",
                "vehicle_cleanness_status": "Ok",
                "fuel_quantity": "2/4",
                "electric_quantity": "69%",
                "daily_mileage": "0",
                "km": "00",
                "fuel": "Gasolio",
                "seats": "",
                "lat": "0",
                "lng": "0",
                "image_max": "",
                "image_min": "",
                "date": "25/09/2019",
                "time": "10:00"
            },
            {
                "Nr": "5331",
                "plate": "TEST102",
                "brand_model": "Punto Van 1.3 MJT",
                "displacement": "1500",
                "color": "Blu",
                "colorApp": "BLUE",
                "vehicle_status": "Ok",
                "vehicle_cleanness_status": "Ok",
                "fuel_quantity": "2/4",
                "daily_mileage": "0",
                "km": "00",
                "fuel": "Gasolio",
                "seats": "9",
                "lat": "45.6504213333333",
                "lng": "12.4188623333333",
                "image_max": "http://corporatecarsharing.it/images/vehicles/peugeot/208-white-l.jpg",
                "image_min": "http://corporatecarsharing.it/images/vehicles/peugeot/208-white-s.jpg",
                "date": "25/09/2019",
                "time": "10:15"
            },
            {
                "Nr": "5332",
                "plate": "TEST057",
                "brand_model": "Punto Van 1.3 MJT",
                "displacement": "",
                "color": "Blu",
                "colorApp": "BLUE",
                "vehicle_status": "Ok",
                "vehicle_cleanness_status": "Ok",
                "fuel_quantity": "2/4",
                "daily_mileage": "0",
                "km": "00",
                "fuel": "Gasolio",
                "seats": "",
                "lat": "45.6501091666667",
                "lng": "12.4190953333333",
                "image_max": "",
                "image_min": "",
                "date": "25/09/2019",
                "time": "10:30"
            }
        ];


        /* $scope.vehicleList = null;
        var cc = !$scope.selectedClient.cc ? false : InfoFactories.getCC();
        var telepass = !$scope.selectedClient.telepass ? false : InfoFactories.getTelepass()
        $ionicLoading.show();
         ScriptServices.getXMLResource(571).then(function(res) {
            res = res.replace('{NUMBER_PARKING}', $scope.selectedPark.Nr)
                     .replace('{NUMBER_PARKINGR}', ($scope.selectedParkB || {}).Nr || $scope.selectedPark.Nr)
					 .replace('{NUMBER_DRIVER}', InfoFactories.getUserInfo().driverNumber)
					 .replace('{DATE_FROM}', moment($scope.dateTimeFrom).format('DD/MM/YYYY'))
					 .replace('{DATE_TO}', moment($scope.dateTimeTo).format('DD/MM/YYYY'))
					 .replace('{TIME_FROM}', moment($scope.dateTimeFrom).format('HH:mm'))
					 .replace('{TIME_TO}', moment($scope.dateTimeTo).format('HH:mm'))
					 .replace('{CC}', cc)
					 .replace('{TELEPASS}', telepass)
					 .replace('{DRIVING_RANGE}', $scope.driverRange.value.code || 'short')
                     .replace('{VEHICLETYPE}', $scope.vehicleType || null)
                     .replace('{SERVICEID}', $scope.selectedService.id)
                    .replace('{TARIFFAID}', $scope.selectedTarif.value.id);
            ScriptServices.callGenericService(res, 571).then(function(data) {
                $scope.loading = false;
                $ionicLoading.hide();
                finalizeData(data);
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            });
        }); */
    }

    loadVehicles();
});