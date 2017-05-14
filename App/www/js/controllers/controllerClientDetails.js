angular.module('starter').controller('ClientDetailCtrl', function($state, $scope, InfoFactories) {
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.userInfo = InfoFactories.getUserInfo().registry;

    $scope.edit = function(){
        $scope.request = {
            "email": $scope.userInfo.email,
            "cellulare": $scope.userInfo.mobile_phone
        }
    }

    $scope.undo = function(){
        $scope.request = undefined;
    }

    $scope.save = function(){
        $scope.request = undefined;
    }

})