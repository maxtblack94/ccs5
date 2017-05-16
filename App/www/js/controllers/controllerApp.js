angular.module('starter').controller('AppCtrl', function($rootScope, $scope, $state) {
   $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.currentState = toState.name;
    })

    $scope.changeStateContacts = function(){
        if($scope.currentState !== "contacts"){
            $state.go("contacts");
        }else{
            $state.go("tab.bookings");
        }
    }
})