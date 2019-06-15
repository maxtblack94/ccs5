angular.module('starter').factory("AndroidBleConnectionService", function(BluetoothServices, InfoFactories, $rootScope) {
    var currentDevice;
    var lastReservation, lastOperation = [];

    function connectToVehicle(reservation, operation) {
        userInfo = InfoFactories.getUserInfo();
        lastOperation = operation;
        lastReservation = reservation;
        ble.isEnabled(function() {
            console.log('ble is enabled');
            isConnected(reservation);
        },
        function() {
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
            currentDevice = null;
        });
    }

    function mtuSize(){
        ble.requestMtu(currentDevice.id, 512,function() {
            console.log('MTU OK');
            setTimeout(function() {
                BluetoothServices.doNotifyRequest(lastReservation, lastOperation, currentDevice);
            }, 500);
        }, function() {
            mtuSize();
        });
    }

    return {
        connectToVehicle: function (reservation, operation) {
            return connectToVehicle(reservation, operation);
        }
    };

})
