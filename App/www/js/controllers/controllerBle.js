angular.module('starter').controller('BleCtrl', function(BluetoothServices, ArrayServices, ScriptServices, InfoFactories, $rootScope, $scope, $ionicLoading) {

    $scope.startMission = function() {
        BluetoothServices.write("pushPNR");
    };

    $scope.pairing = function() {
        BluetoothServices.write("pair");
    };

    $scope.versioning = function() {
        BluetoothServices.write("version");
    };

    $scope.connect = function() {
        BluetoothServices.connectToVehicle({bleID:"B4:B8:59:16:08:76"});
    };

    $scope.disconnect = function(){
        BluetoothServices.disconnect();
    };



    /* $scope.startScan = function() {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.items = [];
        ble.startScan([], function(device) {
            $scope.items.push(device);
        }, function() { 
            console.log("stopScan failed");
        });
        
        setTimeout(ble.stopScan,
            10000,
            function() { 
                console.log("Scan complete"); 
            },
            function() { 
                console.log("stopScan failed");
            }
        );
    } */

    /* $scope.startScan();

    function failure(params) {
        console.log('operation failed', params)
    } */

    /* $scope.connect = function (deviceID) {
        ble.connect(deviceID, onSuccesfullConnection, onFailConnection);
    }

    function onSuccesfullConnection(params) {
        $scope.currentDevice = params;
        console.log('connection successfull', params)
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


     */

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