angular.module('starter').factory("ArrayServices", function() {
    // ASCII only
    function stringToBytes(string) {
        var array = new Uint8Array(string.length);
        for (var i = 0, l = string.length; i < l; i++) {
            array[i] = string.charCodeAt(i);
        }
        return array.buffer;
    }
    
    // ASCII only
    function bytesToString(buffer) {
        return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }
 


    return {
        stringToBytes: function (string) {
            return stringToBytes(string);
        },
        bytesToString: function (buffer) {
            return bytesToString(buffer);
        }
    };



})
