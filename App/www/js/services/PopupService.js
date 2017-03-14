angular.module('starter').factory("PopUpServices", function($ionicPopup) {
    function errorPopup(message, type) {
       $ionicPopup.alert({
            title: type === '1' ? 'Attenzione' : type === '2' ? 'Successo' : 'Errore',
            template: message || 'Abbiamo riscontrato un problema di connessione!'
        });
    };
   

    return {
        errorPopup: function (message, type) {
            return errorPopup(message, type);
        }
    };



})
