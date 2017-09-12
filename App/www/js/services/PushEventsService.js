angular.module('starter').factory("PushEvents", function ($ionicLoading, $ionicPopup, $state, PopUpServices, ScriptServices) {
    function changeDriver(eventParams) {
        function changeDriverResponse(eventParams, responseParam){
            $ionicLoading.show();
            ScriptServices.getXMLResource(633).then(function (res) {
                res = res.replace('{PNR}', eventParams.additionalData.param.book.pnr)
                .replace('{REQUESTID}', eventParams.additionalData.param.requestID)
                .replace('{DRIVERRESPONSE}', responseParam);
                ScriptServices.callGenericService(res, 633).then(function (data) {
                    $ionicLoading.hide();
                    PopUpServices.messagePopup("Operazione avvenuta con successo", "Successo", $state.go('tab.bookings'));
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
                    changeDriverResponse(eventParams, false);
                }
            }, {
                text: '<b>Accetta</b>',
                type: 'button-positive',
                onTap: function () {
                    changeDriverResponse(eventParams, true);
                }
            }],
            "message": eventParams.message,
            "title": eventParams.title
        }
        PopUpServices.buttonsPopup(configObj);
    };
    function delayAlert(eventParams) {
        function goToBookings (){
            $state.go('tab.bookings');
        }
        PopUpServices.messagePopup(eventParams.message, eventParams.title, goToBookings);
    };
    return {
        changeDriver: function (eventParams) {
            return changeDriver(eventParams);
        },
        delayAlert: function (eventParams) {
            return delayAlert(eventParams);
        }
    };
})
