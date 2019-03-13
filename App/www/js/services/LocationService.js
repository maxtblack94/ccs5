angular.module('starter').factory("LocationService", function ($ionicPlatform, PopUpServices, $filter) {
    var platform;
    $ionicPlatform.ready(function () {
        if (!window.serverRootLocal && cordova) {
            platform = cordova.platformId;
        }
    });


    function onError(error) {
        console.error("The following error occurred: " + error);
    }

    function handleLocationAuthorizationStatus(status) {
        switch (status) {
            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                if (platform === "ios") {
                    onError("Location services is already switched ON");
                } else {
                    _makeRequest();
                }
                break;
            case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                requestLocationAuthorization();
                break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED:
                if (platform === "android") {
                    onError("User denied permission to use location");
                } else {
                    _makeRequest();
                }
                break;
            case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                // Android only
                onError("User denied permission to use location");
                break;
            case cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE:
                // iOS only
                onError("Location services is already switched ON");
                break;
        }
    }

    function requestLocationAuthorization() {
        if (cordova) {
            if (platform !=='android') {
                //PopUpServices.messagePopup($filter('translate')('bookings.gpsAlert'), $filter('translate')('commons.attention'), polocyPopupCallback);
                cordova.plugins.diagnostic.requestLocationAuthorization(handleLocationAuthorizationStatus, onError);
            }else{
                cordova.plugins.diagnostic.requestLocationAuthorization(handleLocationAuthorizationStatus, onError);
            }
        }
    }

    function polocyPopupCallback(params) {
        cordova.plugins.diagnostic.requestLocationAuthorization(handleLocationAuthorizationStatus, onError);
    }

    function requestLocationAccuracy() {
        cordova.plugins.diagnostic.getLocationAuthorizationStatus(handleLocationAuthorizationStatus, onError);
    }

    function _makeRequest() {
        cordova.plugins.locationAccuracy.canRequest(function (canRequest) {
            if (canRequest) {
                cordova.plugins.locationAccuracy.request(function () {
                        console.log("Location accuracy request successful");
                    }, function (error) {
                        onError("Error requesting location accuracy: " + JSON.stringify(error));
                        if (error) {
                            // Android only
                            onError("error code=" + error.code + "; error message=" + error.message);
                            if (platform === "android" && error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                                if (window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")) {
                                    cordova.plugins.diagnostic.switchToLocationSettings();
                                }
                            }
                        }
                    }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY // iOS will ignore this
                );
            } else {
                // On iOS, this will occur if Location Services is currently on OR a request is currently in progress.
                // On Android, this will occur if the app doesn't have authorization to use location.
                onError("Cannot request location accuracy");
            }
        });
    }

    function isLocationAviable(){
        cordova.plugins.diagnostic.isLocationAvailable(function (success) {
            if (!success && platform === "ios") {
                PopUpServices.errorPopup($filter('translate')('bookings.gpsAlert'), '1');
            }
        });
    }

    return {
        requestLocationAuthorization: function () {
            return requestLocationAuthorization();
        },
        requestLocationAccuracy: function () {
            return requestLocationAccuracy();
        },
        isLocationAviable: function () {
            return isLocationAviable();
        }
    };
});