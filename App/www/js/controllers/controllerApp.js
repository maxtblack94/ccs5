angular.module('starter').controller('AppCtrl', function(NotificationService, $state, $scope) {
    //NotificationService.onDeviceReady();
    $scope.locale = window.locale;
})