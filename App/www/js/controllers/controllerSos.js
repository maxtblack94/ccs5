angular.module('starter').controller('SosCtrl', function(PopUpServices, $scope, InfoFactories, ScriptServices, $ionicLoading) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    
    function sendSos(sosPnr){
        $ionicLoading.show();
        ScriptServices.getXMLResource(611).then(function(res) {
            res = res.replace('{PNR}', sosPnr);
            ScriptServices.callGenericService(res, 611).then(function(data) {
                $ionicLoading.hide();
                //PopUpServices.messagePopup("Richiesta di soccorso inviata con successo", "Successo");
            }, function(error) {
                $ionicLoading.hide();
                //PopUpServices.errorPopup("Non è stato possibile inviare la richiesta di soccorso, riprovare!");
            })
        });
    }
    $scope.startCall = function(sosPnr){
        window.open("tel:" + $scope.selectedClient.sosTelephone.replace(/\s+/g, ''), "_system");
        sendSos(sosPnr);
   }
})