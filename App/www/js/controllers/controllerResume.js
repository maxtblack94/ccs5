angular.module('starter').controller('ResumeCtrl', function($timeout, $cordovaDatePicker, $scope, InfoFactories, $state, $ionicLoading, WebService) {
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
    
    $scope.changeParking = function() {
        $state.go('tab.parking');
    };
    
    $scope.searchVehicle = function() {
        if($scope.selectedClient.drivingRange){
            InfoFactories.setSelectedRangeDriver($scope.selectedDriverRange);
        }
        $state.go('tab.selcar');
    };

    var dateFromConfig = {
        date: $scope.dateFromPick ? $scope.dateFromPick : new Date(),
        mode: 'date',
        allowOldDates: false,
        allowFutureDates: true,
        doneButtonLabel: $scope.locale.date.butChange,
        cancelButtonLabel: $scope.locale.date.labelClose,
        cancelButtonColor: '#000000',
        locale: $scope.locale.locale
    };

    var timeFromPick = {
        date: $scope.timeFromPick ? $rootScope.timeFromPick.inputTime : new Date(),
        mode: 'time',
        is24Hour: true,
        allowOldDates: true,
        allowFutureDates: true,
        doneButtonLabel: $scope.locale.date.butChange,
        cancelButtonLabel: $scope.locale.date.labelClose,
        cancelButtonColor: '#000000',
        locale: $scope.locale.locale
    };

    function startTimePicker (){
        $cordovaDatePicker.show(timeFromPick).then(function(time) {
            $scope.timeFromPick = time;
                });
    }

    $scope.selectFromDateTime = function(){
        
        $cordovaDatePicker.show(dateFromConfig).then(function(date) {
            if(date){
                $scope.dateFromPick = date;
                $timeout(function() {
                    startTimePicker();
                }, 1000);
            }else{

            }
            
        });
    }
})