angular.module('starter').controller('ParkCtrl', function($ionicNavBarDelegate, $scope, ReservationService, PopUpServices, InfoFactories, $filter, $state, $ionicLoading, ScriptServices) {
  
    function init() {
        $ionicNavBarDelegate.showBackButton(false);
       $ionicLoading.show();
       ScriptServices.getXMLResource(512).then(function(res) {
           var driverNumber = InfoFactories.getUserInfo().driverNumber;
           res = res.replace('{DRIVER_NUMBER}', driverNumber);
           ScriptServices.callGenericService(res, 512).then(function(data) {
               $scope.parkingList = data.data.ParkingsList || [];
               $ionicLoading.hide();
           }, function(error) {
               $ionicLoading.hide();
               PopUpServices.errorPopup($filter('translate')('commons.retry'));
           })
       });
   };
   
   $scope.selectParking = function(parking) {
        ReservationService.setPark(parking)
       $state.go('reserve');
   };

   $scope.refreshParks = function(){
       $scope.parkingList = null;
       init();
       $scope.$broadcast('scroll.refreshComplete');
   }
   
   init();
})