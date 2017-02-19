angular.module('starter').controller('AppCtrl', function($rootScope, $scope, $http, $ionicPlatform, $ionicLoading, $ionicTabsDelegate, NotificationService, $state) {
    NotificationService.onDeviceReady();
    
    var p = eval('('+window.localStorage.getItem('hasPicture')+')');  
    if(p){
      $rootScope.hasPicture = true;
    }
        
    $scope.gotoBookings = function() {
        $state.go('tab.bookings');
        if($rootScope.loadBookings){
          $rootScope.loadBookings();
        }  
    }
        
    $scope.gotoNewbooking = function() {
        $state.go('tab.newbooking');
    }
        
    $scope.gotoParking = function() {
        if($rootScope.loadParking){
          $rootScope.loadParking();
        }  
        $state.go('tab.parking');
    }
        
    $scope.gotoCar = function() {
        $state.go('tab.resume');
    }
        
    $scope.gotoSettings = function() {
        $state.go('tab.account');
    }
})