angular.module('starter').controller('FastTrackCtrl', function(InfoFactories, AndroidBleConnectionService, ScriptServices, $state, $scope, $ionicLoading) {
    $scope.userInfo = InfoFactories.getUserInfo();

    $scope.cancel = function(){
        $state.go("tab.bookings");
    };

    $scope.$on('bleInteraction', function(event, interactionData) {
        $ionicLoading.hide();
        $scope.refreshBookings();
        console.log('interaction', interactionData);
    });

    function getCarInfo(device){
         ScriptServices.getXMLResource(646).then(function(res) {
             res = res.replace('{BLEID}', device.id);
             ScriptServices.callGenericService(res, 646).then(function(data) {
                 if (data.data) {
                     data.data.carInfo.bleID = device.id;
                     data.data.carInfo.pnr = ScriptServices.generateUUID4();
                    $scope.items.push(data.data.carInfo);
                 }
             }, function(error) {
             });
         });
    };

    $scope.startFastTrack = function(carInfo) {
        openVehicleWithBle(carInfo, 'pushPNR');
    };

    function openVehicleWithBle(reservation, action) {
        $ionicLoading.show();
        
        ScriptServices.getXMLResource(648).then(function(res) {
            res = res.replace('{BLEID}', reservation.bleID).replace('{DRIVERID}', $scope.userInfo.driverNumber);
            ScriptServices.callGenericService(res, 648).then(function(data) {
                reservation.TKN = data.data.encryptedStr;
                AndroidBleConnectionService.connectToVehicle(reservation, action);
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('bookings.errorOpenCar'));
                $ionicLoading.hide();
            });
        });
    }

    $scope.startScan = function() {
        ble.isEnabled(function() {
            console.log('ble is enabled');
            doScan();
        },
        function() {
            $scope.$broadcast('scroll.refreshComplete');
            alert('Ti preghiamo di abilitare il Bluetooth e riprovare.');
        });
    };

    function doScan() {
        $ionicLoading.show();
        $scope.firstSearch = false;
        $scope.$broadcast('scroll.refreshComplete');
        $scope.items = [];
        ble.startScan([], function(device) {
            getCarInfo(device);
            
        }, function() { 
            $ionicLoading.hide();
            console.log("stopScan failed");
        });
        
        setTimeout(ble.stopScan,
            3000,
            function() { 
                console.log("Scan complete"); 
                $scope.$broadcast('scroll.refreshComplete');
                $ionicLoading.hide();
            },
            function() { 
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                console.log("stopScan failed");
            }
        );
    }


    $scope.startScan();
 
});