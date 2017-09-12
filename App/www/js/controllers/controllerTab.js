angular.module('starter').controller('TabCtrl', function(PushEvents, InfoFactories, PopUpServices, $state, $scope) {
    var eventParams;
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    function manipolateEvents(eventParams){
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
            manipolateEvents(eventParams);
        }else{
            PopUpServices.messagePopup(data.message.text, data.message.title);
        }
    });

})