angular.module('starter').controller('ClientDetailCtrl', function($cordovaDatePicker, ManipolationServices, $state, $scope, InfoFactories, PopUpServices, $ionicLoading, ScriptServices) {
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.userInfo = InfoFactories.getUserInfo();

    $scope.edit = function(){
        $scope.request = angular.copy((($scope.userInfo || {}).registry))
    }

    $scope.undo = function(){
        $scope.request = undefined;
    }

    $scope.save = function(){
        if(!$scope.request.email){
            PopUpServices.errorPopup("Il campo email è obbligatorio", "1");
       }if ((!$scope.request.license_code || !$scope.request.license_place || !$scope.request.license_date || !$scope.request.license_expire) && $scope.selectedClient.drivingLicense) {
            PopUpServices.errorPopup("I dati della patente sono obbligatori", "1");
       }else{
           callSaveService();
       }
    }

    function callSaveService(){
        $ionicLoading.show();
        ScriptServices.getXMLResource(558).then(function(res) {
            res = res.replace('{DRIVERNUMBER}', InfoFactories.getUserInfo().driverNumber)
            .replace('{PHONE}', $scope.request.mobile_phone)
            .replace('{EMAIL}', $scope.request.email)
            .replace('{SMS}', $scope.userInfo.sms)
            .replace('{PUSH}', $scope.userInfo.push)
            .replace('{LICENSE_CODE}', $scope.request.license_code ? $scope.request.license_code : '')
            .replace('{LICENSE_PLACE}', $scope.request.license_place ? $scope.request.license_place : '')
            .replace('{LICENSE_DATE}', $scope.request.license_date ? moment($scope.request.license_date).format('DD/MM/YYYY') : '')
            .replace('{LICENSE_EXPIRE}', $scope.request.license_expire ? moment($scope.request.license_expire).format('DD/MM/YYYY') : '');
            ScriptServices.callGenericService(res, 558).then(function(data) {
                $scope.request = undefined;
                $scope.userInfo.registry = data.data;
                window.localStorage.setItem('userInfo', JSON.stringify($scope.userInfo));
                $ionicLoading.hide();
                PopUpServices.messagePopup("Contatti modificati!", "Successo");
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup("Non è stato possibile modificare i contatti");
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
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        $cordovaDatePicker.show(dateFromConfig).then(function(date) {
            if(date){
                $scope.request[dateType] = moment(date,"DD/MM/YYYY").toDate();
            }            
        });
    };

})