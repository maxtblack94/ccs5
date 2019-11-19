angular.module('starter').controller('ParkCtrl', function($ionicHistory, $stateParams, $ionicNavBarDelegate, $scope, ReservationService, PopUpServices, InfoFactories, $filter, $state, $ionicLoading, ScriptServices) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope = Object.assign($scope, ReservationService.instance);
    var preselectParkBackup = $scope.preselectPark.value;

    function init() {
        $scope.parkDirection = $stateParams.parkDirection;
        $ionicNavBarDelegate.showBackButton(false);
        $ionicLoading.show();
        if (($scope.selectedService || {}).parkingTypeCode === 'BT2' || ($scope.selectedService || {}).parkingTypeCode === 'BT3' || ($scope.selectedService || {}).parkingTypeCode === 'PF3' ) {
            $scope.preselectPark.value = true;
        }
        ScriptServices.getXMLResource(512).then(function(res) {
            var driverNumber = InfoFactories.getUserInfo().driverNumber;
            res = res.replace('{DRIVER_NUMBER}', driverNumber);
            ScriptServices.callGenericService(res, 512).then(function(data) {
                $scope.parkingList = data.data.ParkingsList || [];

                if ($scope.parkDirection === 'B' && ($scope.selectedService || {}).parkingTypeCode === 'PF3') {
                    $scope.parkingList = $scope.parkingList.filter(function (item) {
                        return item.position > $scope.selectedPark.position;
                    });
                }
                $ionicLoading.hide();
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            });
        });
   }
   
   $scope.selectParking = function(parking) {
       if ((!$scope.parkDirection && $scope.preselectPark.value) || ($scope.parkDirection === 'A' && $scope.preselectPark.value !== preselectParkBackup && $scope.preselectPark.value === true)) {
        ReservationService.setPark(parking);
        $state.go('park', {parkDirection: 'B'});
       } else if(!$scope.preselectPark.value) {
        ReservationService.setPark(parking);
        ReservationService.setParkB(null);
        goReserve();
       } else if ($scope.parkDirection === 'A') {
        ReservationService.setPark(parking);
        goReserve();
       } else if ($scope.parkDirection === 'B') {
        ReservationService.setParkB(parking);
        goReserve();
       }
   };

   function goReserve() {
       if (($scope.selectedService || {}).parkingTypeCode === 'PF3') {
        $state.go('pooling-reserve');
       } else {
        $state.go('reserve');
       }
   }

   $scope.refreshParks = function(){
       $scope.parkingList = null;
       init();
       $scope.$broadcast('scroll.refreshComplete');
   };

   $scope.cancel = function () {
    ReservationService.resetReservation();
    $state.go('tab.bookings');
   };

   $scope.back = function (params) {
    $ionicHistory.goBack();
    };

    $scope.getParkTitle = function (params) {
        if (($scope.parkDirection === 'A' || !$scope.parkDirection)  && ($scope.selectedService || {}).parkingTypeCode === 'PF3') {
            return 'Fermata di Partenza';
        } else if($scope.parkDirection === 'B' && ($scope.selectedService || {}).parkingTypeCode === 'PF3') {
            return 'Fermata di Arrivo';
        } else if($scope.parkDirection === 'B') {
            return 'Parcheggio riconsegna';
        } else {
            return 'Parcheggio ritiro';
        }
        
    };
   
   init();
})