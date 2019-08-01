angular.module('starter').controller('SubscriptionsCtrl', function($ionicHistory, InfoFactories, $scope, ReservationService, $state) {
    $scope.user = InfoFactories.getUserInfo();

    $scope.selectService = function(service) {
        ReservationService.setService(service);
        $state.go('park');
    };

    $scope.cancel = function () {
        ReservationService.resetReservation();
        $state.go('tab.bookings');
    };

    $scope.back = function (params) {
        $ionicHistory.goBack();
    };

    if ((($scope.user.registry || {}).services || []) && $scope.user.registry.services.length === 1) {
        $scope.selectService($scope.user.registry.services[0]);
    }

    
});