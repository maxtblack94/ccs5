angular.module('starter').factory("DatePikerServices", function($q, $ionicPlatform, $filter, $cordovaDatePicker) {

    function selectDate (inputName) {
        var dateFromConfig = {
            date: new Date(),
            mode: 'date',
            allowOldDates: inputName === 'birthDate' || inputName === 'docEndDate' ? true: false,
            allowFutureDates: inputName === 'licenseEndDate' ? true: false,
            androidTheme: 4,
            doneButtonLabel: $filter('translate')('commons.select'),
            cancelButtonLabel: $filter('translate')('commons.close'),
            cancelButtonColor: '#000000',
            locale: navigator.language
        };

        return $q(function (resolve, reject) {
            if ($ionicPlatform.is('browser')) {
                resolve(new Date().toISOString())
            } else {
                $cordovaDatePicker.show(dateFromConfig).then(function(date) {
                    if(date){
                        resolve(date);
                    } else {
                        reject();
                    }
                });
            }
        });
    }
 
    return {
        selectDate: function (inputName) {
            return selectDate(inputName);
        }
    };



})
