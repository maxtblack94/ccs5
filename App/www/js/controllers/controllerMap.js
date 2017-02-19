angular.module('starter').controller('MapCtrl', function($scope, $http, $state, $ionicLoading, $cordovaGeolocation, $ionicPopup, WebService) {
    $scope.locale = window.locale;
    $ionicLoading.show();
    var map;
    var mylat;
    var mylong;
    var carlat = 41.8156957;
    var carlong = 12.483382;

    $scope.selectedBooking = $state.params.pnrInfo;
    
    $scope.navigate = function() {
        
        if(device.platform == 'ios') {
            window.open('maps://?q=' + $scope.g_address, '_system');
        }else {
            var label = encodeURI(g_address);
            window.open('geo:0,0?q=' + $scope.g_address + '(' + g_address + ')', '_system');
        }
    };
    
    $cordovaGeolocation.getCurrentPosition().then(function(position) {
        mylat = position.coords.latitude;
        mylong = position.coords.longitude;
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: mylat, lng: mylong },
            zoom: 18,
            mapTypeControl: false
        });
        
        codeLatLng(mylat, mylong, function(addr) {
            $scope.loadingMap = false;
            $scope.g_address = addr.formatted_address;
            $ionicLoading.hide();
            $scope.centerCarMap();
        });
        
        var mymarker = new google.maps.Marker({
            position: {
                lat: mylat,
                lng: mylong
            },
            map: map,
            title: 'Hello World!'
        });
        
    }, function(error) {
        console.log('error:', error);
    });
    
    $scope.delete = function(book) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Conferma eliminazione',
            template: 'Sicuro di vole eliminare la prenotazione selezionata?'
        });
        
        confirmPopup.then(function(res) {
            if(res) {
                if(!book)
                    return;
                
                $ionicLoading.show();
                $http.get("res/553.xml").success(function(res) {
                    res = res.replace('{BOOKING_NUMBER}', book.Nr);
                    WebService.ajaxPostRequest(res, 553, function(data) {
                        $state.go('tab.bookings');
                    });
                });
            } 
        });
    };
    
    $scope.centerCarMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: carlat, lng: carlong },
            zoom: 18,
            mapTypeControl: false
        });
        
        var carmarker = new google.maps.Marker({
            position: {
                lat: carlat,
                lng: carlong
            },
            map: map,
            title: 'Hello World!'
        });
    };

    function codeLatLng(lat, lng, complete) {
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(lat, lng);
    
    geocoder.geocode({
        'latLng': latlng
    }, 
    function (results, status) {
        console.log(results);
        
        if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
            console.log(results);
            if(complete)
                complete(results[0]);
        } 
        else {
            console.log('No results found');
        }
        } else {
        console.log('Geocoder failed due to: ' + status);
        }
    });
    }
    
    $scope.centerMYPosition = function() {
        
    };
})