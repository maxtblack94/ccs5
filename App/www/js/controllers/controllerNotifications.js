angular.module('starter').controller('notificationsCtrl', function(ScriptServices, $ionicSideMenuDelegate, $scope, $http, $state, $ionicLoading, InfoFactories, WebService) {
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.userInfo = InfoFactories.getUserInfo();


    $scope.refreshNotifications = function(refresh){
        $scope.$broadcast('scroll.refreshComplete');
        $ionicLoading.show();
        $scope.model.notificationsPending = null;
        ScriptServices.getXMLResource(635).then(function(res) {
            res = res.replace('{DRIVERNUMBER}', InfoFactories.getUserInfo().driverNumber);
            ScriptServices.callGenericService(res, 635).then(function(data) {
                $ionicLoading.hide();
                $scope.model.notificationsPending = ((data.data || {}).dataList || []);
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup("Non è stato possibile recuperare le notifiche dal server");
            })
        });
    }



    

    if(!$scope.model.notificationsPending){
        $scope.refreshNotifications();
    }

})