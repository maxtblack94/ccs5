angular.module('starter').controller('LicenseEditCtrl', function($cordovaDatePicker, $filter, $scope, InfoFactories, PopUpServices, $ionicLoading, ScriptServices) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.userInfo = InfoFactories.getUserInfo();

    $scope.edit = function(){
        $scope.request = angular.copy((($scope.userInfo || {}).registry));
    };

    $scope.undo = function(){
        $scope.request = undefined;
    }

    function fixDate(date) {
        if (date) {
            var dateArray = date.split('/');
            return dateArray[1]+'/'+dateArray[0]+'/'+dateArray[2];
        } else {
            return null;
        }
        
    }

    $scope.save = function(){
       if ((!$scope.request.license_code || !$scope.request.license_place || !$scope.request.license_date || !$scope.request.license_expire) && $scope.selectedClient.drivingLicense) {
            PopUpServices.errorPopup($filter('translate')('driveLicense.fieldMandatory'), "1");
       }else{
           callSaveService();
       }
    }

    function callSaveService(){
        $ionicLoading.show();
        ScriptServices.getXMLResource(558).then(function(res) {
            res = res.replace('{DRIVERNUMBER}', InfoFactories.getUserInfo().driverNumber)
            .replace('{PHONE}', $scope.request.mobile_phone || '')
            .replace('{EMAIL}', $scope.request.email || '')
            .replace('{SMS}', $scope.request.sms || '')
            .replace('{PUSH}', $scope.request.push || '')
            .replace('{LICENSE_CODE}', $scope.request.license_code ? $scope.request.license_code : '')
            .replace('{LICENSE_PLACE}', $scope.request.license_place ? $scope.request.license_place : '')
            .replace('{LICENSE_DATE}', typeof $scope.request.license_date === 'string' ? moment(fixDate($scope.request.license_date)).format('DD/MM/YYYY') : moment($scope.request.license_date).format('DD/MM/YYYY') || '')
            .replace('{LICENSE_EXPIRE}', typeof $scope.request.license_expire === 'string' ? moment(fixDate($scope.request.license_expire)).format('DD/MM/YYYY') : moment($scope.request.license_expire).format('DD/MM/YYYY') || '')
            ScriptServices.callGenericService(res, 558).then(function(data) {
                $scope.request = undefined;
                getUserInfo();
                $ionicLoading.hide();
                PopUpServices.messagePopup($filter('translate')('driveLicense.editSuccess'), $filter('translate')('commons.success'));
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('driveLicense.editFail'));
            })
        });
    }

    $scope.selectDate = function(dateType) {
        var date = typeof $scope.request[dateType] === 'string' ? fixDate($scope.request[dateType]) : $scope.request[dateType];
        var dateFromConfig = {
            date: date ? new Date(date): new Date(),
            mode: 'date',
            allowOldDates: true,
            allowFutureDates: true,
            androidTheme: 4,
            doneButtonLabel: $filter('translate')('commons.select'),
            cancelButtonLabel: $filter('translate')('commons.close'),
            cancelButtonColor: '#000000',
            locale: navigator.language
        };
        
        $cordovaDatePicker.show(dateFromConfig).then(function(date) {
            if(date){
                $scope.request[dateType] = moment(date,"DD/MM/YYYY").toDate();
            }            
        });
    };




    function getUserInfo(){
        ScriptServices.getXMLResource(554).then(function(res) {
            res = res.replace('{NUMBER_DRIVER}', InfoFactories.getUserInfo().driverNumber);
            ScriptServices.callGenericService(res, 554).then(function(data) {
                $scope.userInfo = InfoFactories.getUserInfo();
                $scope.userInfo.registry =  data.data.GetUser[0];
                window.localStorage.setItem('userInfo', JSON.stringify($scope.userInfo));
            });
        });
    }
})