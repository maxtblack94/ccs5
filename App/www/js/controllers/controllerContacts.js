angular.module('starter').controller('ContactsCtrl', function(InfoFactories, $scope) {
   $scope.locale = window.locale;
   $scope.clientContacts = InfoFactories.getClientSelected().contact;
   $scope.startCall = function(number){
        window.open("tel:" + number.replace(/\s+/g, ''), "_system");
   }

   $scope.openEmail = function(mail){
       if(cordova.plugins.email){
            cordova.plugins.email.open({
                to:      mail,
                subject: 'CCS Richiesta supporto #'+new Date().getTime()
            });
       }
   }
})