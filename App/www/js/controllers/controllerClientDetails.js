angular.module('starter').controller('ClientDetailCtrl', function($state, $scope, InfoFactories, PopUpServices, $ionicLoading, ScriptServices) {
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
       }if ((!$scope.request.license_code || !$scope.request.license_place || !$scope.request.license_date || !$scope.request.license_expire) || $scope.selectedClient.drivingLicence) {
            PopUpServices.errorPopup("I dati della patente sono obbligatori", "1");
       }else{
           callSaveService();
       }
    }

    function callSaveService(){
        $ionicLoading.show();
        ScriptServices.getXMLResource(558).then(function(res) {
            res = res.replace('{DRIVERNUMBER}', InfoFactories.getUserInfo().driverNumber)
            .replace('{PHONE}', $scope.request.cellulare)
            .replace('{EMAIL}', $scope.request.email)
            .replace('{SMS}', $scope.userInfo.sms)
            .replace('{PUSH}', $scope.userInfo.push)
            .replace('{LICENSE_CODE}', ManipolationServices.fixRequestParam($scope.request.license_code))
            .replace('{LICENSE_PLACE}', ManipolationServices.fixRequestParam($scope.request.license_place))
            .replace('{LICENSE_DATE}', ManipolationServices.fixRequestParam($scope.request.license_date))
            .replace('{LICENSE_EXPIRE}', ManipolationServices.fixRequestParam($scope.request.license_expire));
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

})