angular.module('starter').controller('SubscriptionsCtrl', function(InfoFactories, $scope, ReservationService, $state) {
    $scope.user = InfoFactories.getUserInfo();

    $scope.selectService = function(service) {
        ReservationService.setService(service);
        $state.go('park');
    };

    $scope.cancel = function () {
        console.log('cancel');
    };
});