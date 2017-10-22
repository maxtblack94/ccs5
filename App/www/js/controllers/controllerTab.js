angular.module('starter').controller('TabCtrl', function(PushEvents, ScriptServices, InfoFactories, PopUpServices, $state, $scope) {
    var eventParams;
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.model.manipolateEvents = function(eventParams){
        notificationExecuted(eventParams.params.pushID); //TODO AGGIUNGERE ID PUSH DELLA PUSH CLASSICA
        switch (eventParams.name) {
        case 'gestioneRitardo':
            PushEvents.delayAlert(eventParams.params);
            break;
        case 'changeDriver':
            PushEvents.changeDriver(eventParams.params);
            break;
        default:
            PopUpServices.messagePopup(eventParams.params.message, eventParams.params.title);
        }
    }
    $scope.$on('cloud:push:notification', function(event, data) {
        if(data.message.raw && data.message.raw.additionalData && data.message.raw.additionalData.eventName){
            eventParams = {
                "name" : data.message.raw.additionalData.eventName,
                "params" : data.message.raw
            }
            $scope.model.manipolateEvents(eventParams);
        }else{
            PopUpServices.messagePopup(data.message.text, data.message.title);
        }
    });

    function notificationExecuted(pushID){
        $scope.model.notificationsPending = null;
        ScriptServices.getXMLResource(636).then(function(res) {
            res = res.replace('{PUSHID}', pushID);
            ScriptServices.callGenericService(res, 636).then(function(data) {
                $scope.model.notificationsPending = data.data.dataList;
            }, function(error) {

            })
        });
    }

})