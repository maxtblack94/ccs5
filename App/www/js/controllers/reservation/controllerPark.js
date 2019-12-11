angular.module('starter').controller('ParkCtrl', function($ionicHistory, $stateParams, $ionicNavBarDelegate, $scope, ReservationService, PopUpServices, InfoFactories, $filter, $state, $ionicLoading, ScriptServices) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.userInfo = InfoFactories.getUserInfo();
    
    $scope = Object.assign($scope, ReservationService.instance);
    var preselectParkBackup = $scope.preselectPark.value;

    function init() {
        $scope.parkDirection = $stateParams.parkDirection;
        $ionicNavBarDelegate.showBackButton(false);
        $ionicLoading.show();
        if (!$scope.parkDirection && ($scope.selectedService || {}).parkingSelectionCode === 'ATOB') {
            $scope.preselectPark.value = true;
        } else if (!$scope.parkDirection) {
            $scope.preselectPark.value = false;
        }
        ScriptServices.getXMLResource(512).then(function(res) {
            var driverNumber = InfoFactories.getUserInfo().driverNumber;
            res = res.replace('{DRIVER_NUMBER}', driverNumber);
            ScriptServices.callGenericService(res, 512).then(function(data) {
                $scope.parkingList = data.data.ParkingsList || [];
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
        $state.go('reserve');
       } else if ($scope.parkDirection === 'A') {
        ReservationService.setPark(parking);
        $state.go('reserve');
       } else if ($scope.parkDirection === 'B') {
        ReservationService.setParkB(parking);
        $state.go('reserve');
       }
   };

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
       if ($scope.parkDirection === 'B') {
        $ionicHistory.goBack();
       } else if ((($scope.userInfo.registry || {}).services || []) && $scope.userInfo.registry.services.length === 1) {
        $scope.cancel();
       } else {
        $ionicHistory.goBack();
       }
    
    };
   
   init();
})