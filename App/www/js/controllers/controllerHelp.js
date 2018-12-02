angular.module('starter').controller('HelpCtrl', function(ScriptServices, $scope, $http, $ionicLoading, InfoFactories) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.openUrl = function(url){
        window.open(url, '_system', 'location=yes');
    }
    $ionicLoading.show();
    ScriptServices.directWithOutScriptID(637).then(function(data) {
        $scope.helpList = data.data.helpList;
        $ionicLoading.hide();
    }, function (error) {
        PopUpServices.errorPopup($filter('translate')('sos.noInfo'), "1");
        $ionicLoading.hide();
    })

})