angular.module('starter').factory("IosBleConnectionService", function(BluetoothServices, $rootScope, ArrayServices) {
    var currentDevice;
    var lastReservation, lastOperation;
    var scanCount;
    var devices = [];

    function connectToVehicle(reservation, operation) {
        scanCount = 0;
        lastOperation = operation;
        lastReservation = reservation;
        ble.isEnabled(function() {
            console.log('ble is enabled');
            isConnected();
        },
        function() {
            alert('Ti preghiamo di abilitare il Bluetooth e riprovare.');
            $rootScope.$broadcast('bleInteraction', {resultStatus: 'KO', errorMessage: "Ti preghiamo di abilitare il Bluetooth e riprovare"});
        });
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
                    searchBLEID();
                } else if (scanCount < 3) {
                    scanCount++;
                    startScan();
                } else {
                    alert('Connessione al veicolo non riuscita. Riprovare');
                    $rootScope.$broadcast('bleInteraction', {resultStatus: 'KO', errorMessage: "Dispositivi non trovati"});
                }
            },
            function() { 
                console.log("stopScan failed");
            }
        );
    }

    function searchBLEID() {
        for (var i = 0; i < devices.length; i++) {
            ble.connect(devices[i].id, function(params) {
                currentDevice = params;
                console.log('connection successfull', params);
                for (let k = 0; k < params.characteristics.length; k++) {
                    if (params.characteristics[k].characteristic === "648DC9CB-989B-4612-92A9-4D6E5106EB98") {
                        ble.read(params.id, params.characteristics[k].service, params.characteristics[k].characteristic, function(data){
                            if (lastReservation.bleID.split(':').reverse().join("").toLowerCase() && ArrayServices.arrayBufferToHex(data)) {
                                console.log('ble Match');
                                BluetoothServices.doNotifyRequest(lastReservation, lastOperation, currentDevice);
                            }
                        });
                    }
                }
            }, function (error) {
                
            });
        }
    }

    function isConnected() {
        console.log('I check connection');
        ble.isConnected(lastReservation.bleID, function(status) {
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
