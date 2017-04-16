angular.module('starter').controller('AppCtrl', function(PopUpServices, $state, $scope) {
    $scope.$on('cloud:push:notification', function(event, data) {
        if(data.message.raw && data.message.raw.additionalData && data.message.raw.additionalData.eventName){
            PopUpServices.messagePopup(
                data.message.text, 
                data.message.title, 
                manipolateEvents(data.message.raw.additionalData.eventName, data.message.raw.additionalData.params)
            );
        }else{
            PopUpServices.messagePopup(data.message.text, data.message.title);
        }
    });
    $scope.locale = window.locale;

    function manipolateEvents (eventName, params){
        switch (eventName) {
        case 'gestioneRitardo':
            $state.go('tab.bookings');
            break;
        default:
            console.log('Sorry, we are out of ' + eventName + '.');
        }
    }

})