angular.module('starter').controller('LicenseEditCtrl', function($cordovaDatePicker, $filter, $scope, InfoFactories, PopUpServices, $ionicLoading, ScriptServices) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.userInfo = InfoFactories.getUserInfo();

    $scope.edit = function(){
        $scope.request = angular.copy((($scope.userInfo || {}).registry))
    }

    $scope.undo = function(){
        $scope.request = undefined;
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
            .replace('{LICENSE_DATE}', $scope.request.license_date ? moment($scope.request.license_date).format('DD/MM/YYYY') : '')
            .replace('{LICENSE_EXPIRE}', $scope.request.license_expire ? moment($scope.request.license_expire).format('DD/MM/YYYY') : '');
            ScriptServices.callGenericService(res, 558).then(function(data) {
                $scope.request = undefined;
                $scope.userInfo.registry = data.data;
                window.localStorage.setItem('userInfo', JSON.stringify($scope.userInfo));
                $ionicLoading.hide();
                PopUpServices.messagePopup($filter('translate')('driveLicense.editSuccess'), $filter('translate')('commons.success'));
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('driveLicense.editFail'));
            })
        });
    }

    $scope.selectDate = function(dateType) {
        var dateFromConfig = {
            date: $scope.request[dateType] ? moment($scope.request[dateType],"DD/MM/YYYY").toDate(): new Date(),
            mode: 'date',
            allowOldDates: false,
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
})