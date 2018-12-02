angular.module('starter').controller('ClientDetailCtrl', function($scope, InfoFactories, PopUpServices, $ionicLoading, ScriptServices, $filter) {
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
            PopUpServices.errorPopup($filter('translate')('clientDetails.mandatory'), "1");
       }else{
           callSaveService();
       }
    }

    function callSaveService(){
        $ionicLoading.show();
        ScriptServices.getXMLResource(558).then(function(res) {
            res = res.replace('{DRIVERNUMBER}', InfoFactories.getUserInfo().driverNumber)
            .replace('{PHONE}', $scope.request.mobile_phone || '')
            .replace('{EMAIL}', $scope.request.email)
            .replace('{SMS}', $scope.request.sms || '')
            .replace('{PUSH}', $scope.request.push || '')
            .replace('{LICENSE_CODE}', $scope.request.license_code || '')
            .replace('{LICENSE_PLACE}', $scope.request.license_place || '')
            .replace('{LICENSE_DATE}', $scope.request.license_date || '')
            .replace('{LICENSE_EXPIRE}', $scope.request.license_expire || '');
            ScriptServices.callGenericService(res, 558).then(function(data) {
                $scope.request = undefined;
                $scope.userInfo.registry = data.data;
                window.localStorage.setItem('userInfo', JSON.stringify($scope.userInfo));
                $ionicLoading.hide();
                PopUpServices.messagePopup($filter('translate')('clientDetails.editSuccess'), $filter('translate')('commons.success'));
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('clientDetails.editFail'));
            })
        });
    }

})