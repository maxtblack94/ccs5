angular.module('starter').controller('TabCtrl', function(PushEventsService, ScriptServices, InfoFactories, PopUpServices, $state, $scope) {
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.$on('pushNotificationEvent', function(event, notificationData) {
        manipolateEvents(notificationData);
    });

    function manipolateEvents(eventParams){
        notificationExecuted(eventParams.pushID);
        switch (eventParams.eventName) {
        case 'gestioneRitardo':
            PushEventsService.delayAlert(eventParams.body, eventParams.title);
            break;
        case 'changeDriver':
            PushEventsService.changeDriver(eventParams.body, eventParams.title, (eventParams.additionalData.book || {}).pnr, eventParams.additionalData.requestID);
            break;
        default:
            PopUpServices.messagePopup(eventParams.body, eventParams.title);
        }
    }

    function notificationExecuted(pushID){
        $scope.model.notificationsPending = null;
        ScriptServices.getXMLResource(636).then(function(res) {
            res = res.replace('{PUSHID}', pushID);
            ScriptServices.callGenericService(res, 636).then(function(data) {
                $scope.model.notificationsPending = data.data.dataList;
            }, function(error) {
                $scope.model.notificationsPending = [];
            })
        });
    }
})