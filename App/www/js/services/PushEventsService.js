angular.module('starter').service("PushEventsService", function ($filter, $ionicLoading, $state, PopUpServices, ScriptServices) {
    this.changeDriver = function(body, title, pnr, requestID) {
        function changeDriverResponse(pnr, requestID, responseParam){
            $ionicLoading.show();
            ScriptServices.getXMLResource(633).then(function (res) {
                res = res.replace('{PNR}', pnr)
                .replace('{REQUESTID}', requestID)
                .replace('{DRIVERRESPONSE}', responseParam);
                ScriptServices.callGenericService(res, 633).then(function (data) {
                    $ionicLoading.hide();
                    PopUpServices.messagePopup($filter('translate')('commons.successOperation'), $filter('translate')('commons.success'));
                }, function (error) {
                    $ionicLoading.hide();
                    PopUpServices.errorPopup($filter('translate')('commons.requestFail'));
                })
            });
        }
        var configObj = {
            "buttons": [{
                text: $filter('translate')('commons.refuse'),
                type: 'button-stable',
                onTap: function () {
                    changeDriverResponse(pnr, requestID, false);
                }
            }, {
                text: '<b>'+$filter('translate')('commons.accept')+'</b>',
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
