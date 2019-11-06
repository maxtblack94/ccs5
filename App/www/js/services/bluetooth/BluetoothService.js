angular.module('starter').factory("BluetoothServices", function(UpdateBBService, ArrayServices, $rootScope, ScriptServices, $filter) {
    var currentDevice;
    var lastReservation, lastOperation, actionsList = [];
    var currentMessage;

    function doNotifyRequest(reservation, operation, currentD) {
        lastOperation = operation;
        lastReservation = reservation;
        currentDevice = currentD;
        console.log('start notify');
        var notifyService = currentDevice.characteristics.find(function(item){
            return item.characteristic.toLowerCase() === "75dcca42-81c1-4552-b3b1-1dce25eb4ea2";
        });
        
        ble.withPromises.startNotification(currentDevice.id, notifyService.service, notifyService.characteristic, function(buffer) {
            var notifyData = ArrayServices.bytesToString(buffer);
            if (buffer && typeof notifyData !== 'string') {
                manageNotifyMessage(notifyData);
            } else if(buffer && typeof notifyData === 'string') {
                currentMessage = currentMessage + notifyData;
                try {
                    var completeNotifyData = JSON.parse(currentMessage);
                    manageNotifyMessage(completeNotifyData);
                    currentMessage = null;
                } catch (error) {
                    
                }
            }
            
        }, function() {
            currentDevice = null;
        });
        setTimeout(function() {
            write('pair');
        }, 500);
    }

    function manageNotifyMessage(notifyData) {
        var interaction = actionsList.find(function (item) {
            return item.TI === notifyData.TI;
        });
        if (interaction && interaction.MT) {
            if (notifyData.RC) {
                errorHandler(notifyData.RC, notifyData.MT);
            } else {
                switch (interaction.MT) {
                    case 100:
                        write('pushPNR');
                        break;
                    case 5000:
                        //$rootScope.$broadcast('bleInteraction', {resultStatus: 'OK', interaction: interaction});
                        /* disconnect(); */
                        break;
                    case 5001:
                        $rootScope.$broadcast('bleInteraction', {resultStatus: 'OK', interaction: interaction});
                        disconnect();
                        break;
                    case 10000:
                        
                        break;
                
                    default:
                        break;
                }
            }
        }else{
            if (notifyData.MT === 5001) {
                tryUpdateBB(notifyData);
                $rootScope.$broadcast('bleInteraction', {resultStatus: 'OK', interaction: interaction});
            } else {
                errorHandler('GENERIC_ERROR');
            }
        }
    }

    function tryUpdateBB(interaction) {
        UpdateBBService.updateBBWithTKN(interaction);
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
        /* var TKNString = JSON.stringify({ 
            "tid": "6f348d129f32", 
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
        var TKNBase64 = btoa(TKNString); */




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
                string = lastOperation ==='pushPNR'? pushPNRRequest():pushPNRRequest('close');
                break;
            case "pushPNRClose":
                string = pushPNRRequest('close');
                break;
        
            default:
                break;
        }
        
        console.log('write obj', string);
        actionsList.push(string);
        var stringArray = ArrayServices.stringToBytes(JSON.stringify(string));
        var bufferLength = stringArray.byteLength;
        var totalCounts = bufferLength / 50 > 0 ? bufferLength / 50: 1;
        for (var k = 0; k <  totalCounts; k++) {
            var stringItem;
            if (k === 0) {
                stringItem = stringArray.slice(0, 50);
            } else if (k === 1) {
                stringItem = stringArray.slice(50, 100);
            } else if (k === 2) {
                stringItem = stringArray.slice(100, 150);
            } else if (k === 3) {
                stringItem = stringArray.slice(150, 200);
            } else if (k === 4) {
                stringItem = stringArray.slice(200, 250);
            } else if (k === 5) {
                stringItem = stringArray.slice(250, 300);
            } else if (k === 6) {
                stringItem = stringArray.slice(300, 350);
            } else if (k === 7) {
                stringItem = stringArray.slice(350, 400);
            } else if (k === 8) {
                stringItem = stringArray.slice(400, 450);
            } else if (k === 9) {
                stringItem = stringArray.slice(450, 500);
            } else if (k === 10) {
                stringItem = stringArray.slice(500, 550);
            }
             
            console.log('write piece', stringItem);
            ble.write(currentDevice.id, writeService.service, writeService.characteristic, stringItem, function(params) {
                
                console.log('write OK');
            }, function(error) {
                errorHandler("WRITE_ERROR");
                currentDevice = null;
                console.log('write', error);
            });
        }

        
        
    };


    function errorHandler (RC, MT) {
        var errorMessage; 
        var errorCode;
        switch (RC) {
            case 10:
            case 30:
            case 40:
            case 50:
            case 80:
            case 'GENERIC_ERROR':
                errorCode = 'GENERIC_ERROR';
                errorMessage = $filter('translate')('commons.bleConnectionGenericError');
                break;
            case 20:
                errorCode = 'INVALID_KEY';
                errorMessage = $filter('translate')('commons.bleConnectionInvalidKey');
                break;
            case 150:
                errorCode = 'ALREADY_DID';
                errorMessage = $filter('translate')('commons.bleConnectionAlreadyProcessedRequest');
                break;
            case 160:
                errorCode = 'NO_KEY';
                errorMessage = $filter('translate')('commons.bleConnectionNoKey');
                break;
            default:
                break;
        }
        $rootScope.$broadcast('bleInteraction', {resultStatus: 'KO', errorCode: errorCode, errorMessage: errorMessage});
    }


    

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
        disconnect: function () {
            return disconnect();
        },
        write: function (action) {
            return write(action);
        },
        doNotifyRequest: function (reservation, operation, currentD) {
            return doNotifyRequest(reservation, operation, currentD);
        },
        
    };

})
