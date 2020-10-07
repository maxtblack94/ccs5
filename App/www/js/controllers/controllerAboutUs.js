angular.module('starter').controller('aboutUsCtrl', function( $scope, InfoFactories) {
    $scope.selectedClient = InfoFactories.getClientSelected();
  
})