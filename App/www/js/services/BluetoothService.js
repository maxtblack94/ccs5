angular.module('starter').factory("BluetoothServices", function($cordovaDevice, InfoFactories, ArrayServices, $rootScope, ScriptServices) {
    var currentDevice;
    var lastReservation, lastOperation, userInfo, actionsList = [];

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
            $rootScope.$broadcast('bleInteraction', {resultStatus: 'KO', errorMessage: "Ti preghiamo di abilitare il Bluetooth e riprovare"});
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
            console.log('ho langiato 1');
            return item.characteristic.toLowerCase() === lastReservation.bleCharacteristics.toLowerCase();
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
                            $rootScope.$broadcast('bleInteraction', parsedNotification);
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
        console.log('ho langiato notify');
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
            "MT": 100,
            "PK": 11
        };
    }

    function pushPNRRequest(action) {
        var TKNString = JSON.stringify({ 
            "tid": "c9854e45-ed79-403f-b0c5-6f348d129f46", 
            "ty": action ? 6: 0, 
            "data": {
            "rid": lastReservation.pnr || "000001043B84FA3E3E808325",
            "bid": "000001043B84FA3E3E80",
            "st": new Date().getTime() - 600000 ,
            "et": new Date().getTime() + 600000 ,
            "pid": 8,
            "v": "0000",
            "rty": 0,
            "e": true,
            "io": true,
            "poi": {
              "geo": {
                "type": "Point",
                "coordinates": [
                  41.8749715,
                  12.3899344
                ]
              },
              "r": 1000
            }
          }
        });
        var TKNBase64 = btoa(TKNString);




        return {
            "TS": new Date().getTime(),
            "TI": ScriptServices.generateUUID4(),
            "MSG": ScriptServices.generateUUID4(),
            "MT": 5000,
            "CRY": false,
            "CT": 0,
            "TKN": TKNBase64
        };
    };

    function write(action){
        var writeService = currentDevice.characteristics.find(function(item){
            return item.characteristic.toLowerCase() === lastReservation.bleCharacteristics.toLowerCase();
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
