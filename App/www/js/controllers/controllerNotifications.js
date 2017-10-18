angular.module('starter').controller('notificationsCtrl', function($ionicSideMenuDelegate, $scope, $http, $state, $ionicLoading, InfoFactories, WebService) {
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.userInfo = InfoFactories.getUserInfo();

})