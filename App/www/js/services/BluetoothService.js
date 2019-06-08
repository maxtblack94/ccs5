angular.module('starter').factory("BluetoothServices", function($cordovaDevice, InfoFactories, ArrayServices, $rootScope, ScriptServices) {
    var currentDevice;
    var lastReservation, lastOperation, userInfo, actionsList = [];

    

    function connectToVehicle(reservation, operation) {
        userInfo = InfoFactories.getUserInfo();
        lastOperation = operation;
        lastReservation = reservation;
        if (currentDevice) {
            disconnect();
        } else {
            ble.isEnabled(function() {
                console.log('ble is enabled');
                isConnected(reservation);
            },
            function() {
                alert('Ti preghiamo di abilitare il Bluetooth e riprovare.');
                $rootScope.$broadcast('bleInteraction', {resultStatus: 'KO', errorMessage: "Ti preghiamo di abilitare il Bluetooth e riprovare"});
            });
        }
        
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
            $rootScope.$broadcast('bleInteraction', {resultStatus: 'KO', errorMessage: "Fail connection, i try again..."});
            currentDevice = null;
            /* doConnection(reservation); */
        });
    }

    function mtuSize(){
        if ($cordovaDevice.getPlatform() == 'iOS') {
            setTimeout(function() {
                doNotifyRequest();
            }, 500);
        }else{
            ble.requestMtu(currentDevice.id, 512,function() {
                console.log('MTU OK');
                setTimeout(function() {
                    doNotifyRequest();
                }, 500);
            }, function() {
                console.log('MTU Fail, i try again.');
                $rootScope.$broadcast('bleInteraction', {resultStatus: 'KO', errorMessage: "MTU Fail, i try again."});
                mtuSize();
            });
        }
        
    }

    function doNotifyRequest(withPair) {
        console.log('start notify');
        var notifyService = currentDevice.characteristics.find(function(item){
            return item.characteristic.toLowerCase() === "75dcca42-81c1-4552-b3b1-1dce25eb4ea2";
        });
        
        ble.withPromises.startNotification(currentDevice.id, notifyService.service, notifyService.characteristic, function(buffer) {
            if (buffer) {
                console.log('notify buffer', buffer);
                var notifyData = ArrayServices.bytesToString(buffer);
                console.log('notify notifyData', notifyData);
                var interaction = actionsList.find(function (item) {
                    return item.TI === notifyData.TI;
                });
                console.log('notify interaction', interaction);
                if (interaction && interaction.MT) {
                    switch (interaction.MT) {
                        case 100:
                            write('pushPNR');
                            break;
                        case 5000:
                            $rootScope.$broadcast('bleInteraction', interaction);
                            break;
                        case 10000:
                            
                            break;
                    
                        default:
                            break;
                    }
                }else{
                    $rootScope.$broadcast('bleInteraction', {resultStatus: 'KO', errorMessage: "TID non trovato"});
                }
                
            }
            
        }, function() {
            currentDevice = null;
        });
        setTimeout(function() {
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
            "MT": 100,
            "PK": 11
        };
    }

    function pushPNRRequest() {
        
        return {
            "TS": new Date().getTime(),
            "TI": ScriptServices.generateUUID4(),
            "MSG": ScriptServices.generateUUID4(),
            "MT": 5000,
            "CRY": true,
            "CT": 1,
            "TKN": lastReservation.TKN
        };

    };

    function write(action){
        var writeService = currentDevice.characteristics.find(function(item){
            return item.characteristic.toLowerCase() === "75dcca42-81c1-4552-b3b1-1dce25eb4ea2";
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
        console.log('write', JSON.stringify(string));
        actionsList.push(string);
        console.log('actionlist', JSON.stringify(actionsList));
        string = ArrayServices.stringToBytes(JSON.stringify(string));
        ble.write(currentDevice.id, writeService.service, writeService.characteristic, string, function(params) {
            console.log('write OK');
        }, function(error) {
            $rootScope.$broadcast('bleInteraction', {resultStatus: 'KO', errorMessage: "Errore Write"});
            currentDevice = null;
            console.log('write', error);
        });
    };


    

    function disconnect(){
        if (currentDevice) {
            ble.disconnect(currentDevice.id, function (params) {
                currentDevice = undefined;
                connectToVehicle(lastReservation, lastOperation);
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
