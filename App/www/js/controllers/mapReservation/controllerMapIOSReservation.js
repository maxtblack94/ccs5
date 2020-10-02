angular.module('starter').controller('MapResercationIOSCtrl', function($state, ScriptServices, InfoFactories, $ionicModal, $ionicSideMenuDelegate, $ionicLoading, $scope, MapReservationService, $stateParams, $cordovaGeolocation) {
    $scope.userInfo = InfoFactories.getUserInfo();
    $scope.parkingList = $stateParams.parkList;

    function setMarkers(map) {
      var markers = {};
      for (let k = 0; k < $scope.parkingList.length; k++) {
          var park = $scope.parkingList[k];
          if (park.lat && park.lng) {
              markers[k] = map.addMarker({
                  'position': { lat: parseFloat(park.lat), lng: parseFloat(park.lng) },
                  'icon': 'https://i.ibb.co/348pm9N/car2.png',
                  'zIndex': 1,
                  'data': park
              });

              markers[k].on(plugin.google.maps.event.MARKER_CLICK, function(item) {
                getVehicleDetail(this.get('data').id);
              });
          }
      }
    }

    function setPersonalMarker() {
      if ($scope.currentPosition) {
        $scope.map.addMarker({
          'position': $scope.currentPosition,
          'icon': {
            'url': 'https://i.ibb.co/cgZb8wV/man.png'
          }
        });
      }
      
    }

      function initMap() {
        $ionicLoading.show();
        var options = {timeout: 10000, enableHighAccuracy: true};

        plugin.google.maps.LocationService.getMyLocation(options, function(position) {
            $ionicLoading.hide();
            $scope.currentPosition = position.latLng;
    
            var mapOptions = {
              'backgroundColor': '#F9F2E7',
                'mapType': plugin.google.maps.MapTypeId.ROADMAP,
                'controls': {
                    'compass': false,
                    'myLocationButton': false,
                    'indoorPicker': true,
                    'zoom': true,
                },
                'gestures': {
                    'scroll': true,
                    'tilt': false,
                    'rotate': true,
                    'zoom': true,
                },
                'camera': {
                    'latLng': position.latLng,
                    'zoom': 13,
                }
              };
              $scope.map = plugin.google.maps.Map.getMap(document.getElementById("mapNew"), mapOptions);
              $scope.map.addEventListener(plugin.google.maps.event.MAP_READY, function() {
                setMarkers($scope.map);
                setPersonalMarker();
              });
        }, function(error){
            $ionicLoading.hide();
            console.log("Could not get location");
        });
      }



      $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.cancelModal = function() {
        $scope.modal.hide();
        $scope.currentVehicle = null;
      };

      $scope.proceed = function () {
        $scope.modal.hide();
        $state.go('confirmMapReservation', {vehicle: $scope.currentVehicle});
      }

      function getVehicleDetail(vehicleId) {
        $ionicLoading.show(); 
        ScriptServices.getXMLResource(738).then(function(res) {
            res = res.replace('{NUMBER_DRIVER}', $scope.userInfo.driverNumber)
            .replace('{VEHICLEID}', vehicleId);
            ScriptServices.callGenericService(res, 738).then(function(data) {
                $ionicLoading.hide(); 
                $scope.currentVehicle = data.data;
                $scope.openModal();
            }, function (err) {
                $ionicLoading.hide(); 
            });
        });
      }


      document.addEventListener("deviceready", function() {
        $ionicSideMenuDelegate.canDragContent(false)
        initMap()
      }, false);
       
      $scope.cancel = function (params) {
        $state.go('tab.bookings')
      }
})