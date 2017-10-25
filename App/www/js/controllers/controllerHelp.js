angular.module('starter').controller('HelpCtrl', function(ScriptServices, $scope, $http, $ionicLoading, InfoFactories, WebService) {
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.openUrl = function(url){
        window.open(url, '_system', 'location=yes');
    }
    $ionicLoading.show();
    ScriptServices.directWithOutScriptID(637).then(function(data) {
        $scope.helpList = data.data.helpList;
        $ionicLoading.hide();
    }, function (error) {
        PopUpServices.errorPopup("Non è stato possibile recuperare alcune informazioni!", "1");
        $ionicLoading.hide();
    })

})