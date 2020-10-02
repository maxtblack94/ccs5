angular.module('starter').controller('MapResercationCtrl', function($state, ScriptServices, InfoFactories, $ionicModal, $ionicSideMenuDelegate, $ionicLoading, $scope, MapReservationService, $stateParams, $cordovaGeolocation) {
    $scope.userInfo = InfoFactories.getUserInfo();
    $scope.parkingList = $stateParams.parkList;

    function setMarkers(map) {
      for (let k = 0; k < $scope.parkingList.length; k++) {
          var park = $scope.parkingList[k];
          if (park.lat && park.lng) {
              var marker = new google.maps.Marker({
                  position: { lat: parseFloat(park.lat), lng: parseFloat(park.lng) },
                  map: map,
                  icon: "icons/car2.png",
                  clickable: true,
                  title: park.id,
                  zIndex: 1
              });

              google.maps.event.addListener(marker, 'click', function (event) {
                  getVehicleDetail(this.getTitle());
                });
          }
      }
    }

    function setPersonalMarker(map, coords) {
      var marker = new google.maps.Marker({
          position: coords,
          map: map,
          icon: "icons/man.png",
          clickable: true,
          zIndex: 1
      });
    }

      function initMap() {
        $ionicLoading.show();
        var options = {timeout: 10000, enableHighAccuracy: true};

        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
            $ionicLoading.hide();
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    
            var mapOptions = {
            center: latLng,
            zoom: 16,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: true,
            fullscreenControl: false,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP
            };
    
            $scope.map = new google.maps.Map(document.getElementById("mapNew"), mapOptions);
            setMarkers($scope.map);
            setPersonalMarker($scope.map, latLng);
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

      function init(params) {
        $ionicSideMenuDelegate.canDragContent(false)
        initMap();
      }

      $scope.cancel = function (params) {
        $state.go('tab.bookings')
      }


      init();
})