angular.module('starter').factory("BluetoothServices", function(InfoFactories, ArrayServices, $q, ScriptServices) {
    var currentDevice;
    var lastReservation, lastOperation, userInfo;

    function connectToVehicle(reservation, operation) {
        userInfo = InfoFactories.getUserInfo();
        lastOperation = operation;
        lastReservation = reservation;
        ble.isEnabled(function() {
            console.log('ble is enabled');
            isConnected(reservation);
        },
        function() {
            alert('Ti preghiamo di abilitare il Bluetooth e riprovare.');
        });
    }

    function isConnected(reservation) {
        console.log('I check connection');
        ble.isConnected(reservation.bleID, function(status) {
            if (status === 'OK') {
                console.log('Im already connected');
                mtuSize();
            }else{
                console.log('Im not connected. Connecting...');
                doConnection(reservation);
            }
        }, function() {
            console.log('Check Error, Connecting...');
            doConnection(reservation);
        });
    }


    function doConnection(reservation){
        console.log('Connecting...');
        ble.connect(reservation.bleID, function(params) {
            console.log('Connected', params);
            currentDevice = params;
            mtuSize();
        },
        function(error) {
            console.log('Fail connection, i try again...', error);
            currentDevice = null;
            doConnection(reservation);
        });
    }

    function mtuSize(){
        ble.requestMtu(currentDevice.id, 512,function() {
            console.log('MTU OK');
            setTimeout(function() {
                doNotifyRequest();
            }, 500);
        }, function() {
            console.log('MTU Fail, i try again.');
            mtuSize();
        });
    }

    function doNotifyRequest() {
        console.log('start notify');
        var notifyService = currentDevice.characteristics.find(function(item){
            return item.characteristic === lastReservation.bleCharacteristics;
        });
        ble.withPromises.startNotification(currentDevice.id, notifyService.service, notifyService.characteristic, function(buffer) {
            if (buffer) {
                var notifyData = ArrayServices.bytesToObject(buffer);
                if (notifyData && notifyData.MT) {
                    switch (notifyData.MT) {
                        case "100":
                            write('pushPNR');
                            break;
                        case "5000":
                            
                            break;
                        case "10000":
                            
                            break;
                    
                        default:
                            break;
                    }
                }
                
                console.log('notify',notifyData);
            }
            
        }, function() {
            console.log('notifyFail');
            currentDevice = null;
        });
        setTimeout(function() {
            console.log('start Pair');
            write('pair');
        }, 500);
    }

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
            IDPNR : lastReservation.pnr || "82939992889",
            MessageType: action ? "6": "5",
            IDBadge: "0122578B2A000000" //(userInfo.registry || {}).badge_id
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

    function write(action){
        var writeService = currentDevice.characteristics.find(function(item){
            return item.characteristic === lastReservation.bleCharacteristics;
        });
        var string = "";
        switch (action) {
            case "version":
                string = versioningRequest();
                break;
            case "pair":
                string = pairingRequest();
                break;
            case "pushPNR":
                string = lastOperation ==='pushPNR'? pushPNRRequest():pushPNRRequest('close');;
                break;
            case "pushPNRClose":
                string = pushPNRRequest('close');
                break;
        
            default:
                break;
        }
        console.log('write', string);
        string = ArrayServices.stringToBytes(JSON.stringify(string));
        ble.write(currentDevice.id, writeService.service, writeService.characteristic, string, function(params) {
            console.log('write OK');
        }, function(error) {
            currentDevice = null;
            console.log('write', error);
        });
    };


    

    function disconnect(){
        if (currentDevice) {
            ble.disconnect(currentDevice.id, function (params) {
                console.log("disconnect success", params);
            }, function (params) {
                console.log("disconnect fail", params);
            });
        }
    };


    return {
        connectToVehicle: function (reservation, operation) {
            return connectToVehicle(reservation, operation);
        },
        disconnect: function () {
            return disconnect();
        },
        write: function (action) {
            return write(action);
        }
    };

})
