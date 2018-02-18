angular.module('starter').service("PushEventsService", function ($ionicLoading, $state, PopUpServices, ScriptServices) {
    this.changeDriver = function(body, title, pnr, requestID) {
        function changeDriverResponse(pnr, requestID, responseParam){
            $ionicLoading.show();
            ScriptServices.getXMLResource(633).then(function (res) {
                res = res.replace('{PNR}', pnr)
                .replace('{REQUESTID}', requestID)
                .replace('{DRIVERRESPONSE}', responseParam);
                ScriptServices.callGenericService(res, 633).then(function (data) {
                    $ionicLoading.hide();
                    PopUpServices.messagePopup("Operazione avvenuta con successo", "Successo");
                }, function (error) {
                    $ionicLoading.hide();
                    PopUpServices.errorPopup("Non siamo riusciti a sottomettere la richiesta.");
                })
            });
        }
        var configObj = {
            "buttons": [{
                text: 'Rifiuta',
                type: 'button-stable',
                onTap: function () {
                    changeDriverResponse(pnr, requestID, false);
                }
            }, {
                text: '<b>Accetta</b>',
                type: 'button-positive',
                onTap: function () {
                    changeDriverResponse(pnr, requestID, true);
                }
            }],
            "message": body,
            "title": title
        }
        PopUpServices.buttonsPopup(configObj);
    };
    this.delayAlert = function(body, title) {
        function goToBookings (){
            $state.go('tab.bookings');
        }
        PopUpServices.messagePopup(body, title, goToBookings);
    };
})
