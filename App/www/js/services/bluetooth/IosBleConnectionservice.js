angular.module('starter').factory("IosBleConnectionService", function(BluetoothServices, $rootScope, ArrayServices, $filter) {
    var currentDevice;
    var lastReservation, lastOperation;
    var scanCount;
    var devices = [];

    function connectToVehicle(reservation, operation) {
        scanCount = 0;
        lastOperation = operation;
        lastReservation = reservation;
        if (!currentDevice) {
            
            ble.isEnabled(function() {
                console.log('ble is enabled');
                if (currentDevice && currentDevice.id) {
                    isConnected();
                } else {
                    startScan();
                }
            },
            function() {
                $rootScope.$broadcast('bleInteraction', {resultStatus: 'KO', errorMessage: $filter('translate')('commons.bleConnection')});
            });
        } else {
            ble.disconnect(currentDevice.id, function (params) {
                currentDevice = undefined;
                connectToVehicle(lastReservation,lastOperation);
            }, function (params) {
                console.log("disconnect fail", params);
            });
        }
        
    }

    function startScan() {
        devices = [];
        ble.startScan([], function(device) {
            if (device.name && device.name.includes('IO_EXP')) {
                devices.push(device);
            }
        }, function() { 
            console.log("stopScan failed");
        });
        
        setTimeout(ble.stopScan,
            4000,
            function() { 
                if (devices.length) {
                    searchBLEID(0);
                } else if (scanCount < 3) {
                    scanCount++;
                    startScan();
                } else {
                    $rootScope.$broadcast('bleInteraction', {resultStatus: 'KO', errorMessage: "Dispositivi non trovati"});
                }
            },
            function() { 
                console.log("stopScan failed");
            }
        );
    }

    function searchBLEID(index) {
        console.log('connectTo:', devices[index]);
        ble.connect(devices[index].id, function(params) {
            currentDevice = params;
            var characteristicExist = params.characteristics.find(function (item) {
                return item.characteristic.toLowerCase() === "648DC9CB-989B-4612-92A9-4D6E5106EB98".toLowerCase();
            });
            if (characteristicExist) {
                ble.read(params.id, characteristicExist.service, characteristicExist.characteristic, function(data){
                    if (lastReservation.bleID.split(':').reverse().join("").toLowerCase() === ArrayServices.arrayBufferToHex(data)) {
                        console.log('ble Match');
                        disconnectWithID();
                    } else {
                        manageNotFoundVehicle(index, devices);
                    }
                });
            } else {
                manageNotFoundVehicle(index, devices);
            }
        }, function (error) {
            manageNotFoundVehicle(index, devices);
        });
    }

    function manageNotFoundVehicle (index, devices) {
        if (index+1 >= devices.length) {
            disconnect();
            $rootScope.$broadcast('bleInteraction', {resultStatus: 'KO', errorCode: 'NOT_FOUND_VEHICLE', errorMessage:  $filter('translate')('commons.vehicleNotFound')});
        } else {
            disconnect(index+1);
        }
    }

    function isConnected() {
        console.log('I check connection');
        ble.isConnected(currentDevice.id, function(status) {
            if (status === 'OK') {
                console.log('Im already connected');
                setTimeout(function() {
                    BluetoothServices.doNotifyRequest(lastReservation, lastOperation, currentDevice);
                }, 500);
            }else{
                console.log('Im not connected. Connecting...');
                startScan();
            }
        }, function() {
            console.log('Check Error, Connecting...');
            startScan();
        });
    }

    function disconnectWithID(){
        if (currentDevice) {
            ble.disconnect(currentDevice.id, function (params) {
                connectBle();
            }, function (params) {
                console.log("disconnect fail", params);
            });
        }
    };

    function disconnect(index){
        if (currentDevice) {
            ble.disconnect(currentDevice.id, function (params) {
                if (index) {
                    setTimeout(() => {
                        searchBLEID(index);
                    }, 300);
                }
            }, function (params) {
                console.log("disconnect fail", params);
            });
        }
    };

    function connectBle() {
        ble.connect(currentDevice.id, function(params) {
            ble.startStateNotifications(
                function(state) {
                    console.log("Bluetooth is " + state);
                }
            );
            BluetoothServices.doNotifyRequest(lastReservation, lastOperation, currentDevice);
        }, function (error) {
            
        });
    }

/*     function doConnection(reservation){
        console.log('Connecting...');
        ble.connect(reservation.bleID, function(params) {
            console.log('Connected', params);
            currentDevice = params;
            setTimeout(function() {
                BluetoothServices.doNotifyRequest(lastReservation, lastOperation, currentDevice);
            }, 500);
        },
        function(error) {
            console.log('Fail connection, i try again...', error);
            $rootScope.$broadcast('bleInteraction', {resultStatus: 'KO', errorMessage: "Fail connection, i try again..."});
            currentDevice = null;
        });
    } */



    return {
        connectToVehicle: function (reservation, operation) {
            return connectToVehicle(reservation, operation);
        }
    };

});
