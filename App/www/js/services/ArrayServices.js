angular.module('starter').factory("ArrayServices", function() {
    // ASCII only
    function stringToBytes(string) {
        var array = new Uint8Array(string.length);
        for (var i = 0, l = string.length; i < l; i++) {
            array[i] = string.charCodeAt(i);
        }
        return array.buffer;
    }
    
    function bytesToString(buffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }

    function bytesToObject(buffer) {
        var a = String.fromCharCode.apply(null, new Uint8Array(buffer));
        console.log('arraybuffer', a);
        alert('notify:', a);
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
