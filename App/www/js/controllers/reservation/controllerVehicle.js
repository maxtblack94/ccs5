angular.module('starter').controller('VehicleCtrl', function($filter, $ionicHistory, ReservationService, ManipolationServices, PopUpServices, $scope, $state, InfoFactories, $timeout, $ionicLoading, $ionicPopup, ScriptServices) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope = Object.assign($scope, ReservationService.instance);
    
    $scope.onSelect = function(car) {
        $state.go('confirm', {'car':car});
    };

    function loadVehicles () {
        if ($scope.selectedService.parkingTypeCode === 'BT2') {
            getBrandList();
        } else {
            getFullList();
        }
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


    function getBrandList() {
        $scope.vehicleList = null;
        $ionicLoading.show();
         ScriptServices.getXMLResource(641).then(function(res) {
            res = res.replace('{NUMBER_PARKING}', $scope.selectedPark.Nr)
            .replace('{NUMBER_PARKINGR}', ($scope.selectedParkB || {}).Nr || $scope.selectedPark.Nr)
            .replace('{NUMBER_DRIVER}', InfoFactories.getUserInfo().driverNumber)
            .replace('{SERVICE}', $scope.selectedService.id)
            .replace('{TARIFFAID}', $scope.selectedTarif.value.id)
            .replace('{DATADA}', moment($scope.dateTimeFrom).format('DD/MM/YYYY'))
            .replace('{DATAA}', moment($scope.dateTimeTo).format('DD/MM/YYYY'))
            .replace('{ORADA}', moment($scope.dateTimeFrom).format('HH:mm'))
            .replace('{ORAA}', moment($scope.dateTimeTo).format('HH:mm'));
            ScriptServices.callGenericService(res, 641).then(function(data) {
                $scope.loading = false;
                $ionicLoading.hide();
                // da rimuovere dopo fix matteo
                if (data.data) {
                    data.data.VehiclesList = data.data;
                }
                
                finalizeData(data);
            }, function(error) {
                $scope.vehicleList = [];
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            });
        });
    }

    function finalizeData(data) {
        if(data.retcode == 2) {
            PopUpServices.messagePopup($filter('translate')('vehicle.labelCannotReserve'), $filter('translate')('commons.attention'), callbackMissingRecords);
        }else if(data.retcode == 1 || data.retcode == 3){
            PopUpServices.messagePopup($filter('translate')('vehicle.noVehiclesInThisMoment'), $filter('translate')('commons.attention'), callbackMissingRecords);
        }else if(data.retcode == 50 && (data.retDescription || data.description)){
            PopUpServices.messagePopup(data.retDescription || data.description, $filter('translate')('commons.attention'), callbackMissingRecords);
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

    function getFullList() {
        $scope.vehicleList = null;
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
                $scope.vehicleList = [];
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            });
        });
    }

    $scope.showModalInfo = function () {
        var message = $scope.selectedClient.importMessage || "Si ricorda che nel caso di veicolo non Elettrico, l'importo indicato è al netto del costo/km che verrà conteggìato al fine corsa in base ai km effettivamente percorsi.";
        PopUpServices.messagePopup(message, 'Info');
    };

    loadVehicles();
});