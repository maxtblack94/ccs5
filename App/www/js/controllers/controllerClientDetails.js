angular.module('starter').controller('ClientDetailCtrl', function($state, $scope, InfoFactories, PopUpServices, $ionicLoading, ScriptServices) {
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.userInfo = InfoFactories.getUserInfo();

    $scope.edit = function(){
        $scope.request = {
            "email": (($scope.userInfo || {}).registry || {}).email,
            "cellulare": (($scope.userInfo || {}).registry || {}).mobile_phone
        }
    }

    $scope.undo = function(){
        $scope.request = undefined;
    }

    $scope.save = function(){
        if(!$scope.request.email){
            PopUpServices.errorPopup("Tutti i campi obblocatori", "1");
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
            .replace('{PUSH}', $scope.userInfo.push);
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