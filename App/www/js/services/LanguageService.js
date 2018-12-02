angular.module('starter').factory("LanguageService", function($translate) {
    var currentLanguage = navigator.language;
    var tenForceAuthID = undefined;
    function getTenForceAuthID() {
        switch (currentLanguage) {
            case 'ro-RO':
            case 'ro_RO':
                tenForceAuthID = 'dGVuZm9yY2Uucm9AVEYuY29tfGRlbW9ybzE4NDUy';
                break;
            case 'it-IT':
            case 'it_IT':
                tenForceAuthID = 'dGVuZm9yY2Uucm9AVEYuY29tfGRlbW9ybzE4NDUy';
                break;
            default:
                tenForceAuthID = 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4'; //English
                break;
        }
        return tenForceAuthID;
    }

    /* function changeLanguage(key) {
        currentLanguage = key;
        $translate.use(key);
    };
 */
    /* function defineLanguage() {
        var language = navigator.language || navigator.userLanguage;
        if (language) {
            currentLanguage = language;
        }
        getTenForceAuthID();
        changeLanguage(currentLanguage);
      } */

    return {
        /* changeLanguage: function(langKey){
            return changeLanguage(langKey);
        }, */
        getTenForceAuthID: function () {
            return getTenForceAuthID();
        }/* ,
        currentLanguage: function() {
            return currentLanguage;
        },
        defineLanguage: function() {
            return defineLanguage();
        } */
    };



})
