angular.module('starter').factory("PopUpServices", function($ionicPopup) {
    function errorPopup(message, type) {
       $ionicPopup.alert({
            title: type === '1' ? 'Attenzione' : type === '2' ? 'Successo' : 'Errore',
            template: message || 'Abbiamo riscontrato un problema di connessione!'
        });
    };

    function messagePopup(message, title, callback) {
       $ionicPopup.alert({
            title: title,
            template: message
        }).then(function(res) {
            callback();
        });;
    };

    return {
        errorPopup: function (message, type) {
            return errorPopup(message, type);
        },
        messagePopup: function (message, title, callback) {
            return messagePopup(message, title, callback);
        }
    };



})
