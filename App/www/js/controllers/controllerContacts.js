angular.module('starter').controller('ContactsCtrl', function(InfoFactories, $scope, $filter, $ionicHistory) {
   $scope.clientContacts = InfoFactories.getClientSelected().contact;
   $scope.startCall = function(number){
        window.open("tel:" + number.replace(/\s+/g, ''), "_system");
   }

   $scope.openEmail = function(mail){
       if(cordova.plugins.email){
            cordova.plugins.email.open({
                to:      mail,
                subject: $filter('translate')('contacts.emailSubject')+new Date().getTime()
            });
       }
   }

   $scope.back = function (params) {
    $ionicHistory.goBack();
 };
})