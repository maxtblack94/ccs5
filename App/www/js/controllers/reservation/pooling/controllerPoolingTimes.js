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
        $state.go('pooling-reserve');
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
        }else {
            $scope.vehicleList = data.data.VehiclesList;
        }
    }

    function getTimes() {
        $scope.vehicleList = null;
        $ionicLoading.show();
         ScriptServices.getXMLResource(670).then(function(res) {
            res = res.replace('{NUMBER_PARKING}', $scope.selectedPark.Nr)
                     .replace('{NUMBER_PARKINGR}', ($scope.selectedParkB || {}).Nr || $scope.selectedPark.Nr)
					 .replace('{DRIVERID}', InfoFactories.getUserInfo().driverNumber)
					 .replace('{DATE_FROM}', moment($scope.dateFrom).format('DD/MM/YYYY'))
					 .replace('{TIME_FROM}', $scope.timeFrom);
            ScriptServices.callGenericService(res, 670).then(function(data) {
                $scope.loading = false;
                $ionicLoading.hide();
                finalizeData(data);
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            });
        });
    }

    loadVehicles();
});