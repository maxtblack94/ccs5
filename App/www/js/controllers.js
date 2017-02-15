var CLIENT = null;
var locale = { };

angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $rootScope, $http, $location, $timeout, $ionicLoading, WebService) {
    $scope.locale = locale;
    $scope.loadingLogin = true;  
        
    $ionicLoading.show();
    $http.get("res/589.xml").success(function(res) {
        //var driver = window.localStorage.getItem('Nr');
        res = res.replace('{LANGUAGE}', 'Italiano');
        
        WebService.ajaxPostRequestDemo(res, 589, function(data) {
            $ionicLoading.hide();
            
            //alert(JSON.stringify(data));
            $scope.loadingLogin = false;   
            $scope.clientList = data.clientListBooking;
            //$scope.parkingList = parkingList;
            //$scope.load();
            $scope.$apply();            
        });
    });
    
    $scope.switch = function() {
        $timeout(function() {
            $rootScope.selectedClient = null;
            CLIENT = null;
            window.localStorage.setItem('selclient', null);
            $scope.$apply();
        }, 500);
    };
    
    $scope.selectClient = function(index, c) {
        
        $timeout(function() {
            $rootScope.selectedClient = c;
            CLIENT = $rootScope.selectedClient.value.toLowerCase();
            window.localStorage.setItem('selclient', JSON.stringify(c));
            $scope.$apply();
        }, 500);
        
        $('#login-user').val('');
        $('#login-password').val('');
    };
    
    $scope.login = function() {
        $ionicLoading.show();
        //$location.path('/tab/bookings');
        
        var user = document.querySelector('#login-user').value;
        var password = document.querySelector('#login-password').value;
        
        if(!user) {
            setTimeout(function() {
                $('#login-user').focus();
            }, 10);
            return;
        }
        
        if(!password) {
            setTimeout(function() {
                $('#login-password').focus();
            }, 10);
            return;
        }
        
        $scope.loadingLogin = true;        
        WebService.ccsLogin(user, password, function() {  
            $http.get('res/567.xml').success(function(res) {  
                $ionicLoading.hide();
        
                var Nr = window.localStorage.getItem('Nr');
                var pushId = window.localStorage.getItem('pushId');
                res = res.replace('{USER_ID}', Nr);
                res = res.replace('{PUSH_ID}', pushId);
                WebService.ajaxPostRequest(res, 567, null);
                        
                $location.path('/tab/bookings').replace();
                
                if($rootScope.loadBookings)
                    $rootScope.loadBookings();
				                    
                $timeout(function() {
                    $scope.loadingLogin = false;
                    $scope.$apply();
                }, 500);
            });
        },
        function() {
            $ionicLoading.hide();
            $scope.loadingLogin = false;
            $scope.$apply();
        });
    };
    
    var c = eval('('+window.localStorage.getItem('selclient')+')');  
    if(c) {
        $rootScope.selectedClient = c; 
        CLIENT = $rootScope.selectedClient.value.toLowerCase();
    }
    
    var userId = window.localStorage.getItem('Nr');
    if (userId != null && userId != '') {
        $ionicLoading.hide();
        $location.path('/tab/bookings').replace();
        
        $timeout(function() {
            $scope.loadingLogin = false;
            $scope.$apply();
        }, 500);
        return;
    }
})

.controller('BookingsCtrl', function($scope, $rootScope, $http, $location, $ionicPopup, $ionicLoading, WebService) {
    $scope.locale = locale;
    $scope.BookingsList = new Array();
    
    var favo = window.localStorage.getItem('favoriteParking') ? eval('('+window.localStorage.getItem('favoriteParking')+')') : null;
    if(favo)
        $rootScope.selectedParking = favo;
  
	$rootScope.loadBookings = function() {
        $scope.loading = true;
        $ionicLoading.show();
		//uf.setTemplateWindow();
		
		$http.get("res/516.xml").success(function(res) {
			//refreshLoading.start();
			var driver = window.localStorage.getItem('Nr');
			res = res.replace('{DRIVER_NUMBER}', driver);
            
			WebService.ajaxPostRequestTemp(res, 516, function(data) {
                $scope.loading = false;
                $ionicLoading.hide();
				$scope.BookingsList = data.data.BookingsList;
				//alert(JSON.stringify($scope.BookingsList[0]));
				
				var blength = $scope.BookingsList.length;
				for(var i = 0; i < blength; i++) {
					//var dpick = new Date($scope.BookingsList[i].pickup_date.replace(/-/g, "/"));
					//var tpick = new Date($scope.BookingsList[i].pickup_time.replace(/-/g, "/"));
					var dpick = $scope.BookingsList[i].pickup_date;
					var tpick = $scope.BookingsList[i].pickup_time.split(' ')[1];
                    var a1 = tpick.split(':')[0] + ':' + tpick.split(':')[1];
                    
					$scope.BookingsList[i].pickupFormatedDate = dpick + ' ' + a1;

					//var dret = new Date($scope.BookingsList[i].return_date.replace(/-/g, "/"));
					//var tret = new Date($scope.BookingsList[i].return_time.replace(/-/g, "/"));
					var dret = $scope.BookingsList[i].return_date;
					var tret = $scope.BookingsList[i].return_time.split(' ')[1];
                    var b1 = tpick.split(':')[0] + ':' + tpick.split(':')[1];
                    
					$scope.BookingsList[i].returnFormatedDate = dret + ' ' + b1;

					switch($scope.BookingsList[i].cmb_fuel_quantity) {
						default: 
							break;
						case '0/4': 
							$scope.BookingsList[i].cmb_fuel_quantity = '0%';
						case '1/4': 
							$scope.BookingsList[i].cmb_fuel_quantity = '25%';
							break;
						case '2/4': 
							$scope.BookingsList[i].cmb_fuel_quantity = '50%';
							break;
						case '3/4': 
							$scope.BookingsList[i].cmb_fuel_quantity = '75%';
							break;
						case '4/4': 
							$scope.BookingsList[i].cmb_fuel_quantity = '100%';
							break;
					}
				}
				
			});
		});
	};
	
    if(!$scope.loading){
	   $rootScope.loadBookings();
    }
    $scope.newBooking = function() {
        $location.path('/tab/parking').replace();
    };

    $scope.openCarManipolation = function(reservation, opT){
        $ionicLoading.show();
        $http.get("res/621.xml").success(function(res) {
	    	res = res.replace('{PNR_NUMBER}', reservation).replace('{OPERATION_TYPE}', opT);
    		$http({
    			url: 'http://'+CLIENT+'.corporatecarsharing.biz/api.svc/ScriptParameterSets',
		        method: "POST",
		        data: res,
		        headers: {
                    'TenForce-Auth' : 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4', 
                    'Content-Type' : 'application/atom+xml'
                }
	    	}).success(function (data, status, headers, config) {
	    		var responsePromisee = $http.get("http://"+CLIENT+".corporatecarsharing.biz/api.svc/ExecuteAdminScript?scriptId=621&scriptParameterSetId=" + data.d.Id, {headers: {'TenForce-Auth': 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4'}});
	    		
                responsePromisee.success(function(data, status, headers, config) {
                    console.log(data)
                    $ionicLoading.hide();
	    		});
	        }).error(function(err) {
                //gestire ERRORe
                $ionicLoading.hide();
            });
    	})
    }
    
    $scope.openBooking = function(object) {
		//return;
        $rootScope.selectedBooking = object;
        $location.path('/tab/map');
        return;
    };
	
    $scope.delete = function(book) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Conferma eliminazione',
            template: 'Sicuro di vole eliminare la prenotazione selezionata?'
        });
        
        confirmPopup.then(function(res) {
            if(res) {
                if(!book)
                    return;
                
                $ionicLoading.show();
                $http.get("res/553.xml").success(function(res) {
                    res = res.replace('{BOOKING_NUMBER}', book.Nr);
                    WebService.ajaxPostRequest(res, 553, function(data) {
                        $rootScope.loadBookings();
                    });
                });
            } 
        });
    };
    
})

.controller('NewbookingsCtrl', function($scope, $rootScope, $http, $location, $ionicLoading, $cordovaDatePicker, WebService) {
    $scope.locale = locale;
    
    $scope.selectFromDate = function() {
        $rootScope.dateFromPick = {
            date: $rootScope.dateFromPick ? ($rootScope.dateFromPick.inputDate ? $rootScope.dateFromPick.inputDate : new Date()) : new Date(),
            mode: 'date',
            allowOldDates: false,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        $cordovaDatePicker.show($rootScope.dateFromPick).then(function(date) {
            console.log(date);
            
            if(!date) {
                $rootScope.dateValidated = false;
                return;
            }
            
            $rootScope.dateFromPick.inputDate = date;
            $scope.checkDatetime();
        });
    };
    
    $scope.selectFromTime = function() {
        var sameday = false;
        if($rootScope.dateFromPick.inputDate) {
            if($rootScope.dateFromPick.inputDate.getDate() == new Date().getDate() 
                && $rootScope.dateFromPick.inputDate.getMonth() == new Date().getMonth()
                && $rootScope.dateFromPick.inputDate.getFullYear() == new Date().getFullYear())
                sameday = true;
        }
        
        $rootScope.timeFromPick = {
            date: $rootScope.timeFromPick ? ($rootScope.timeFromPick.inputTime ? $rootScope.timeFromPick.inputTime : new Date()) : new Date(),
            mode: 'time',
            is24Hour: true,
            allowOldDates: true,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        if(sameday)
            $rootScope.timeFromPick.minDate = new Date() - 10000;
        
        $cordovaDatePicker.show($rootScope.timeFromPick).then(function(time) {
            console.log(time);
            
            if(!time) {
                $rootScope.dateValidated = false;
                return;
            }
            
            var d = new Date(time);
            var m = new Date(time);
            if(d.getMinutes() >= 0 && d.getMinutes() <= 7)
                m.setMinutes(0);
            else if(d.getMinutes() >= 7 && d.getMinutes() <= 22)
                m.setMinutes(15);
            else if(d.getMinutes() >= 22 && d.getMinutes() <= 37)
                m.setMinutes(30);
            else if(d.getMinutes() >= 37 && d.getMinutes() <= 59)
                m.setMinutes(45);
            
            $rootScope.timeFromPick.inputTime = m;
            $scope.checkDatetime();
        });
    };
    
    $scope.selectToDate = function() {
        var todate = new Date();
        
        if($rootScope.dateFromPick) {
            if($rootScope.dateFromPick.inputDate) {
                todate = new Date($rootScope.dateFromPick.inputDate);
            }
            else {
                if($rootScope.dateToPick)
                    if($rootScope.dateToPick.inputDate) {
                        todate = new Date($rootScope.dateToPick.inputDate);
                    }
                    else if($rootScope.dateToPick.inputDate) {
                        todate = new Date();
                    }
            }
        }
        else {
            if($rootScope.dateToPick)
                if($rootScope.dateToPick.inputDate) {
                    todate = new Date($rootScope.dateToPick.inputDate);
                }
                else if($rootScope.dateToPick.inputDate) {
                    todate = new Date();
                }
        }
            
        $rootScope.dateToPick = {
            date: todate,
            mode: 'date',
            //minDate: new Date() - 10000,
            allowOldDates: false,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        console.log($rootScope.dateToPick);
        
        $cordovaDatePicker.show($rootScope.dateToPick).then(function(date) {
            console.log(date);
            
            if(!date) {
                $rootScope.dateValidated = false;
                return;
            }
            
            $rootScope.dateToPick.inputDate = date;
            $scope.checkDatetime();
        });
    };
    
    $scope.selectToTime = function() {
        var sameday = false;
        if($rootScope.dateToPick.inputDate) {
            if($rootScope.dateToPick.inputDate.getDate() == new Date().getDate() 
                && $rootScope.dateToPick.inputDate.getMonth() == new Date().getMonth()
                && $rootScope.dateToPick.inputDate.getFullYear() == new Date().getFullYear())
                sameday = true;
        }
        
        $rootScope.timeToPick = {
            date: $rootScope.timeToPick ? ($rootScope.timeToPick.inputTime ? $rootScope.timeToPick.inputTime : new Date()) : new Date(),
            mode: 'time',
            is24Hour: true,
            allowOldDates: true,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
        };
        
        if(sameday)
            $rootScope.timeToPick.minDate = new Date() - 10000;
        
        $cordovaDatePicker.show($rootScope.timeToPick).then(function(time) {
            console.log(time);
            
            if(!time) {
                $rootScope.dateValidated = false;
                return;
            }
            
            var d = new Date(time);
            var m = new Date(time);
            if(d.getMinutes() >= 0 && d.getMinutes() <= 7)
                m.setMinutes(0);
            else if(d.getMinutes() >= 7 && d.getMinutes() <= 22)
                m.setMinutes(15);
            else if(d.getMinutes() >= 22 && d.getMinutes() <= 37)
                m.setMinutes(30);
            else if(d.getMinutes() >= 37 && d.getMinutes() <= 59)
                m.setMinutes(45);
            
            $rootScope.timeToPick.inputTime = m;
            $scope.checkDatetime();
        });
    };
    
    $scope.checkDatetime = function() {
        
        if(!$rootScope.dateFromPick 
            || !$rootScope.dateToPick 
            || !$rootScope.timeFromPick 
            || !$rootScope.timeToPick) {
                
            $rootScope.dateValidated = false;
            return;
        }
        
        var df = $rootScope.dateFromPick.inputDate;
        var dt = $rootScope.dateToPick.inputDate;
        var hf = $rootScope.timeFromPick.inputTime;
        var ht = $rootScope.timeToPick.inputTime;
        
        if(!df || !dt || !hf || !ht) {
            $rootScope.dateValidated = false;
            return;
        }
            
        var hhf = new Date(hf);
        var hht = new Date(ht);
            
        var ddf = new Date(df);
        ddf.setHours(hhf.getHours());
        ddf.setMinutes(hhf.getMinutes());
            
        var ddt = new Date(dt);
        ddt.setHours(hht.getHours());
        ddt.setMinutes(hht.getMinutes());
                
        var mdf = moment(ddf);
        var mdt = moment(ddt);
        
        if(!ddf || !ddt || !hhf || !hht) {
            $rootScope.dateValidated = false;
            return;
        }
        
        var sameday = false;
        if(dt.getDate() == new Date().getDate() 
            && dt.getMonth() == new Date().getMonth()
            && dt.getFullYear() == new Date().getFullYear())
            sameday = true;
        
        if(sameday) {
            if(ddf.getHours() < new Date().getHours()) {
                $rootScope.dateValidated = false;
                return;
            }
            if(ddf.getHours() == new Date().getHours()) {
                if(ddf.getMinutes() < new Date().getMinutes()) {
                    $rootScope.dateValidated = false;
                    return;
                }
            }
            if(ddf.getHours() == ddt.getHours()) {
                if(ddf.getMinutes() == ddt.getMinutes()) {
                    $rootScope.dateValidated = false;
                    return;
                }
            }
        }
        
        if(mdt.diff(mdf) < 0)
            $rootScope.dateValidated = false;
        else
            $rootScope.dateValidated = true;
    };
    
    $scope.gotoParking = function() {
        $scope.checkDatetime();
            
        if($rootScope.selectedParking) {
            $location.path('/tab/resume').replace();
            return;
        }
            
        if(!$rootScope.dateValidated)
            return false;
            
        $location.path('/tab/parking').replace();
    };
})

.controller('ParkingCtrl', function($scope, $rootScope, $http, $location, $ionicLoading, WebService) {
    $scope.locale = locale;
  
    $rootScope.loadParking = function() {
        $ionicLoading.show();
		$http.get("res/512.xml").success(function(res) {
			var driver = window.localStorage.getItem('Nr');
			res = res.replace('{DRIVER_NUMBER}', driver);
			
			WebService.ajaxPostRequest(res, 512, function(data) {
                $ionicLoading.hide();
                
                if(data.data.ParkingsList)
	               $rootScope.parkingList = data.data.ParkingsList;
                else
                    $rootScope.parkingList = new Array();
                
                var favo = window.localStorage.getItem('favoriteParking') ? eval('('+window.localStorage.getItem('favoriteParking')+')') : null;
                if(favo)
                    for(var i = 0; i < $rootScope.parkingList.length; i++)
                        if($rootScope.parkingList[i].Nr == favo.Nr) {
                            $rootScope.parkingList[i].selected = true;
                            $rootScope.selectedParking = $rootScope.parkingList[i];
                        }
             
	            $scope.$apply();
			});
		});
    };
    
    $scope.stopPropagation = function(e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
    };
    
    $scope.toggleFavorite = function(parking) {
        var b = parking.selected;
        
        for(var i = 0; i < $rootScope.parkingList.length; i++)
            $rootScope.parkingList[i].selected = false;
                
        if(!b) {
            parking.selected = true;
            window.localStorage.setItem('favoriteParking', JSON.stringify(parking));
        }
        else {
            parking.selected = false;
    	    window.localStorage.removeItem('favoriteParking');
        }
    };
    
    $scope.selectParking = function(parking) {
        $rootScope.selectedParking = parking;
        //$location.path('/tab/resume').replace();
        $location.path('/tab/newbooking').replace();
    };
    
    $rootScope.loadParking();
})

.controller('ResumeCtrl', function($scope, $rootScope, $location, $ionicLoading, $timeout, WebService) {
    $scope.locale = locale;
    $rootScope.cannotReserve = false;
	
	WebService.ajaxPostRequestDirect(610, function(data) {
        $scope.listDriverRange = data.ListDriverRange;
        $scope.$apply();
    });
	
	$rootScope.selectedDriverRange = { value: 'short' };
  
    $scope.setHasCC = function() {
        $rootScope.hasCC = !$rootScope.hasCC;
        //window.localStorage.setItem('hasCC', $rootScope.hasCC);
    };
  
    $scope.setHasTelepass = function() {
        $rootScope.hasTelepass = !$rootScope.hasTelepass;
        //window.localStorage.setItem('hasTelepass', $rootScope.hasTelepass);
    };
    
    $scope.changeDate = function() {
        $location.path('/tab/newbooking').replace();
    };
    
    $scope.changeParking = function() {
        $location.path('/tab/parking').replace();
    };
    
    $scope.searchVehicle = function() {
        $location.path('/tab/selcar').replace();
        
        $timeout(function() {
            $rootScope.loadVehicles();
        }, 300);
    };
})

.controller('CarCtrl', function($scope, $http, $rootScope, $location, $timeout, $ionicModal, $ionicLoading, $ionicPopup, WebService) {
    $scope.locale = locale;
    
    WebService.ajaxPostRequestDirect(588, function(data) {
        $scope.justifyList = data.ListJustification;
        $scope.justifyList[0].selected = true;
		if($rootScope.selectedClient.justifiedUse)
			$scope.selectedJustify = $scope.justifyList[0]; 
        $scope.$apply();
    });
  
    $ionicModal.fromTemplateUrl('templates/pop-confirm.html', {
        scope: $scope,
        animation: 'slide-in-up'
    })
    .then(function(modal) {
        $rootScope.popConfirm = modal;
    });
    
    $scope.closeModal = function() {
        $rootScope.popConfirm.hide();
    };
    
    $scope.onSelect = function(car) {
        $rootScope.selectedCar = car;
        $rootScope.popConfirm.show();
    };
    
    $scope.selectJustify = function(index, justify) {
        for(var i = 0; i < $scope.justifyList.length; i++)
            $scope.justifyList[i].selected = false;
        
        $scope.justifyList[index].selected = true;
        $scope.selectedJustify = justify;
    };
    
    $scope.confirm = function() {        
        var place = $('.place_val').val();
        var drivename = $('.driverName_val').val();
        var justifyCode = $scope.selectedJustify ? $scope.selectedJustify.code : null;
        var cc = $rootScope.hasCC;
		var telepass = $rootScope.hasTelepass;
        
        if(!$rootScope.selectedClient.cc)
            cc = false;
        
        if(!$rootScope.selectedClient.telepass)
            telepass = false;
            
        if(!place) {
            $ionicPopup.alert({
                title: $scope.locale.confirmation.labelIncomplete,
                template: $scope.locale.confirmation.labelSelectPlace
            });
            return;
        }
        
        if($rootScope.selectedClient.driveName && !drivename) {
            $ionicPopup.alert({
                title: $scope.locale.confirmation.labelIncomplete,
                template: $scope.locale.confirmation.labelSelectDriveName
            });
			return;
		}
            
        $ionicLoading.show();
        $http.get('res/514.xml').success(function(res) {
			var driver = window.localStorage.getItem('Nr');
            
            res = res.replace('{NUMBER_VEHICLE}', $rootScope.selectedCar.Nr)
                        .replace('{NUMBER_DRIVER}', driver)
                        .replace('{DATE_FROM}', moment($rootScope.dateFromPick.inputDate).format('L'))
                        .replace('{DATE_TO}', moment($rootScope.dateToPick.inputDate).format('L'))
                        .replace('{TIME_FROM}', moment($rootScope.timeFromPick.inputTime).format('HH:mm'))
                        .replace('{TIME_TO}', moment($rootScope.timeToPick.inputTime).format('HH:mm'))
                        .replace('{PLACE}', place)
                        .replace('{JUSTIFICATION}', justifyCode)
                        .replace('{CC}', cc)
                        .replace('{TELEPASS}', telepass)
                        .replace('{DRIVE_NAME}', drivename);
            console.log(res);
            
            WebService.ajaxPostRequest(res, 514, function(data) {
                $ionicLoading.hide();
                
                $scope.PNRstring = data.data.PNRstring[0].PNR;
                $scope.isConfirmed = true;
                
                var pnrPopup = $ionicPopup.alert({
                    title: $scope.locale.confirmation.labelRequestComplete,
                    template: $scope.locale.home.rsvinfo.labPRN + ': <b>' + $scope.PNRstring + '</b>'
                });
                
                $scope.closeModal();
                pnrPopup.then(function(res) {
                    $rootScope.loadBookings();
                    $location.path('/tab/bookings');
                });

                $scope.$apply();
            });
        });
    };
    
    $scope.vehicleList = new Array()
    $rootScope.loadVehicles = function() {
        $scope.loading = true;
        
        var cc = $rootScope.hasCC;
		var telepass = $rootScope.hasTelepass;
        
        if(!$rootScope.selectedClient.cc)
            cc = false;
        
        if(!$rootScope.selectedClient.telepass)
            telepass = false;
	
        $rootScope.cannotReserve = false;
        $ionicLoading.show();
        
		$http.get("res/571.xml").success(function(res) {                                       
			res = res.replace('{NUMBER_PARKING}', $rootScope.selectedParking.Nr)
					 .replace('{NUMBER_DRIVER}', window.localStorage.getItem('Nr'))
					 .replace('{DATE_FROM}', moment($rootScope.dateFromPick.inputDate).format('L'))
					 .replace('{DATE_TO}', moment($rootScope.dateToPick.inputDate).format('L'))
					 .replace('{TIME_FROM}', moment($rootScope.timeFromPick.inputTime).format('HH:mm'))
					 .replace('{TIME_TO}', moment($rootScope.timeToPick.inputTime).format('HH:mm'))
					 .replace('{CC}', cc)
					 .replace('{TELEPASS}', telepass)
					 .replace('{DRIVING_RANGE}', $rootScope.selectedDriverRange.value);

            WebService.ajaxPostRequest(res, 571, function(data) {
                $scope.loading = false;
                $ionicLoading.hide();
                                       
                if(data.retcode == 1) {
                    $rootScope.cannotReserve = true; 
                    $location.path('/tab/resume').replace();
                }
                                       
				$scope.vehicleList = data.data.VehiclesList;
				
				for(var i = 0; i < $scope.vehicleList.length; i++) {
					switch($scope.vehicleList[i].fuel_quantity) {
						default: 
							break;
						case '0/4': 
							$scope.vehicleList[i].fuel_quantity = '0%';
						case '1/4': 
							$scope.vehicleList[i].fuel_quantity = '25%';
							break;
						case '2/4': 
							$scope.vehicleList[i].fuel_quantity = '50%';
							break;
						case '3/4': 
							$scope.vehicleList[i].fuel_quantity = '75%';
							break;
						case '4/4': 
							$scope.vehicleList[i].fuel_quantity = '100%';
							break;
					}
				}
					
	            $scope.$apply();
	            //uf.setTemplateVehicle();
	            $scope.isLoading = false;
                                       
				if($scope.vehicleList.length == 0 && data.retcode != 1) {
				    //document.querySelector('.label-no-vehicles').style.display = 'block';
                }
                                       
				//setTimeout(function() { 
                //    refreshLoading.end(); 
                //}, 200);
			});
		});
    };
})

.controller('AccountCtrl', function($rootScope, $scope, $http, $location, $ionicLoading, WebService) {
    $scope.locale = locale;
    
    $scope.setHasPicture = function() {
        $rootScope.hasPicture = !$rootScope.hasPicture;
        window.localStorage.setItem('hasPicture', $rootScope.hasPicture);
    };
    
    $scope.logout = function() {
    	var nr = window.localStorage.getItem('Nr');
    	window.localStorage.removeItem('Nr');
        $('#login-password').val('');
        
        $ionicLoading.show();
        $http.get("res/569.xml").success(function(res) {
            $ionicLoading.hide();
        
    		res = res.replace('{USER_ID}', nr);
    		WebService.ajaxPostRequest(res, 569, null);
        
            $rootScope.selectedParking = null;
            $rootScope.parkingList = new Array();
            //$rootScope.loadParking();
            $rootScope.selectedCar = null;
    	    window.localStorage.removeItem('favoriteParking');
            
            $scope.$apply();
            $location.path('/login');
    	});
    };
})

.controller('MapCtrl', function($rootScope, $scope, $http, $location, $ionicLoading, $cordovaGeolocation, $ionicPopup, WebService) {
    $scope.locale = locale;
    $scope.loadingMap = true;
    var map;
    var mylat;
    var mylong;
    var carlat = 41.8156957;
    var carlong = 12.483382;
    
    console.log($rootScope.selectedBooking);
    
    if(!$rootScope.selectedBooking) {
        $location.path('/bookings');
        return;
    }
    
    if(!$cordovaGeolocation) {
        $ionicLoading.hide();
        return;
    }
    
    $scope.navigate = function() {
        
        if(device.platform == 'ios') {
            window.open('maps://?q=' + $scope.g_address, '_system');
        } 
        else {
            var label = encodeURI(g_address);
            window.open('geo:0,0?q=' + $scope.g_address + '(' + g_address + ')', '_system');
        }
    };
    
    $cordovaGeolocation.getCurrentPosition()
    .then(function(position) {
        console.log(position);
        
        mylat = position.coords.latitude;
        mylong = position.coords.longitude;
        
        if(!google) {
            $scope.loadingMap = false;
            $scope.$apply();
            return;
        }
        
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: mylat, lng: mylong },
            zoom: 18,
            mapTypeControl: false
        });
        
        codeLatLng(mylat, mylong, function(addr) {
            $scope.loadingMap = false;
            $scope.g_address = addr.formatted_address;
            $scope.$apply();
        });
        
        var mymarker = new google.maps.Marker({
            position: {
                lat: mylat,
                lng: mylong
            },
            map: map,
            title: 'Hello World!'
        });
        
    }, function(error) {
        console.log('error:', error);
    });
    
    $scope.delete = function(book) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Conferma eliminazione',
            template: 'Sicuro di vole eliminare la prenotazione selezionata?'
        });
        
        confirmPopup.then(function(res) {
            if(res) {
                if(!book)
                    return;
                
                $ionicLoading.show();
                $http.get("res/553.xml").success(function(res) {
                    res = res.replace('{BOOKING_NUMBER}', book.Nr);
                    WebService.ajaxPostRequest(res, 553, function(data) {
                        $rootScope.loadBookings();
                    });
                });
            } 
        });
    };
    
    $scope.centerCarMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: carlat, lng: carlong },
            zoom: 18,
            mapTypeControl: false
        });
        
        var carmarker = new google.maps.Marker({
            position: {
                lat: carlat,
                lng: carlong
            },
            map: map,
            title: 'Hello World!'
        });
    };
    
    $scope.centerMYPosition = function() {
        
    };
})

.service('WebService', function($http, $q) {
    return ({
        ccsLogin: ccsLogin,
        ajaxPostRequest: ajaxPostRequest,
        ajaxPostRequestDemo: ajaxPostRequestDemo,
        ajaxPostRequestTemp: ajaxPostRequestTemp,
        ajaxPostRequestDirect: ajaxPostRequestDirect
    });
    
    function ccsLogin(name, password, success, fail) {
        $http.get("res/515.xml").success(function(res) {
	    	res = res.replace('{USER_NAME}', name).replace('{PASSWORD}', password);
    		$http({
    			url: 'http://'+CLIENT+'.corporatecarsharing.biz/api.svc/ScriptParameterSets',
		        method: "POST",
		        data: res,
		        headers: {
                    'TenForce-Auth' : 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4', 
                    'Content-Type' : 'application/atom+xml'
                }
	    	}).success(function (data, status, headers, config) {
	    		var responsePromisee = $http.get("http://"+CLIENT+".corporatecarsharing.biz/api.svc/ExecuteAdminScript?scriptId=515&scriptParameterSetId=" + data.d.Id, {headers: {'TenForce-Auth': 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4'}});
	    		
                responsePromisee.success(function(data, status, headers, config) {
                    console.log(data.d.ExecuteAdminScript);
	    			var ResultValue = JSON.parse(data.d.ExecuteAdminScript.ResultValue);
	    			var DriverList = ResultValue.data.DriverList;
	    			if(DriverList.length > 0) {
	    				window.localStorage.setItem('Nr', DriverList[0].Nr);
	    				window.localStorage.setItem('user_name', name);
                        if(success)
                            success();
	    			}
                    else
                        fail();
	    		});
	        }).error(function(err) {
                console.log(err);
                fail();
            });
    	})
    }
    
    function ajaxPostRequestDirect(scriptId, callback) {
        var responsePromisee = $http.get("http://"+CLIENT+".corporatecarsharing.biz/api.svc/ExecuteAdminScript?scriptId="+scriptId+"&scriptParameterSetId=0", {headers: {'TenForce-Auth': 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4'}});
        responsePromisee.success(function(data, status, headers, config) {
            var ResultValue;
        
            if(scriptId != 553) {
                ResultValue = JSON.parse(data.d.ExecuteAdminScript.ResultValue);
                if(callback)
                    callback(ResultValue);
            }
            else
                callback();
        });
    }
    
    function ajaxPostRequestDemo(res, scriptId, callback) {
    		$http({
    			url: 'http://demo.corporatecarsharing.biz/api.svc/ScriptParameterSets',
		        method: "POST",
		        data: res,
		        headers: {
		        	'TenForce-Auth' : 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4', 'Content-Type' : 'application/atom+xml'
		        }
	    	})
	    	.success(function (data, status, headers, config) {
	    		var responsePromisee = $http.get("http://demo.corporatecarsharing.biz/api.svc/ExecuteAdminScript?scriptId="+scriptId+"&scriptParameterSetId=" + data.d.Id, {headers: {'TenForce-Auth': 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4'}});
	    		responsePromisee.success(function(data, status, headers, config) {
	    			var ResultValue;
	    		
	    			if(scriptId != 553) {
	    				ResultValue = JSON.parse(data.d.ExecuteAdminScript.ResultValue);
                        if(callback)
                            callback(ResultValue);
	    			}
	    			else
	    				callback();
	    		});
	        });
    }
    
    function ajaxPostRequest(res, scriptId, callback) {
    		$http({
    			url: 'http://'+CLIENT+'.corporatecarsharing.biz/api.svc/ScriptParameterSets',
		        method: "POST",
		        data: res,
		        headers: {
		        	'TenForce-Auth' : 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4', 'Content-Type' : 'application/atom+xml'
		        }
	    	})
	    	.success(function (data, status, headers, config) {
	    		var responsePromisee = $http.get("http://"+CLIENT+".corporatecarsharing.biz/api.svc/ExecuteAdminScript?scriptId="+scriptId+"&scriptParameterSetId=" + data.d.Id, {headers: {'TenForce-Auth': 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4'}});
	    		responsePromisee.success(function(data, status, headers, config) {
	    			var ResultValue;
                    console.log(data);
	    		
	    			if(scriptId != 553) {
	    				ResultValue = JSON.parse(data.d.ExecuteAdminScript.ResultValue);
                        if(callback)
                            callback(ResultValue);
	    			}
	    			else
	    				callback();
	    		});
	        });
    }
    
    function ajaxPostRequestTemp(res, scriptId, callback) {
    		$http({
    			url: 'http://'+CLIENT+'.corporatecarsharing.biz/api.svc/ScriptParameterSets',
		        method: 'POST',
		        data: res,
		        headers: { 'TenForce-Auth' : 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4', 'Content-Type' : 'application/atom+xml' }
    		
	    	}).success(function (data, status, headers, config) {
	    		var responsePromisee = $http.get("http://"+CLIENT+".corporatecarsharing.biz/api.svc/ExecuteAdminScript?scriptId="+scriptId+"&scriptParameterSetId=" + data.d.Id, {headers: {'TenForce-Auth': 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4'}});
	    		
	    		responsePromisee.success(function(data, status, headers, config) {
	    			var ResultValue = JSON.parse(data.d.ExecuteAdminScript.ResultValue.replace('}, ] }' ,'} ] }'));
	    			if(ResultValue) {
	    				if(callback)
                            callback(ResultValue);
	    			}
	    		});
	        });
    }

    function handleError(response) {
        if (
        !angular.isObject(response.data) || 
        !response.data.message
        ) {
            return ($q.reject("An unknown error occurred."));
        }
        return ($q.reject(response.data.message));
    }
    
    function handleSuccess(response) {
        quizeController.dataLoaded = true;
        return (response.data);
    }
})

.service('NotificationService', function($http, $q, WebService) {
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

function codeLatLng(lat, lng, complete) {
  var geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(lat, lng);
  
  geocoder.geocode({
    'latLng': latlng
  }, 
  function (results, status) {
      console.log(results);
      
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        console.log(results);
        if(complete)
            complete(results[0]);
      } 
      else {
        console.log('No results found');
      }
    } else {
      console.log('Geocoder failed due to: ' + status);
    }
  });
}