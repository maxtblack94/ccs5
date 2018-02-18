angular.module('starter').controller('AppCtrl', function(ScriptServices, InfoFactories, $rootScope, $scope, $state) {
   $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.currentState = toState.name;
        if (toState.name === 'tab.bookings') {
            getNotifications();
        }
    })

    $scope.model = $scope.model || {};

    function getNotifications(){
        ScriptServices.getXMLResource(635).then(function(res) {
            res = res.replace('{DRIVERNUMBER}', InfoFactories.getUserInfo().driverNumber);
            ScriptServices.callGenericService(res, 635).then(function(data) {
                $scope.model.notificationsPending = ((data.data || {}).dataList || []);
            }, function(error) {
                //PopUpServices.errorPopup("Non è stato possibile modificare i contatti");
            })
        });
    }

    $scope.changeStateContacts = function(){
        if($scope.currentState !== "contacts"){
            $state.go("contacts");
        }else{
            $state.go("tab.bookings");
        }
    }
})