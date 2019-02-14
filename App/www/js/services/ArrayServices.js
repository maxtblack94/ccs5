angular.module('starter').factory("ArrayServices", function(PopUpServices) {
    // ASCII only
    function stringToBytes(string) {
        var array = new Uint8Array(string.length);
        for (var i = 0, l = string.length; i < l; i++) {
            array[i] = string.charCodeAt(i);
        }
        return array.buffer;
    }
    
    function bytesToString(buffer) {
        var a = String.fromCharCode.apply(null, new Uint8Array(buffer));
        a = JSON.parse(a);
        console.log(a);
        return a;
    }

    function bytesToObject(buffer) {
        var a = String.fromCharCode.apply(null, new Uint8Array(buffer));
        console.log('arraybuffer', a);
        PopUpServices.messagePopup(a, 'Notify');
        var MT = a.match(/MT":([^;]+),/i);
        if (MT && MT[1]) {
            MT = a.match(/MT":([^;]+),/i)[1];
        }
        var obj = {
            MT: MT || null
        };
        return obj;
    }
 


    return {
        stringToBytes: function (string) {
            return stringToBytes(string);
        },
        bytesToString: function (buffer) {
            return bytesToString(buffer);
        },
        bytesToObject: function (buffer) {
            return bytesToObject(buffer);
        }
    };



})
