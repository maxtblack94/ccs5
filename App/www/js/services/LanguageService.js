angular.module('starter').factory("LanguageService", function($translate) {
    var currentLanguage = navigator.language;
    var tenForceAuthID = undefined;
    function getTenForceAuthID() {
        switch (currentLanguage.toUpperCase()) {
            case 'RO':
            case 'RO-RO':
            case 'RO_RO':
                tenForceAuthID = 'dGVuZm9yY2Uucm9AVEYuY29tfGRlbW9ybzE4NDUy';
                break;
            case 'IT':
            case 'IT-IT':
            case 'IT_IT':
                tenForceAuthID = 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4';
                break;
            case 'HR':
            case 'HR-HR':
            case 'HR_HR':
                tenForceAuthID = 'dGVuZm9yY2UuaHJAVEYuY29tfGRlbW9jcm9hemlhMjAxOQ==';
                break;
            default:
                tenForceAuthID = 'dGVuZm9yY2UuZW5AVEYuY29tfHRlbmZvcmNlNTYyNDc='; //English
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
