angular.module('starter').controller('NewbookingsCtrl', function($scope, $rootScope, InfoFactories, $http, $state, $ionicLoading, $cordovaDatePicker, WebService) {
    $scope.locale = window.locale;
    $scope.selectedParking = InfoFactories.getPark();
    
    $scope.selectFromDate = function() {
        $rootScope.dateFromPick = {
            date: $rootScope.dateFromPick ? ($rootScope.dateFromPick.inputDate ? $rootScope.dateFromPick.inputDate : new Date()) : new Date(),
            mode: 'date',
            allowOldDates: false,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        $cordovaDatePicker.show($rootScope.dateFromPick).then(function(date) {
            console.log(date);
            
            if(!date) {
                $scope.dateValidated = false;
                return;
            }
            
            $rootScope.dateFromPick.inputDate = date;
            $scope.checkDatetime();
        });
    };
    
    $scope.selectFromTime = function() {
        var sameday = false;
        if($rootScope.dateFromPick.inputDate) {
            if($rootScope.dateFromPick.inputDate.getDate() == new Date().getDate() 
                && $rootScope.dateFromPick.inputDate.getMonth() == new Date().getMonth()
                && $rootScope.dateFromPick.inputDate.getFullYear() == new Date().getFullYear())
                sameday = true;
        }
        
        $rootScope.timeFromPick = {
            date: $rootScope.timeFromPick ? ($rootScope.timeFromPick.inputTime ? $rootScope.timeFromPick.inputTime : new Date()) : new Date(),
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
            $rootScope.timeFromPick.minDate = new Date() - 10000;
        }
        $cordovaDatePicker.show($rootScope.timeFromPick).then(function(time) {
            console.log(time);
            
            if(!time) {
                $scope.dateValidated = false;
                return;
            }
            
            var d = new Date(time);
            var m = new Date(time);
            if(d.getMinutes() >= 0 && d.getMinutes() <= 7)
                m.setMinutes(0);
            else if(d.getMinutes() >= 7 && d.getMinutes() <= 22)
                m.setMinutes(15);
            else if(d.getMinutes() >= 22 && d.getMinutes() <= 37)
                m.setMinutes(30);
            else if(d.getMinutes() >= 37 && d.getMinutes() <= 59)
                m.setMinutes(45);
            
            $rootScope.timeFromPick.inputTime = m;
            $scope.checkDatetime();
        });
    };
    
    $scope.selectToDate = function() {
        var todate = new Date();
        
        if($rootScope.dateFromPick) {
            if($rootScope.dateFromPick.inputDate) {
                todate = new Date($rootScope.dateFromPick.inputDate);
            }
            else {
                if($rootScope.dateToPick)
                    if($rootScope.dateToPick.inputDate) {
                        todate = new Date($rootScope.dateToPick.inputDate);
                    }
                    else if($rootScope.dateToPick.inputDate) {
                        todate = new Date();
                    }
            }
        }
        else {
            if($rootScope.dateToPick)
                if($rootScope.dateToPick.inputDate) {
                    todate = new Date($rootScope.dateToPick.inputDate);
                }
                else if($rootScope.dateToPick.inputDate) {
                    todate = new Date();
                }
        }
            
        $rootScope.dateToPick = {
            date: todate,
            mode: 'date',
            //minDate: new Date() - 10000,
            allowOldDates: false,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        console.log($rootScope.dateToPick);
        
        $cordovaDatePicker.show($rootScope.dateToPick).then(function(date) {
            console.log(date);
            
            if(!date) {
                $scope.dateValidated = false;
                return;
            }
            
            $rootScope.dateToPick.inputDate = date;
            $scope.checkDatetime();
        });
    };
    
    $scope.selectToTime = function() {
        var sameday = false;
        if($rootScope.dateToPick.inputDate) {
            if($rootScope.dateToPick.inputDate.getDate() == new Date().getDate() 
                && $rootScope.dateToPick.inputDate.getMonth() == new Date().getMonth()
                && $rootScope.dateToPick.inputDate.getFullYear() == new Date().getFullYear())
                sameday = true;
        }
        
        $rootScope.timeToPick = {
            date: $rootScope.timeToPick ? ($rootScope.timeToPick.inputTime ? $rootScope.timeToPick.inputTime : new Date()) : new Date(),
            mode: 'time',
            is24Hour: true,
            allowOldDates: true,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        if(sameday)
            $rootScope.timeToPick.minDate = new Date() - 10000;
        
        $cordovaDatePicker.show($rootScope.timeToPick).then(function(time) {
            console.log(time);
            
            if(!time) {
                $scope.dateValidated = false;
                return;
            }
            
            var d = new Date(time);
            var m = new Date(time);
            if(d.getMinutes() >= 0 && d.getMinutes() <= 7)
                m.setMinutes(0);
            else if(d.getMinutes() >= 7 && d.getMinutes() <= 22)
                m.setMinutes(15);
            else if(d.getMinutes() >= 22 && d.getMinutes() <= 37)
                m.setMinutes(30);
            else if(d.getMinutes() >= 37 && d.getMinutes() <= 59)
                m.setMinutes(45);
            
            $rootScope.timeToPick.inputTime = m;
            $scope.checkDatetime();
        });
    };
    
    $scope.checkDatetime = function() {
        
        if(!$rootScope.dateFromPick 
            || !$rootScope.dateToPick 
            || !$rootScope.timeFromPick 
            || !$rootScope.timeToPick) {
                
            $scope.dateValidated = false;
            return;
        }
        
        var df = $rootScope.dateFromPick.inputDate;
        var dt = $rootScope.dateToPick.inputDate;
        var hf = $rootScope.timeFromPick.inputTime;
        var ht = $rootScope.timeToPick.inputTime;
        
        if(!df || !dt || !hf || !ht) {
            $scope.dateValidated = false;
            return;
        }
            
        var hhf = new Date(hf);
        var hht = new Date(ht);
            
        var ddf = new Date(df);
        ddf.setHours(hhf.getHours());
        ddf.setMinutes(hhf.getMinutes());
            
        var ddt = new Date(dt);
        ddt.setHours(hht.getHours());
        ddt.setMinutes(hht.getMinutes());
                
        var mdf = moment(ddf);
        var mdt = moment(ddt);
        
        if(!ddf || !ddt || !hhf || !hht) {
            $scope.dateValidated = false;
            return;
        }
        
        var sameday = false;
        if(dt.getDate() == new Date().getDate() 
            && dt.getMonth() == new Date().getMonth()
            && dt.getFullYear() == new Date().getFullYear())
            sameday = true;
        
        if(sameday) {
            if(ddf.getHours() < new Date().getHours()) {
                $scope.dateValidated = false;
                return;
            }
            if(ddf.getHours() == new Date().getHours()) {
                if(ddf.getMinutes() < new Date().getMinutes()) {
                    $scope.dateValidated = false;
                    return;
                }
            }
            if(ddf.getHours() == ddt.getHours()) {
                if(ddf.getMinutes() == ddt.getMinutes()) {
                    $scope.dateValidated = false;
                    return;
                }
            }
        }
        
        if(mdt.diff(mdf) < 0)
            $scope.dateValidated = false;
        else
            $scope.dateValidated = true;
    };
    
    $scope.gotoParking = function() {
        $scope.checkDatetime();
        
        if(!$scope.dateValidated){
            return false;
        }
        if(InfoFactories.getPark()) {
            $state.go('tab.resume');
        }else{
            $state.go('tab.parking');
        }
            
        
    };
})