angular.module('starter').factory("InfoFactories", [function ($ionicPopup) {
    function popupMessage(title, message, func) {
        var pnrPopup = $ionicPopup.alert({
                title: title,
                template: message
            });
            pnrPopup.then(function(res) {
                func ? func():null;
            });
    };
   

    return {
        popupMessage: function (title, message, func) {
            return popupMessage(title, message, func);
        }
    };



}])
