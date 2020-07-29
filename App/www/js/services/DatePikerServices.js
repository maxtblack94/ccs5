angular.module('starter').factory("DatePikerServices", function(PopUpServices, $q, $ionicPlatform, $filter, $cordovaDatePicker) {

    function allowOldDates(inputName) {
        switch (inputName) {
            case "birthDate":
                return true;
            case "licenseIssueDate":
                return true;
            case "licenseEndDate":
                return false;
            default:
                return true;
        }
    }

    function allowFutureDates(inputName) {
        switch (inputName) {
            case "birthDate":
                return false;
            case "licenseIssueDate":
                return false;
            case "licenseEndDate":
                return true;
            default:
                return true;
        }
    }
    
    function selectDate (inputName, validations) {
        var dateFromConfig = {
            date: new Date(),
            mode: 'date',
            allowOldDates: allowOldDates(inputName),
            allowFutureDates: allowFutureDates(inputName),
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
                    var momentDate = moment(date);
                    if (momentDate.isBefore(moment().add(1, "days")) && dateFromConfig.allowOldDates === false) {
                        PopUpServices.messagePopup($filter('translate')('commons.oldDateAlert'), $filter('translate')('commons.attention'));
                    } else if (momentDate.isAfter(moment().subtract(1, "days")) && dateFromConfig.allowFutureDates === false) {
                        PopUpServices.messagePopup($filter('translate')('commons.futureDateAlert'), $filter('translate')('commons.attention'));
                    } else if(validations && validations.length){
                        if (checkValidations(date, validations)) {
                            reject();
                        } else {
                            resolve(date);
                        }
                    } else if(date){
                        resolve(date);
                    } else {
                        reject();
                    }
                });
            }
        });
    }

    function checkValidations(date, validations) {
        var result = false;
        for (let k = 0; k < validations.length; k++) {
            if (validations[k] === '18YearsOld' && moment().subtract(18, 'years').isBefore(moment(date))) {
                PopUpServices.messagePopup($filter('translate')('commons.adultWarning'), $filter('translate')('commons.attention'));
                result = true;
                break;
            }
        }
        return result;
        
    }
 
    return {
        selectDate: function (inputName, validations) {
            return selectDate(inputName, validations);
        }
    };



})
