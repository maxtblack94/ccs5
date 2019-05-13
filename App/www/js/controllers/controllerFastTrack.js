angular.module('starter').controller('FastTrackCtrl', function(InfoFactories, ScriptServices, $state, $scope, $ionicLoading) {
    $scope.userInfo = InfoFactories.getUserInfo();


    $scope.cancel = function(){
        $state.go("tab.bookings");
    };
 
    
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
    }

    function openVehicleWithBle(reservation, action) {
        $ionicLoading.show();
        
        ScriptServices.getXMLResource(640).then(function(res) {
            res = res.replace('{PNR}', null).replace('{OPT}', 0);
            ScriptServices.callGenericService(res, 640).then(function(data) {
                reservation.TKN = data.data.encryptedStr;
                BluetoothServices.connectToVehicle(reservation, action);
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('bookings.errorOpenCar'));
                $ionicLoading.hide();
            });
        });
    }

    $scope.startScan = function() {
        $scope.firstSearch = false;
        $scope.$broadcast('scroll.refreshComplete');
        $scope.items = [];
        ble.startScan([], function(device) {
            getCarInfo(device);
            
        }, function() { 
            console.log("stopScan failed");
        });
        
        setTimeout(ble.stopScan,
            2000,
            function() { 
                console.log("Scan complete"); 
            },
            function() { 
                console.log("stopScan failed");
            }
        );
    }
 
});