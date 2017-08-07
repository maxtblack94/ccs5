angular.module('starter').controller('TabCtrl', function(InfoFactories, PopUpServices, $state, $scope) {
    var eventParams;
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    function manipolateEvents(){
        switch (eventParams.name) {
        case 'gestioneRitardo':
            $state.go('tab.bookings');
            break;
        default:
            console.log('Sorry, we are out of ' + eventName + '.');
        }
        eventParams = {};
    }
    $scope.$on('cloud:push:notification', function(event, data) {
        if(data.message.raw && data.message.raw.additionalData && data.message.raw.additionalData.eventName){
            eventParams = {
                "name" : data.message.raw.additionalData.eventName,
                "params" : data.message.raw.additionalData.params
            }
            PopUpServices.messagePopup(
                data.message.text,
                data.message.title,
                manipolateEvents
            );
            
        }else{
            PopUpServices.messagePopup(data.message.text, data.message.title);
        }
    });

})