angular.module('app').controller('controllerMain', function ($scope, $state, $rootScope, $http) {

    $scope.getLinkedInData = function () {
		if (!$scope.hasOwnProperty("userprofile")) {
			IN.API.Profile("me").fields(
				["id", "firstName", "lastName", "pictureUrl",
					"publicProfileUrl"]).result(function (result) {
						// set the model
						$rootScope.$apply(function () {
							var userprofile = result.values[0]
							$rootScope.userprofile = userprofile;
							$rootScope.loggedUser = true;
							//go to main
							$state.go('viewMain.home')
						});
					}).error(function (err) {
						$scope.error = err;
					});
		}
    };
    
    $http({
        method: 'POST',
        url: 'http://app01-dev.fuduxa.vtnx.net/fiduxa-certificator/login/linkedIn',
        data: {"accessToken": IN.ENV.auth.oauth_token, "state": null},
        headers: {
            "FDX-TransactionId":"321323213",
            "Content-Type": "application/json"
        }
        }).then(function successCallback(response) {
            console.log(response)
            $scope.userContext = response.data;
            // when the response is available
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

});