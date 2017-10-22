angular.module('starter').controller('AppCtrl', function(ScriptServices, InfoFactories, $rootScope, $scope, $state) {
   $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.currentState = toState.name;
    })

    $scope.model = $scope.model || {};

    $scope.model.getNotifications = function(){
        ScriptServices.getXMLResource(635).then(function(res) {
            res = res.replace('{DRIVERNUMBER}', InfoFactories.getUserInfo().driverNumber);
            ScriptServices.callGenericService(res, 635).then(function(data) {
                $scope.model.notificationsPending = data.data;
            }, function(error) {
                //PopUpServices.errorPopup("Non è stato possibile modificare i contatti");
            })
        });
    }

    $scope.model.getNotifications();

    $scope.changeStateContacts = function(){
        if($scope.currentState !== "contacts"){
            $state.go("contacts");
        }else{
            $state.go("tab.bookings");
        }
    }
})