angular.module('starter').controller('BleCtrl', function(BluetoothServices, ArrayServices, ScriptServices, InfoFactories, $rootScope, $scope, $ionicLoading) {

    $scope.startMission = function() {
        $ionicLoading.show();
        BluetoothServices.connectToVehicle(defineReservation(), "pushPNR");
    };

    $scope.$on('bleInteraction', function(event, interactionData) {
        $ionicLoading.hide();
        console.log('interaction', interactionData);
    });

    $scope.model = $scope.model || {};

    $scope.model.customPNR = '';
    $scope.model.bleID = "9D14D1A5-2325-45B1-9CAB-9363C34A5B8F";

    $scope.stopMission = function() {
        $ionicLoading.show();
        BluetoothServices.connectToVehicle(defineReservation(), "pushPNRClose");
    };

    $scope.versioning = function() {
        BluetoothServices.write("version");
    };
    
    function defineReservation() {
        return {
            "Nr": "14496",
            "bleID": $scope.model.bleID || "B4:B8:59:16:08:76",
            "bleCharacteristics" : "75dcca42-81c1-4552-b3b1-1dce25eb4ea2",
            "status": "Booked",
            "plate": "ER311YB",
            "brand_model": "YARIS 1.5 HYBRID ACTIVE 5P CA VM",
            "pnr": $scope.model.customPNR || new Date().getTime(),
            "pickup_parking": "Roma Tupini",
            "pickup_date": "16/03/2017",
            "seats":"8",
            "pickup_time": "16/03/2017 15:40:42",
            "return_parking": "Roma Tupini",
            "return_date": "04/04/2018",
            "return_time": "16/03/2017 23:59:00",
            "pickup_date_tollerance": "16/03/2017",
            "pickup_time_tollerance": "16/03/2017 14:40:00",
            "return_date_tollerance": "04/04/2018",
            "return_time_tollerance": "16/03/2017 23:59:00",
            "cmb_color": "Blu",
            "image_max": "http://corporatecarsharing.it/images/vehicles/toyota/yaris-hybrid-white-l.jpg",
            "image_min": "http://corporatecarsharing.it/images/vehicles/toyota/yaris-hybrid-white-s.jpg",
            "km": "47.692",
            "vehicle_status": "Ok",
            "vehicle_cleanness_state": "Ok",
            "parking_slot": "0",
            "fuel": "Benzina",
            "destination": "",
            "lat": "41.8289516666667",
            "lng": "12.4603988333333",
            "latP": "41.830809",
            "lngP": "12.4598",
            "address": "Viale Umberto Tupini, 180",
            "cmb_fuel_quantity": "2/4"
        }
    }

    $scope.disconnect = function(){
        BluetoothServices.disconnect();
    };



    $scope.startScan = function() {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.items = [];
        ble.startScan([], function(device) {
            $scope.items.push(device);
        }, function() { 
            console.log("stopScan failed");
        });
        
        setTimeout(ble.stopScan,
            4000,
            function() { 
                console.log("Scan complete"); 
            },
            function() { 
                console.log("stopScan failed");
            }
        );
    }

    //$scope.startScan(); 

    /* function failure(params) {
        console.log('operation failed', params)
    } */

    $scope.connect = function (deviceID) {
        ble.connect(deviceID, onSuccesfullConnection, onFailConnection);
    }

    function onSuccesfullConnection(params) {
        $scope.currentDevice = params;
        console.log('connection successfull', params);

        for (var k = 0; k < params.characteristics.length; k++) {
            if (params.characteristics[k].characteristic === "648DC9CB-989B-4612-92A9-4D6E5106EB98") {
                ble.read(params.id, params.characteristics[k].service, params.characteristics[k].characteristic,
                    function(data){
                        if ("B4:B8:59:16:08:76".split(':').reverse().join("").toLowerCase() && ArrayServices.arrayBufferToHex(data)) {
                            alert("BleId Match"+ ArrayServices.arrayBufferToHex(data));
                        }
                    },
                    function(failure){
                        alert("Failed to read characteristic from device.");
                    }
                );
            }
        }
    }

    function onFailConnection(params) {
        console.log('connection fail', params);
    }

    $scope.maxMTU = function(){
        ble.requestMtu($scope.currentDevice.id, 512, callbackMTU, callbackMTU);
    };

    function callbackMTU(message) {
        console.log('MaxSize', message);
    }



    /* var onData = function(buffer) {
        alert("Notify:"+ ArrayServices.bytesToString(buffer))
    };

    $scope.write = function(type){
        var writeService = $scope.currentDevice.characteristics.find(function(item){
            return item.characteristic === '75dcca42-81c1-4552-b3b1-1dce25eb4ea2';
        });
        var string = "";
        switch (type) {
            case "version":
                string = versioningRequest();
                break;
            case "pair":
                string = pairingRequest();
                break;
            case "pushPNR":
                string = pushPNRRequest();
                break;
            case "pushPNRClose":
                string = pushPNRRequest('close');
                break;
        
            default:
                break;
        }
        string = ArrayServices.stringToBytes(JSON.stringify(string));
        ble.write($scope.currentDevice.id, writeService.service, writeService.characteristic, string, writesucce, writefail);
    };

    function versioningRequest() {
        return {
            "TS": new Date().getTime()
        };
    }

    function pairingRequest() {
        return {
            "TS": new Date().getTime(),
            "TI": ScriptServices.generateUUID4(),
            "MSG": ScriptServices.generateUUID4(),
            "MT": 10,
            "PK": 11
        };
    }

    function pushPNRRequest(action) {
        var TKN = {
            Version: "0000",
            IDPNR : "2A8BB7231866",
            MessageType: action ? "6": "5",
            IDBadge: "0122578B2A000000"
        };

        var TKNString = JSON.stringify(TKN);
        var TKNBase64 = btoa(TKNString);

        return {
            "TS": new Date().getTime(),
            "TI": ScriptServices.generateUUID4(),
            "MSG": ScriptServices.generateUUID4(),
            "MT": 5000,
            "TKN": TKNBase64
        };
    }

    

    function writesucce(params) {
        console.log('write success', params);
    }

    function writefail(params) {
        console.log('writefail', params);
    }

    $scope.notify = function(){
        var notifyService = $scope.currentDevice.characteristics.find(function(item){
            return item.characteristic === '75dcca42-81c1-4552-b3b1-1dce25eb4ea2';
        });
        ble.withPromises.startNotification($scope.currentDevice.id, notifyService.service, notifyService.characteristic, onData, notifyFail);
    }; */

    /* function onData (buffer){
        console.log(ArrayServices.bytesToString(buffer));
    } */

    /* function notifyFail(param) {
        console.log(param);
    }

    function disconnectSuccess(params) {
        $scope.currentDevice = undefined;
        console.log('disconnectsuccs', params)
    }

    function disconnectFail(params) {
        console.log('disconnectFail', params)
    } */

});