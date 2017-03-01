angular.module('starter').controller('AppCtrl', function($rootScope, $scope, $http, $ionicPlatform, $ionicLoading, $ionicTabsDelegate, NotificationService, $state) {
    NotificationService.onDeviceReady();
            
})