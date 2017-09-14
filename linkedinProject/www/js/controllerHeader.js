angular.module('app').controller('controllerHeader', function ($scope, $state, $rootScope) {
    $scope.title = "FDX Company";
    //logout and go to login screen
    $scope.logoutLinkedIn = function () {
        //retrieve values from LinkedIn
        IN.User.logout();
        delete $rootScope.userprofile;
        $rootScope.loggedUser = false;
    };
});


