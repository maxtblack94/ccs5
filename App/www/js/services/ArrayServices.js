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
        if (/^[\],:{}\s]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                a = JSON.parse(a);

            }
        
        console.log(a);
        return a;
    }

    function toHexString(byteArray) {
        return Array.from(byteArray, function(byte) {
          return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('')
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

    function arrayBufferToHex (arrayBuffer) {
        if (typeof arrayBuffer !== 'object' || arrayBuffer === null || typeof arrayBuffer.byteLength !== 'number') {
          throw new TypeError('Expected input to be an ArrayBuffer')
        }
      
        var view = new Uint8Array(arrayBuffer)
        var result = ''
        var value
      
        for (var i = 0; i < view.length; i++) {
          value = view[i].toString(16)
          result += (value.length === 1 ? '0' + value : value)
        }
      
        return result
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
        },
        arrayBufferToHex: function (buffer) {
            return arrayBufferToHex(buffer);
        }
    };



})
