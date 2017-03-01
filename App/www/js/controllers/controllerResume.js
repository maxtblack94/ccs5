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

    function fixFromDateTime (){
        var hours = new Date($scope.timeFromPick.inputTime).getHours();
        var minutes = new Date($scope.timeFromPick.inputTime).getMinutes();
        var finalDate = new Date($scope.dateFromPick.inputDate).setHours(hours,minutes,0,0);
        $scope.dateTimeFrom = finalDate;
    }

    $scope.selectFromDate = function() {
        $scope.dateFromPick = {
            date: $scope.dateFromPick ? ($scope.dateFromPick.inputDate ? $scope.dateFromPick.inputDate : new Date()) : new Date(),
            mode: 'date',
            allowOldDates: false,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        $cordovaDatePicker.show($scope.dateFromPick).then(function(date) {            
            $scope.dateFromPick.inputDate = date;
            $timeout(function() {
                $scope.selectFromTime();
            }, 500);
        });
    };
    
    $scope.selectFromTime = function() {
        var sameday = false;
        if($scope.dateFromPick.inputDate) {
            if($scope.dateFromPick.inputDate.getDate() == new Date().getDate() 
                && $scope.dateFromPick.inputDate.getMonth() == new Date().getMonth()
                && $scope.dateFromPick.inputDate.getFullYear() == new Date().getFullYear())
                sameday = true;
        }
        
        $scope.timeFromPick = {
            date: $scope.timeFromPick ? ($scope.timeFromPick.inputTime ? $scope.timeFromPick.inputTime : new Date()) : new Date(),
            mode: 'time',
            is24Hour: true,
            allowOldDates: true,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        if(sameday){
            $scope.timeFromPick.minDate = new Date() - 10000;
        }
        $cordovaDatePicker.show($scope.timeFromPick).then(function(time) {
            
            $scope.timeFromPick.inputTime = time;
            fixFromDateTime();
        });
    };
})