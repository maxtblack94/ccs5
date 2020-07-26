angular.module('starter').factory("LanguageService", function($translate) {
    var currentLanguage = navigator.language;
    var tenForceAuthID = undefined;
    function getTenForceAuthID() {
        if(currentLanguage) {
            switch (currentLanguage.toUpperCase()) {
                case 'IT':
                case 'IT-IT':
                case 'IT_IT':
                    tenForceAuthID = 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4';
                    break;
                default:
                    tenForceAuthID = 'dGVuZm9yY2UuZW5AVEYuY29tfHRlbmZvcmNlNTYyNDc='; //English
                    break;
            }
        } else {
            tenForceAuthID = 'dGVuZm9yY2UuZW5AVEYuY29tfHRlbmZvcmNlNTYyNDc=';
        }
        
        return tenForceAuthID;
    }

    function changeLanguage(key) {
        currentLanguage = key;
        window.localStorage.setItem('language', key);
        $translate.use(key);
    };

    /* function defineLanguage() {
        var language = navigator.language || navigator.userLanguage;
        if (language) {
            currentLanguage = language;
        }
        getTenForceAuthID();
        changeLanguage(currentLanguage);
      } */

    return {
        changeLanguage: function(langKey){
            return changeLanguage(langKey);
        },
        getTenForceAuthID: function () {
            return getTenForceAuthID();
        },
        currentLanguage: function() {
            return window.localStorage.getItem('language') || currentLanguage;
        }/*, 
        defineLanguage: function() {
            return defineLanguage();
        } */
    };



})
