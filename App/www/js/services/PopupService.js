angular.module('starter').factory("PopUpServices", function($ionicPopup, $filter) {
    function errorPopup(message, type) {
       $ionicPopup.alert({
            title: type === '1' ? $filter('translate')('commons.attention') : type === '2' ? $filter('translate')('commons.success') : $filter('translate')('commons.error'),
            template: message || $filter('translate')('commons.connectionProblem')
        });
    };

    function messagePopup(message, title, callback) {
       var popupInstance = $ionicPopup.alert({
            title: title,
            template: message
        });
        if(callback){
            popupInstance.then(function(res) {
                callback();
            });
        };
    };

    function buttonsPopup(obj) {
        var popupInstance = $ionicPopup.show({
            template: obj.message,
            title: obj.title,
            subTitle: obj.subTitle,
            buttons: obj.buttons
        });

        if(obj.callback){
            popupInstance.then(function(res) {
                obj.callback();
            });
        };
    };

    return {
        errorPopup: function (message, type) {
            return errorPopup(message, type);
        },
        messagePopup: function (message, title, callback) {
            return messagePopup(message, title, callback);
        },
        buttonsPopup: function (obj) {
            return buttonsPopup(obj);
        }
    };



})
