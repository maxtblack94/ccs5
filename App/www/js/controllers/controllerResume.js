angular.module('starter').controller('ResumeCtrl', function($scope, InfoFactories, $state, $ionicLoading, WebService) {
    $scope.locale = window.locale;
    $scope.selectedParking = InfoFactories.getPark();
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.selectedDriverRange = InfoFactories.getSelectedRangeDriver();
	
    $ionicLoading.show();
	WebService.ajaxPostRequestDirect(610, function(data) {
        $ionicLoading.hide();
        $scope.listDriverRange = data.ListDriverRange;
    });
  
    $scope.setHasCC = function() {
        $scope.hasCC = !$scope.hasCC;
        InfoFactories.setCC($scope.hasCC);
    };
  
    $scope.setHasTelepass = function() {
        $scope.hasTelepass = !$scope.hasTelepass;
        InfoFactories.setTelepass($scope.hasTelepass);
    };
    
    $scope.changeDate = function() {
        $state.go('tab.newbooking');
    };
    
    $scope.changeParking = function() {
        $state.go('tab.parking');
    };
    
    $scope.searchVehicle = function() {
        if($scope.selectedClient.drivingRange){
            InfoFactories.setSelectedRangeDriver($scope.selectedDriverRange);
        }
        $state.go('tab.selcar');
    };
})