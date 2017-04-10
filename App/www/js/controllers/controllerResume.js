angular.module('starter').controller('ResumeCtrl', function($timeout, $cordovaDatePicker, $scope, InfoFactories, $state, $ionicLoading, WebService) {
    $scope.locale = window.locale;
    InfoFactories.setTelepass(false);
    InfoFactories.setCC(false);
    $scope.selectedParking = InfoFactories.getPark();
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.selectedDriverRange = InfoFactories.getSelectedRangeDriver();
    $scope.dateTimeFrom = InfoFactories.getDateTimeFrom();
    $scope.dateTimeTo = InfoFactories.getDateTimeTo();
    $scope.errorMessage = $state.params.error ? $scope.locale.vehicle.labelCannotReserve : null;
    if($scope.selectedClient.drivingRange){
        $ionicLoading.show();
        WebService.ajaxPostRequestDirect(610, function(data) {
            $scope.listDriverRange = data.ListDriverRange;
            $ionicLoading.hide();
        });
    }
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
        if(datesCheck()){
            if($scope.selectedClient.drivingRange){
                InfoFactories.setSelectedRangeDriver($scope.selectedDriverRange);
            }
            $state.go('tab.selcar');
        }
    };

    function datesCheck (){
        $scope.errorMessage = null;
        if(!$scope.selectedParking){
            $scope.errorMessage = $scope.locale.resume.wrongParking;
            return false;
        }
        if(!$scope.dateTimeTo || !$scope.dateTimeFrom){
            $scope.errorMessage = $scope.locale.resume.wrongDates;
            return false;
        }else{
            var dateTimeTo = new Date($scope.dateTimeTo);
            var dateTimeFrom = new Date($scope.dateTimeFrom)
            if(new Date() - dateTimeFrom > 0){
                $scope.errorMessage = "La data di ritiro deve essere superiore alla data attuale";
                return false;
            }else if((dateTimeTo - dateTimeFrom) < 0){
                $scope.errorMessage = "La data di ritiro è maggiore della data di consegna";
                return false;
            }else if(!$scope.selectedParking.h24 && dateTimeFrom.getHours() < $scope.selectedParking.opening.getHours() || dateTimeFrom.getHours() >$scope.selectedParking.closing.getHours()){
                $scope.errorMessage = "La data di ritiro non rientra negli orari di apertura del parcheggio";
                return false;
            }else if(!$scope.selectedParking.h24 && dateTimeTo.getHours() < $scope.selectedParking.opening.getHours() || dateTimeTo.getHours() > $scope.selectedParking.closing.getHours()){
                $scope.errorMessage = "La data di consegna non rientra negli orari di apertura del parcheggio";
                return false;
            }else if($scope.selectedClient.drivingRange == true && $scope.selectedDriverRange.value == "short"){
                $scope.errorMessage = "Non hai definito il raggio di percorrenza";
                return false;
            }
            return true;
        }
        
    }

    function fixDateTime (date, time, type){
        var hours = new Date(time).getHours();
        var minutes = new Date(time).getMinutes();
        var newDate = new Date(date).setHours(hours,minutes,0,0);
        if(type == 'to'){
            var dateFrom = $scope.dateTimeFrom ? $scope.dateTimeFrom : undefined;
            $scope.dateTimeTo = InfoFactories.resetDateForDefect(newDate, dateFrom);
            InfoFactories.setDateTimeTo($scope.dateTimeTo);
        }else if(type == 'from'){
            if(new Date(Date.now() + 60000 * 10) - newDate > 0){
                newDate = InfoFactories.resetDateService(newDate);
            }else{
                newDate = InfoFactories.resetDateForDefect(newDate);
            };
            $scope.dateTimeFrom = newDate;
            InfoFactories.setDateTimeFrom($scope.dateTimeFrom);
        }
    }

    $scope.selectFromDate = function() {
        var dateFromConfig = {
            date: $scope.dateTimeFrom ? new Date($scope.dateTimeFrom) : new Date(),
            mode: 'date',
            allowOldDates: false,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        $cordovaDatePicker.show(dateFromConfig).then(function(date) {
            if(date){
                $timeout(function() {
                    selectFromTime(date);
                }, 300);
            }            
        });
    };
    
    function selectFromTime (date) {
        var timeFromConfig = {
            date: $scope.dateTimeFrom ? new Date($scope.dateTimeFrom) : new Date(),
            mode: 'time',
            is24Hour: true,
            allowOldDates: true,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        $cordovaDatePicker.show(timeFromConfig).then(function(time) {
            if(time){
                fixDateTime(date, time, 'from');
            }
        });
    };

    $scope.selectToDate = function() {
            
        var dateToConfig = {
            date: $scope.dateTimeFrom ? new Date($scope.dateTimeFrom) : $scope.dateTimeTo ? new Date($scope.dateTimeTo) : new Date(),
            mode: 'date',
            allowOldDates: false,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        $cordovaDatePicker.show(dateToConfig).then(function(date) {
            if(date){
                $timeout(function() {
                    selectToTime(date);
                }, 500)
            }
        });
    };
    
    function selectToTime (date) {
        var timeToConfig = {
            date: $scope.dateTimeFrom ? new Date($scope.dateTimeFrom) : $scope.dateTimeTo ? new Date($scope.dateTimeTo) : new Date(),
            mode: 'time',
            is24Hour: true,
            allowOldDates: true,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        $cordovaDatePicker.show(timeToConfig).then(function(time) {
            if(time){
                fixDateTime(date, time, 'to');
            }
        });
    };
})