angular.module('starter').service('NotificationService', function($http, $q, WebService) {
	var pushNotification;
	var returnObj = {};
    
	returnObj.onDeviceReady = function() {
		try 
		{ 
        	pushNotification = window.plugins.pushNotification;
        	if (device.platform == 'android' || device.platform == 'Android' ||
                    device.platform == 'amazon-fireos' ) {
        		pushNotification.register(successHandler, errorHandler, {"senderID":"8400650074","ecb":"onNotification"});
			} else {
            	pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
        	}
        }
		catch(err) 
		{ 
            console.log(err);
			var txt="There was an error on this page.\n\n"; 
			txt+="Error description: " + err.message + "\n\n"; 
		}
    };
    
    window.onNotification = function(e) {
        
    	switch(e.event) {
    		case 'registered':
				if (e.regid.length > 0 ) {
					window.localStorage.setItem("pushId",  e.regid);
					$http.get("res/567.xml").success(function(res) {
						var Nr = window.localStorage.getItem('Nr');
						res = res.replace('{USER_ID}', Nr);
						res = res.replace('{PUSH_ID}', e.regid);
						WebService.ajaxPostRequest(res, 567, null);
					});
				}
				break;
             
             case 'message':
             	if (e.foreground) {
             		navigator.notification.alert(e.payload.message, function(){}, 'CCS Notifications ', 'OK');
             	}else{	
						
             	}
             	console.log('MESSAGE  ' + e.payload.message);
             	console.log('MESSAGE -> MSGCNT:   ' + e.payload.msgcnt);
             	console.log('MESSAGE -> TIMESTAMP:   ' + e.payload.timeStamp);
             	break;
             
             case 'error':
            	console.log('ERROR -> MSG:' + e.msg);
            	break;
             
             default:
				console.log('EVENT -> Unknown, an event was received and we do not know what it is');
             	break;
         }
     };
     
     // handle APNS notifications for iOS
     window.onNotificationAPN = function (e) {
         alert('aa');
         
         if (e.alert) {
              alert(e.alert);
              // showing an alert also requires the org.apache.cordova.dialogs plugin
         }
             
         if (e.sound) {
             // playing a sound also requires the org.apache.cordova.media plugin
         }
         
         if (e.badge) {
             pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
         }
    };
    
    var tokenHandler = function (result) {
                            
        window.localStorage.setItem("pushId",  result);
        $http.get("res/567.xml").success(function(res) {
            var Nr = window.localStorage.getItem('Nr');
            res = res.replace('{USER_ID}', Nr);
            res = res.replace('{PUSH_ID}',  result);
            WebService.ajaxPostRequest(res, 567, null);
        });
                             
        // Your iOS push server needs to know the token before it can push to this device
        // here is where you might want to send it the token for later use.
    };
	
    var successHandler = function(result) {
        
    };
    
    var errorHandler = function (error) {
        console.log('error:'+ error );
    };
    
    return returnObj;
});