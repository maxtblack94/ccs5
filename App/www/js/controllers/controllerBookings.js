angular.module('starter').controller('BookingsCtrl', function ($ionicPlatform, $ionicActionSheet, ManipolationServices, PopUpServices, $cordovaGeolocation, $timeout, $cordovaDatePicker, $scope, $rootScope, InfoFactories, $http, $state, $ionicPopup, $ionicLoading, WebService, ScriptServices) {
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.userInfo = InfoFactories.getUserInfo();

    var favo = window.localStorage.getItem('favoriteParking') ? eval('(' + window.localStorage.getItem('favoriteParking') + ')') : null;
    if (favo) {
        InfoFactories.setPark(favo);
    }
    $scope.refreshBookings = function () {
        loadbookings();
        $scope.$broadcast('scroll.refreshComplete');
    }

    ScriptServices.directWithOutScriptID(628).then(function (data) {
        //leader
        var response = data.data;
        // da salvare con la scadenza window.sessionStorage.setItem('alertList', JSON.stringify(data.data));
        $scope.alertList = data.data;
    }, function (error) {
        //loader
        //gestione errore per le liste delle segnalazioni
    })

    function loadbookings() {
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
                            $scope.tolleranceCheck = true;
                            $rootScope.sosPnr = obj.status === "Collected"? obj.pnr:undefined;
                        }
                    }
                    if (obj.returnDateChanged && obj.return_time_tollerance) {
                        obj.return_time_tollerance = ManipolationServices.dateAndTimeAggregation(obj.return_date_tollerance, obj.return_time_tollerance);
                        obj.dateTimeTo = obj.return_time_tollerance;
                    }
                    $scope.BookingsList[i] = obj;
                }
                $ionicLoading.hide();
            }, function (error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup("Non è stato possibile recuperare le prenotazioni.");
            })
        });

    };

    function returnActions (){
        $scope.actions = {};
        $scope.actions.buttons = [];
        if($scope.selectedClient.cleanness){
            $scope.actions.buttons.push({ 
                text: ionic.Platform.isAndroid() ? '<i class="fa fa-recycle" aria-hidden="true"></i> Pulizia': 'Pulizia', 
                type: "cleanness"
            });
        }
        if($scope.selectedClient.delay){
            $scope.actions.buttons.push({ 
                text: ionic.Platform.isAndroid() ? '<i class="fa ion-android-time" aria-hidden="true"></i> ' + $scope.selectedClient.lbldelay || 'Ritardo': $scope.selectedClient.lbldelay || 'Ritardo', 
                type: "delay" 
            });
        }
        if($scope.selectedClient.damage){
            $scope.actions.buttons.push({ 
                text: ionic.Platform.isAndroid() ? '<i class="fa fa-wrench" aria-hidden="true"></i> Guasto' : 'Guasto', 
                type: "damage" 
            });
        }
    }

    returnActions();

    $scope.alertActionSheet = function (reservationNumber) {
        var hideSheet = $ionicActionSheet.show({
            buttons: $scope.actions.buttons,
            titleText: 'Segliere tipologia segnalazione..',
            cancelText: ionic.Platform.isAndroid() ? '<i class="fa fa-times" aria-hidden="true"></i> Chiudi':'Chiudi',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index, obj) {
                switch (obj.type) {
                    case "cleanness":
                        hideSheet();
                        alertCleanness(reservationNumber);
                        break;
                    case "damage":
                        hideSheet();
                        alertDamage(reservationNumber);
                        break;
                    case "delay":
                        hideSheet();
                        setDelay(reservationNumber);
                        break;
                    default:
                        break;
                }
            }
        });

    };

    function alertDamage(reservationNumber) {
        $scope.data = {};
        var myPopup = $ionicPopup.show({
            templateUrl: "templates/commons/picklistDamageTemplate.html",
            title: 'Scegliere una tipologia di guasto...',
            scope: $scope,
            buttons: [
                {
                    text: 'Annulla',
                    type: 'button-stable',
                },
                {
                    text: '<b>Salva</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.value) {
                            e.preventDefault();
                        } else {
                            var obj = {
                                "type": "1",
                                "value" : $scope.data.value,
                                "pnr" : reservationNumber
                            }
                            sendAlert(obj);
                        }
                    }
                }
            ]
        });
    }

    function alertCleanness(reservationNumber) {
        $scope.data = {};
        var myPopup = $ionicPopup.show({
            templateUrl: "templates/commons/picklistCleanTemplate.html",
            title: "Scegliere lo stato dell'auto...",
            scope: $scope,
            buttons: [
                {
                    text: 'Annulla',
                    type: 'button-stable',
                },
                {
                    text: '<b>Salva</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.value) {
                            e.preventDefault();
                        } else {
                            var obj = {
                                "type": "0",
                                "value" : $scope.data.value,
                                "pnr" : reservationNumber
                            }
                            sendAlert(obj);
                        }
                    }
                }
            ]
        });
    }

    function sendAlert(info){
        $ionicLoading.show();
        ScriptServices.getXMLResource(629).then(function (res) {
            res = res.replace('{PNR}', info.pnr);
            if(info.type === "1"){
                res = res.replace('{STATUS}', info.value);
                res = res.replace('{STATUSC}', "");
            }else{
                res = res.replace('{STATUSC}', info.value);
                res = res.replace('{STATUS}', "");
            }
            ScriptServices.callGenericService(res, 629).then(function (data) {
                var response = data.data;
                $ionicLoading.hide();
                PopUpServices.errorPopup("Salvataggio effettuato con successo", "2");
            }, function (error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup("Non è stato possibile salvare la segnalazione. Riprovare");
            })
        });
    }

    loadbookings();

    $scope.newBooking = function () {
        $state.go('tab.parking');
    };

    $scope.openCarManipolation = function (reservation, opT) {
        $ionicLoading.show();
        ScriptServices.getXMLResource(627).then(function (res) {
            res = res.replace('{PNR}', reservation.pnr);
            ScriptServices.callGenericService(res, 627).then(function (data) {
                var response = data.data.split(',');
                var carCoords = {
                    "lat": response[0],
                    "long": response[1]
                }
                startCloseOpenCarProcess(reservation, opT, carCoords);
            }, function (error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup("Non siamo riusciti a recuperare le coordinate del veicolo! Riprovare.");
            })
        });
    }

    function startCloseOpenCarProcess(reservation, opT, carCoords) {
        if (opT === "0") {
            var posOptions = { timeout: 10000, enableHighAccuracy: false };
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                var lat = position.coords.latitude
                var long = position.coords.longitude
                var proximityResult = checkProximity(carCoords, { "lat": lat, "long": long }, opT);
                if (proximityResult) {
                    openCloseCar(reservation, opT);
                } else {
                    $ionicLoading.hide();
                    PopUpServices.errorPopup("Devi essere in prossimità dell'automobile per poterla aprire", '1');
                }
            }, function (err) {
                $ionicLoading.hide();
                PopUpServices.errorPopup("Non è stato possibile recuperare le tue coordinate", '1');
            });
        } else {
            var proximityResult = checkProximity(carCoords, { "lat": reservation.latP, "long": reservation.lngP }, opT);
            if (proximityResult) {
                openCloseCar(reservation, opT);
            } else {
                $ionicLoading.hide();
                PopUpServices.errorPopup("L'automobile deve essere posizionata nel pareggio prima di poterla chiudere", '1');
            }
        }
    }
    function checkProximity(carCoords, coordsCustom, type) {
        var configuredDistance = $scope.selectedClient.distanceRange || ($scope.userInfo.registry || {}).distanceRange || 0.20;
        var radlat1 = Math.PI * carCoords.lat / 180;
        var radlat2 = Math.PI * coordsCustom.lat / 180;
        var theta = carCoords.long - coordsCustom.long;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
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
                PopUpServices.errorPopup("Non è stato possibile aprire la macchina, riprovare!");
                $ionicLoading.hide();
            })
        });
    }

    function humanCheckCarOpened (rollbackData){
        var configObj = {
            "buttons": [{ 
                text: 'Chiudi',
                type: 'button-stable',
                onTap: function() {
                    loadbookings();
                }
            },{
                text: '<b>Riprova</b>',
                type: 'button-positive',
                onTap: function() {
                    openCloseCar(rollbackData.reservation, rollbackData.opT);
                }
            }],
            "message" : rollbackData.opT === "0" ? "Attendere qualche secondo! Se dopo qualche secondo il veicolo non si apre, riprovare." : "Attendere qualche secondo! Se dopo qualche secondo il veicolo non si chiude, riprovare.",
            "title" : "Controllo",
            "subTitle" : "Conferma stato del veicolo!"
        }
        PopUpServices.buttonsPopup(configObj);
    }


    $scope.openBooking = function (object) {
        $state.go('tab.map', { pnrInfo: object });
    };

    $scope.delete = function (book) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Conferma eliminazione',
            template: 'Sicuro di vole eliminare la prenotazione selezionata?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                if (!book) {
                    return;
                }
                $ionicLoading.show();
                $http.get("res/553.xml").success(function (res) {
                    res = res.replace('{BOOKING_NUMBER}', book.Nr);
                    WebService.ajaxPostRequest(res, 553, function (data) {
                        loadbookings();
                    });
                });
            }
        });
    };


    function setDelay(pnr) {
        $scope.contextPnr = angular.copy(pnr);
        $scope.dataDelay = {};
        var setDelayPopup = $ionicPopup.show({
            templateUrl: 'templates/popup/postDelay.html',
            title: 'Segnala ritardo',
            subTitle: "Quanto ritardo farai?",
            scope: $scope,
            buttons: [{
                text: 'Annulla',
                type: 'button-stable',
            }, {
                text: '<b>Segnala</b>',
                type: 'button-positive',
                onTap: function (e) {
                    if (!$scope.dataDelay.value) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        return {
                            'pnr': pnr,
                            'time': $scope.dataDelay.value
                        }
                    }
                }
            }]
        });

        setDelayPopup.then(function (delayInfo) {
            $ionicLoading.show();
            ScriptServices.getXMLResource(619).then(function(res) {
                res = res.replace('{PNR}', delayInfo.pnr).replace('{DELAY}', delayInfo.time);
                delete $scope.contextPnr;
                ScriptServices.callGenericService(res, 619).then(function(data) {
                    $ionicLoading.hide();
                    loadbookings();
                }, function(error) {
                    $ionicLoading.hide();
                    PopUpServices.errorPopup('Non è stato possibile comunicare il ritrado, riprovare.');
                })
            });
        });
    }

    $scope.selectToDate = function () {
        var dateToConfig = {
            date: $scope.contextPnr.dateTimeTo ? new Date($scope.contextPnr.dateTimeTo) : new Date(),
            mode: 'date',
            allowOldDates: false,
            allowFutureDates: true,
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
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
            doneButtonLabel: $scope.locale.date.butChange,
            cancelButtonLabel: $scope.locale.date.labelClose,
            cancelButtonColor: '#000000',
            locale: $scope.locale.locale
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





})