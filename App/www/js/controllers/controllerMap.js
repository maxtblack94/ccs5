angular.module('starter').controller('MapCtrl', function ($filter, PopUpServices, ScriptServices, $scope, $http, $state, $ionicLoading, $cordovaGeolocation, $ionicPopup) {
    $scope.selectedBooking = $state.params.pnrInfo;

    $scope.navigate = function () {

        if (device.platform == 'iOS') {
            window.open('maps://?q=' + $scope.g_address, '_system');
        } else {
            var label = encodeURI($scope.g_address);
            window.open('geo:0,0?q=' + $scope.g_address, '_system');
        }
    };
    $scope.delete = function (book) {
        PopUpServices.buttonsPopup({
            title: $filter('translate')('bookings.cancelConfirmTitle'),
            message: $filter('translate')('bookings.cancelConfirmBody'),
            buttons: [{ 
                text: $filter('translate')('commons.close'),
                type: 'button-stable',
            },{
                text: '<b>'+ $filter('translate')('commons.confirm') +'</b>',
                type: 'button-positive',
                onTap: function() {
                    var script = book.status === 'Registered' ? 643 : 553;
                    $ionicLoading.show();
                    ScriptServices.getXMLResource(script).then(function(res) {
                        res = res.replace('{BOOKING_NUMBER}', book.Nr);
                        ScriptServices.callGenericService(res, script).then(function(data) {
                            $state.go('tab.bookings');
                        }, function(error) {
                        
                        })
                    });
                }
            }],
        });

    };



    function convertCoordinates() {
        return {
            lat: Number($scope.selectedBooking.lat),
            lng: Number($scope.selectedBooking.lng)
        };
    }

    var coorOnj = convertCoordinates();

    $scope.centerToMarker = function(){
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: coorOnj.lat, lng: coorOnj.lng },
            zoom: 18,
            mapTypeControl: false
        });
        markerOn();
    }
    

    function markerOn(){
        new google.maps.Marker({
            position: {
                lat: coorOnj.lat,
                lng: coorOnj.lng
            },
            map: map
        });
    }
    

    var latlng = new google.maps.LatLng(coorOnj.lat, coorOnj.lng);
    new google.maps.Geocoder().geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                $scope.g_address = results[0].formatted_address;
                $scope.$apply();
                $scope.centerToMarker();
            } else {
                PopUpServices.errorPopup($filter('translate')('map.noCoordsFound'), '1');
            }
        } else {
            PopUpServices.errorPopup($filter('translate')('map.noCoordsFound'), '1');
        }
    });

})