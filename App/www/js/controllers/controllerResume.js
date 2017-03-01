angular.module('starter').controller('ResumeCtrl', function($timeout, $cordovaDatePicker, $scope, InfoFactories, $state, $ionicLoading, WebService) {
    $scope.locale = window.locale;
    $scope.selectedParking = InfoFactories.getPark();
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.selectedDriverRange = InfoFactories.getSelectedRangeDriver();
    $scope.dateTimeFrom = InfoFactories.getDateTimeFrom();
    $scope.dateTimeTo = InfoFactories.getDateTimeTo();
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

    function fixFromDateTime (){
        var hours = new Date($scope.timeFromPick.inputTime).getHours();
        var minutes = new Date($scope.timeFromPick.inputTime).getMinutes();
        var dateFrom = new Date($scope.dateFromPick.inputDate).setHours(hours,minutes,0,0);
        $scope.dateTimeFrom = dateFrom;
        InfoFactories.setDateTimeFrom(dateFrom);
    }

    function fixToDateTime (){
        var hours = new Date($scope.timeToPick.inputTime).getHours();
        var minutes = new Date($scope.timeToPick.inputTime).getMinutes();
        var dateTo = new Date($scope.dateToPick.inputDate).setHours(hours,minutes,0,0);
        $scope.dateTimeTo = dateTo;
        InfoFactories.setDateTimeTo(dateTo);
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
            }, 300);
        });
    };
    
    $scope.selectFromTime = function() {
                
        $scope.timeFromPick = {
            date: $scope.timeFromPick ? ($scope.timeFromPick.inputTime ? $scope.timeFromPick.inputTime : new Date()) : new Date(),
            mode: 'time',
            is24Hour: true,
            minDate : new Date() - 10000,
            allowOldDates: true,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        $cordovaDatePicker.show($scope.timeFromPick).then(function(time) {
            
            $scope.timeFromPick.inputTime = time;
            fixFromDateTime();
        });
    };

    $scope.selectToDate = function() {
            
        $scope.dateToPick = {
            date: new Date(),
            mode: 'date',
            //minDate: new Date() - 10000,
            allowOldDates: false,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        $cordovaDatePicker.show($scope.dateToPick).then(function(date) {
            
            $scope.dateToPick.inputDate = date;
            $timeout(function() {
                $scope.selectToTime();
            }, 500)
        });
    };
    
    $scope.selectToTime = function() {
        $scope.timeToPick = {
            date: $scope.timeToPick ? ($scope.timeToPick.inputTime ? $scope.timeToPick.inputTime : new Date()) : new Date(),
            mode: 'time',
            minDate: new Date() - 10000,
            is24Hour: true,
            allowOldDates: true,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        $cordovaDatePicker.show($scope.timeToPick).then(function(time) {
            $scope.timeToPick.inputTime = time;
            fixToDateTime()
        });
    };
})