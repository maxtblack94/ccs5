angular.module('starter').controller('ContactsCtrl', function(InfoFactories, $scope) {
   $scope.locale = window.locale;
   $scope.clientContacts = InfoFactories.getClientSelected().contact;
   $scope.startCall = function(number){
        window.open("tel:" + number);
   }
})