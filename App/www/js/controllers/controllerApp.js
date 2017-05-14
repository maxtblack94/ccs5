angular.module('starter').controller('AppCtrl', function($state, $scope) {
   $scope.currentState = ($state.currentState || {}).name;
})