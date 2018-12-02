angular.module('starter').controller('notificationsCtrl', function($filter, $rootScope, PopUpServices, ScriptServices, $ionicSideMenuDelegate, $scope, $http, $state, $ionicLoading, InfoFactories) {
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
                PopUpServices.errorPopup($filter('translate')('notifications.failGetNotfications'));
            })
        });
    }

    $scope.openNotification = function(notification){
        var parsedNotification = {
            "title" : notification.headings.it,
            "body" : notification.contents.it,
            "additionalData" : notification.data,
            "eventName" : notification.data.eventName,
            "pushID" : notification.data.pushID
        }
        $rootScope.$broadcast('pushNotificationEvent', parsedNotification);
    }

    if(!$scope.model.notificationsPending){
        $scope.refreshNotifications();
    }

})