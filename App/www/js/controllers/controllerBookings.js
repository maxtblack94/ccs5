angular.module('starter').controller('BookingsCtrl', function (AndroidBleConnectionService, IosBleConnectionService, $ionicSideMenuDelegate, ReservationService, $filter, LocationService, $cordovaDevice, ManipolationServices, PopUpServices, $cordovaGeolocation, $timeout, $cordovaDatePicker, $scope, $rootScope, InfoFactories, $state, $ionicPopup, $ionicLoading, ScriptServices, UpdateBBService) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.userInfo = InfoFactories.getUserInfo();
    refreshUserInfo();

    var favo = window.localStorage.getItem('favoriteParking') ? eval('(' + window.localStorage.getItem('favoriteParking') + ')') : null;
    if (favo) {
        InfoFactories.setPark(favo);
    }
    $scope.refreshBookings = function () {
        $scope.loadbookings();
        getUserInfo();
        $scope.$broadcast('scroll.refreshComplete');
    }

    function getUserInfo(){
        ScriptServices.getXMLResource(554).then(function(res) {
            res = res.replace('{NUMBER_DRIVER}', InfoFactories.getUserInfo().driverNumber);
            ScriptServices.callGenericService(res, 554).then(function(data) {
                var userInfo = InfoFactories.getUserInfo();
                userInfo.registry =  data.data.GetUser[0];
                /** WORK AROUND */
                /* userInfo.registry.services.push({
                    "id": 72198,
                    "name": "Pooling",
                    "parkingType": "A to B Pooling",
                    "parkingTypeCode": "PF3",
                    "icon": "",
                    "tarifs": []
                  }); */


                /** fine WA */
                window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
                $ionicLoading.hide(); 
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            })
        });
    }

    getUserInfo();

    if ($scope.selectedClient.map && !window.serverRootLocal) {
        setTimeout(function() {
            var location = LocationService.requestLocationAuthorization();
            if (location) {
                doWatchLocation();
            }
        }, 2000);
    }
    
    $scope.startBooking = function (params) {
        var isNotRegistered = window.localStorage.getItem("isNotRegistered");
        if (isNotRegistered && isNotRegistered == 'true') {
            $state.go('completeRegistration');
        } else if($scope.userInfo.registry.account_status === 'SUBSCRIBED_WITH_PAY') {
            PopUpServices.messagePopup("Il tuo profilo è in fase di verifica. Verrai contattato per mail quando il tuo profilo sarà abilitato al servizio E-Vai.", "Profilo in attesa di abilitazione");
        } else if($scope.userInfo.registry.account_status === 'SUBSCRIBED') {
            PopUpServices.messagePopup("Il tuo profilo è in fase di verifica. Procedi all'attivazione della modalità di pagamento", "Profilo in attesa di abilitazione", $scope.paymentModal);
        } else {
            ReservationService.resetReservation();
            $state.go('subscriptions');
        }
    };

    $scope.paymentModal = function (params) {
        var modalContent = `<div class="bt-content" style="padding: 20px; z-index: 9999; color: rgb(0, 0, 0);">Gentile Cliente, per tua tutela, ti verra’ chiesto di autorizzare un blocco platfond di 0,02 euro (che verranno riaccreditati) al fine di verificare la validita’ dei dati inseriti.<br><br><br>Per portare a termine la procedura di iscrizione, come previsto dall’istituto bancario Banca Intesa, e’ quindi necessario digitare il pulsante "paga".<br><br><br>Per info e supporto contattaci al n.verde 800.77.44.55</div>
                <ion-item class="item-image">
                    <img src="icons/cartedicredito.jpg">
                </ion-item>`;
        var configObj = {
            "buttons": [{
                text: $filter('translate')('Annulla'),
                type: 'button-stable',
                onTap: function () {
                    $state.go('tab.bookings');
                }
            }, {
                text: '<b>'+$filter('translate')('Procedi')+'</b>',
                type: 'button-positive',
                onTap: function () {
                    startSetefy();
                }
            }],
            "message": modalContent,
            "title": 'Modalità pagamento',
            "cssClass": 'info'
        }
        PopUpServices.buttonsPopup(configObj);
    }

    function startSetefy() {
        $ionicLoading.show();
        ScriptServices.getXMLResource(655).then(function(res) {
            res = res.replace('{DRIVERID}', InfoFactories.getUserInfo().driverNumber || null);
            ScriptServices.callGenericService(res, 655).then(function(data) {
                window.open(data.data, '_system', 'location=yes');
                $state.go('tab.bookings');
                $ionicLoading.hide();
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            });
        });
    }

    function doWatchLocation (){
        var watchOptions = {
            timeout : 5000
          };
        
        navigator.geolocation.watchPosition(function(position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;
            InfoFactories.setLastDeviceCoords({
                lat: lat,
                long: long
            });
            console.log(lat,long);
        }, function(err) {
            console.log('No position found');
        }, watchOptions);
    }

    $scope.getService = function(serviceID) {
        var service = (($scope.userInfo.registry || {}).services || []).find(function (serviceItem) {
            return serviceItem.id == serviceID;
        });
        return service || {};
    };

    $scope.$on('$ionicView.afterEnter', function(event) { 
        $ionicSideMenuDelegate.canDragContent(true); 
    });

    $scope.getTarif = function (serviceID, tarifID) {
        var tarif;
        var service = $scope.getService(serviceID);
        if (service.tarifs && service.tarifs.length) {
            tarif = service.tarifs.find(function (tarifItem) {
                return tarifItem.id == tarifID;
            });
        }
        return tarif || {};
    };

    $scope.changeStatus = function (book) {
        $ionicLoading.show();
        ScriptServices.getXMLResource(673).then(function(res) {
            res = res.replace('{TRAVELNR}', book.codiceViaggio)
            .replace('{STATUS}', 'cancel')
            .replace('{PASSANGERID}', InfoFactories.getUserInfo().driverNumber);
            ScriptServices.callGenericService(res, 673).then(function(data) {
                $scope.loadbookings();
                $ionicLoading.hide();
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            });
        });
    };

    /*$scope.scheduleDelayedNotification = function (pnr) {
        var now = new Date().getTime();
        var _10SecondsFromNow = new Date(now + 10 * 1000);
      
        $cordovaLocalNotification.schedule({
            id: 1,
            title: "Segnala Ritardo Riconsegna",
            text: "Ti informiamo che per la tua prenotazione con PNR: "+ pnr +" non è ancora stata effettuata la riconsegna del veicolo. Se ritieni di ritardare, per cortesia quantifica e comunica il ritardo, tramite la funzione Segnala Ritardo (sezione Alert).",
            "data":{
                "eventName" : "gestioneRitardo"
            },
            every: 3,
            at: _10SecondsFromNow
      }).then(function (result) {
        console.log(result)
      });
    };
    scheduleDelayedNotification();*/
    
    $scope.loadbookings = function() {
        $ionicLoading.show();
        $scope.BookingsList = undefined;
        ScriptServices.getXMLResource(516).then(function (res) {
            var driver = InfoFactories.getUserInfo().driverNumber;
            res = res.replace('{DRIVER_NUMBER}', driver);
            ScriptServices.callGenericService(res, 516).then(function (data) {
                $scope.BookingsList = data.data.BookingsList;
                var blength = $scope.BookingsList.length;
                for (var i = 0; i < blength; i++) {
                    var obj = $scope.BookingsList[i];
                    obj.dateTimeTo = ManipolationServices.dateAndTimeAggregation(obj.return_date, obj.return_time);
                    obj.dateTimeFrom = ManipolationServices.dateAndTimeAggregation(obj.pickup_date, obj.pickup_time);
                    obj.cmb_fuel_quantity = ManipolationServices.trascodeFuel(obj.cmb_fuel_quantity);
                    if (obj.pickup_time_tollerance) {
                        
                        obj.pickup_time_tollerance = ManipolationServices.dateAndTimeAggregation(obj.pickup_date_tollerance, obj.pickup_time_tollerance);
                        if (new Date(obj.pickup_time_tollerance) <= new Date()) {
                            obj.tolleranceCheck = true;
                            $rootScope.sosPnr = obj.status === "Collected"? obj.pnr:undefined;
                        }
                    }
                    if (obj.returnDateChanged && obj.return_time_tollerance) {
                        obj.return_time_tollerance = ManipolationServices.dateAndTimeAggregation(obj.return_date_tollerance, obj.return_time_tollerance);
                        obj.dateTimeTo = obj.return_time_tollerance;
                    }

                    if ((obj.status === "Collected" || obj.status === "Booked" && obj.tolleranceCheck) && obj.bluetooth_id) {
                        enanceWithToken(obj, i);
                    }
                    

                    $scope.BookingsList[i] = obj;
                }
                console.log($scope.BookingsList);
                UpdateBBService.checkIsExistingRequest($scope.BookingsList);
                $ionicLoading.hide();
            }, function (error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            })
        });

    };


    function enanceWithToken(pnr, index) {
        var scriptID = pnr.status === 'Collected' ? 640: 639;
        ScriptServices.getXMLResource(scriptID).then(function(res) {
            if (scriptID === 640) {
                res = res.replace('{PNR}', pnr.pnr).replace('{OPT}', 1);
            } else {
                res = res.replace('{PNR}', pnr.pnr);
            }
            ScriptServices.callGenericService(res, scriptID).then(function(data) {
                pnr.TKN = data.data.encryptedStr;
                $scope.BookingsList[index] = pnr;
            });
        });
    }

    function returnActions (){
        $scope.actions = {};
        $scope.actions.buttons = [];
        if($scope.selectedClient.delay){
            $scope.actions.buttons.push({ 
                text: ionic.Platform.isAndroid() ? '<i class="fa ion-android-time" aria-hidden="true"></i> ' + $scope.selectedClient.lbldelay || $filter('translate')('bookings.delay'): $scope.selectedClient.lbldelay || $filter('translate')('bookings.delay'), 
                type: "delay" 
            });
        }
        if($scope.selectedClient.changeDriver){
            $scope.actions.buttons.push({ 
                text: ionic.Platform.isAndroid() ? '<i class="fa fa-id-card-o" aria-hidden="true"></i>' +$filter('translate')('bookings.changeDriver') : $filter('translate')('bookings.changeDriver'), 
                type: "changeDriver" 
            });
        }
        if($scope.selectedClient.damage){
            $scope.actions.buttons.push({ 
                text: ionic.Platform.isAndroid() ? '<i class="fa fa-wrench" aria-hidden="true"></i> ' +$filter('translate')('bookings.damageHard') : $filter('translate')('bookings.damageHard'), 
                type: "damage" 
            });
        }
        if($scope.selectedClient.defect){
            $scope.actions.buttons.push({ 
                text: ionic.Platform.isAndroid() ? '<i class="fa fa-wrench" aria-hidden="true"></i> ' +$filter('translate')('bookings.damage'): $filter('translate')('bookings.damage'), 
                type: "defect" 
            });
        }
        if($scope.selectedClient.cleanness){
            $scope.actions.buttons.push({ 
                text: ionic.Platform.isAndroid() ? '<i class="fa fa-recycle" aria-hidden="true"></i> ' + $filter('translate')('bookings.cleaness'): $filter('translate')('bookings.cleaness'), 
                type: "cleanness"
            });
        }
    }

    returnActions();

    $scope.loadbookings();

    $scope.newBooking = function () {
        $state.go('tab.parking');
    };

    $scope.openCarManipolation = function (reservation, opT) {
        if (opT === "0" && reservation.bluetooth_id) {
            openVehicleWithBle(reservation, "pushPNR");
        }else if (opT === "1" && reservation.bluetooth_id) {
            closeVehicleWithBle(reservation, "pushPNRClose");
        }else {
            $ionicLoading.show();
            ScriptServices.getXMLResource(627).then(function (res) {
                res = res.replace('{PNR}', reservation.pnr);
                ScriptServices.callGenericService(res, 627).then(function (data) {
                    var response = data.data.split(',');
                    var carCoords = {
                        "lat": parseFloat(response[0]),
                        "long": parseFloat(response[1])
                    };
                    startCloseOpenCarProcess(reservation, opT, carCoords);
                }, function (error) {
                    $ionicLoading.hide();
                    PopUpServices.errorPopup($filter('translate')('bookings.noCoords'));
                });
            });
        }
    };

    $scope.$on('refreshBookings', function(event) {
        $scope.refreshBookings();
    });

    $scope.$on('bleInteraction', function(event, interactionData) {
        if (interactionData.resultStatus === 'KO') {
            PopUpServices.errorPopup(interactionData.errorMessage ,'1');
        } else {
            PopUpServices.errorPopup($filter('translate')('commons.bleSuccess'),'2');
        }

        /* if (interactionData && interactionData.interaction && interactionData.interaction.TKN && interactionData.interaction.MT === 5001) {
            
        } else {
            
        } */
        $ionicLoading.hide();
        console.log('interaction', interactionData);
    });

    

    function openVehicleWithBle(reservation, action) {
        $ionicLoading.show();
        
        if (reservation.TKN) {
            reservation.bleID = reservation.bluetooth_id;
            if ($cordovaDevice.getPlatform() !== 'iOS') {
                AndroidBleConnectionService.connectToVehicle(reservation, action);
            } else {
                IosBleConnectionService.connectToVehicle(reservation, action);
            }
        } else {
            ScriptServices.getXMLResource(639).then(function(res) {
                res = res.replace('{PNR}', reservation.pnr);
                ScriptServices.callGenericService(res, 639).then(function(data) {
                    reservation.TKN = data.data.encryptedStr;
                    reservation.bleID = reservation.bluetooth_id;
                    if ($cordovaDevice.getPlatform() !== 'iOS') {
                        AndroidBleConnectionService.connectToVehicle(reservation, action);
                    } else {
                        IosBleConnectionService.connectToVehicle(reservation, action);
                    }
                }, function(error) {
                    PopUpServices.errorPopup($filter('translate')('bookings.errorOpenCar'));
                    $ionicLoading.hide();
                });
            });
        }
        
    }

    function closeVehicleWithBle(reservation, action) {
        $ionicLoading.show();
        if (reservation.TKN) {
            reservation.bleID = reservation.bluetooth_id;
            bleCloseCheckProximity(reservation, action);
            
        } else {
            ScriptServices.getXMLResource(640).then(function(res) {
                res = res.replace('{PNR}', reservation.pnr).replace('{OPT}', 1);
                ScriptServices.callGenericService(res, 640).then(function(data) {
                    reservation.TKN = data.data.encryptedStr;
                    reservation.bleID = reservation.bluetooth_id;
                    bleCloseCheckProximity(reservation, action);
                    
                }, function(error) {
                    PopUpServices.errorPopup($filter('translate')('bookings.errorOpenCar'));
                    $ionicLoading.hide();
                });
            });
        }
    }

    function bleCloseCheckProximity(reservation, action) {
        var posOptions = { timeout: 20000, enableHighAccuracy: false };
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;
            var proximityResult = checkProximity({ "lat": lat, "long": long }, reservation);
            if (proximityResult) {
                if ($cordovaDevice.getPlatform() !== 'iOS') {
                    AndroidBleConnectionService.connectToVehicle(reservation, action);
                } else {
                    IosBleConnectionService.connectToVehicle(reservation, action);
                }
            } else {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('bookings.needCurrectPark'), '1');
            }
        }, function (err) {
            $ionicLoading.hide();
            PopUpServices.errorPopup($filter('translate')('bookings.needCurrectPark'), '1');
        }, posOptions);
    } 

    function startCloseOpenCarProcess(reservation, opT, carCoords) {
        if (opT === "0") {
            var posOptions = { timeout: 3000, enableHighAccuracy: false };
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                var lat = position.coords.latitude;
                var long = position.coords.longitude;
                var proximityResult = checkProximity(carCoords, { "lat": lat, "long": long }, opT);
                if (proximityResult) {
                    openCloseCar(reservation, opT);
                } else {
                    $ionicLoading.hide();
                    PopUpServices.errorPopup($filter('translate')('bookings.needProximity'), '1');
                }
            }, function (err) {
                if (InfoFactories.getLastDeviceCoords() && InfoFactories.getLastDeviceCoords().lat && InfoFactories.getLastDeviceCoords().long) {
                    var proximityResult = checkProximity(carCoords, InfoFactories.getLastDeviceCoords(), opT);
                    if (proximityResult) {
                        openCloseCar(reservation, opT);
                    } else {
                        $ionicLoading.hide();
                        PopUpServices.errorPopup($filter('translate')('bookings.needProximity'), '1');
                    }
                }else{
                    $ionicLoading.hide();
                    PopUpServices.errorPopup($filter('translate')('bookings.noYourCoords'), '1');
                }
            });
        } else {
            var proximityResult = checkProximity(carCoords, reservation, opT);
            if (proximityResult) {
                openCloseCar(reservation, opT);
            } else {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('bookings.needCurrectPark'), '1');
            }
        }
    }
    function checkProximity(carCoords, coordsCustom, type) {
        var configuredDistance;
        if (type === "0") {
            configuredDistance = $scope.selectedClient.distanceRange || ($scope.userInfo.registry || {}).distanceRange || 0.2;
        }else{
            configuredDistance = coordsCustom.radius_parking || 0.3;
            coordsCustom.lat = coordsCustom.latP;
            coordsCustom.long = coordsCustom.lngP;
        }
        var radlat1 = Math.PI * carCoords.lat/180;
        var radlat2 = Math.PI * coordsCustom.lat/180;
        var theta = carCoords.long-coordsCustom.long;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        configuredDistance = angular.isString(configuredDistance) ? parseInt(configuredDistance) : configuredDistance;
        return dist < configuredDistance ? true : false;
    }

    function openCloseCar(reservation, opT) {
        $ionicLoading.show();
        var rollbackData = {"reservation": reservation, "opT":opT}
        ScriptServices.getXMLResource(621).then(function(res) {
            res = res.replace('{PNR_NUMBER}', reservation.pnr).replace('{OPERATION_TYPE}', opT);
            ScriptServices.callGenericService(res, 621).then(function(data) {
                $ionicLoading.hide();
                humanCheckCarOpened(rollbackData);
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('bookings.errorOpenCar'));
                $ionicLoading.hide();
            })
        });
    }

    function humanCheckCarOpened (rollbackData){
        var configObj = {
            "buttons": [{ 
                text: $filter('translate')('commons.close'),
                type: 'button-stable',
                onTap: function() {
                    $scope.loadbookings();
                }
            },{
                text: '<b>'+ $filter('translate')('commons.retry') +'</b>',
                type: 'button-positive',
                onTap: function() {
                    openCloseCar(rollbackData.reservation, rollbackData.opT);
                }
            }],
            "message" : rollbackData.opT === "0" ? $filter('translate')('bookings.humanCheckCarOpenMessage') : $filter('translate')('bookings.humanCheckCarCloseMessage'),
            "title" : $filter('translate')('bookings.humanCheckCarOpenTitle'),
            "subTitle" : $filter('translate')('bookings.humanCheckCarOpenSubTitle')
        }
        PopUpServices.buttonsPopup(configObj);
    }


    $scope.openBooking = function (object) {
        $state.go('tab.map', { pnrInfo: object });
    };

    $scope.delete = function (book) {
        PopUpServices.buttonsPopup({
            title: $filter('translate')('bookings.cancelConfirmTitle'),
            message: $filter('translate')('bookings.cancelConfirmBody'),
            buttons: [{ 
                text: $filter('translate')('commons.close'),
                type: 'button-stable',
            },{
                text: '<b>'+ $filter('translate')('commons.confirm') +'</b>',
                type: 'button-positive',
                onTap: function() {
                    var script = book.status === 'Registered' ? 643 : 553;
                    $ionicLoading.show();
                    ScriptServices.getXMLResource(script).then(function(res) {
                        res = res.replace('{BOOKING_NUMBER}', book.Nr);
                        ScriptServices.callGenericService(res, script).then(function(data) {
                            $scope.loadbookings();
                        }, function(error) {
                        
                        })
                    });
                }
            }],
        });

        /* confirmPopup.then(function (res) {
            if (res) {
                if (!book) {
                    return;
                }
                
            }
        }); */
    };

    $scope.selectToDate = function () {
        var dateToConfig = {
            date: $scope.contextPnr.dateTimeTo ? new Date($scope.contextPnr.dateTimeTo) : new Date(),
            mode: 'date',
            allowOldDates: false,
            allowFutureDates: true,
            doneButtonLabel: $filter('translate')('commons.select'),
            cancelButtonLabel: $filter('translate')('commons.close'),
            cancelButtonColor: '#000000',
            locale: navigator.language
        };

        $cordovaDatePicker.show(dateToConfig).then(function (date) {
            if (date) {
                $timeout(function () {
                    selectToTime(date);
                }, 500)
            }
        });
    };

    function selectToTime(date) {
        var timeToConfig = {
            date: $scope.contextPnr.dateTimeTo ? new Date($scope.contextPnr.dateTimeTo) : new Date(),
            mode: 'time',
            is24Hour: true,
            allowOldDates: true,
            allowFutureDates: true,
            doneButtonLabel: $filter('translate')('commons.select'),
            cancelButtonLabel: $filter('translate')('commons.close'),
            cancelButtonColor: '#000000',
            locale: navigator.language
        };

        $cordovaDatePicker.show(timeToConfig).then(function (time) {
            if (time) {
                fixDateTime(date, time, 'to');
            }
        });
    };

    function fixDateTime(date, time, type) {
        var hours = new Date(time).getHours();
        var minutes = new Date(time).getMinutes();
        var newDate = new Date(date).setHours(hours, minutes, 0, 0);
        $scope.contextPnr.dateTimeTo = ManipolationServices.resetDateForDefect(newDate);
    }


    function refreshUserInfo(userInfo){
        ScriptServices.getXMLResource(554).then(function(res) {
            res = res.replace('{NUMBER_DRIVER}', $scope.userInfo.driverNumber);
            ScriptServices.callGenericService(res, 554).then(function(data) {
                var userInfo = window.localStorage.getItem('userInfo');
                userInfo = JSON.parse(userInfo);
                userInfo.registry =  data.data.GetUser[0];
                window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
            });
        });
    }

});