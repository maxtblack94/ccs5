angular.module('starter').controller('BookingsCtrl', function (PopUpServices, $cordovaGeolocation, $timeout, $cordovaDatePicker, $scope, $rootScope, InfoFactories, $http, $state, $ionicPopup, $ionicLoading, WebService, ScriptServices) {
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();

    var favo = window.localStorage.getItem('favoriteParking') ? eval('(' + window.localStorage.getItem('favoriteParking') + ')') : null;
    if (favo) {
        InfoFactories.setPark(favo);
    }
    $scope.refreshBookings = function () {
        loadbookings();
        $scope.$broadcast('scroll.refreshComplete');
    }


    function loadbookings() {
        $ionicLoading.show(); 
        $scope.BookingsList = undefined;
        ScriptServices.getXMLResource(516).then(function(res) {
            var driver = window.localStorage.getItem('Nr');
            res = res.replace('{DRIVER_NUMBER}', driver);
            ScriptServices.callGenericService(res, 516).then(function(data) {
                $scope.BookingsList = data.data.BookingsList;
                var blength = $scope.BookingsList.length;
                for (var i = 0; i < blength; i++) {
                    $scope.BookingsList[i].return_time = $scope.BookingsList[i].return_time.slice(10, -3);
                    $scope.BookingsList[i].pickup_time = $scope.BookingsList[i].pickup_time.slice(10, -3);
                    $scope.BookingsList[i].pickup_time_tollerance = $scope.BookingsList[i].pickup_time_tollerance.slice(10, -3);
                    $scope.BookingsList[i].pickup_time_tollerance = $scope.BookingsList[i].pickup_date_tollerance + ' ' + $scope.BookingsList[i].pickup_time_tollerance;
                    $scope.BookingsList[i].dateTimeTo = $scope.BookingsList[i].return_date + ' ' + $scope.BookingsList[i].return_time;
                    $scope.BookingsList[i].dateTimeFrom = $scope.BookingsList[i].pickup_date + ' ' + $scope.BookingsList[i].pickup_time;
                    $scope.BookingsList[i].dateTimeTo = new Date(moment($scope.BookingsList[i].dateTimeTo, 'DD/MM/YYYY HH:mm:ss'));
                    $scope.BookingsList[i].dateTimeFrom = new Date(moment($scope.BookingsList[i].dateTimeFrom, 'DD/MM/YYYY HH:mm:ss'));
                    $scope.BookingsList[i].pickup_time_tollerance = new Date(moment($scope.BookingsList[i].pickup_time_tollerance, 'DD/MM/YYYY HH:mm:ss'));
                    $scope.BookingsList[i].cmb_fuel_quantity = InfoFactories.trascodeFuel($scope.BookingsList[i].cmb_fuel_quantity);
                    $scope.BookingsList[i].showDelayBtn = $scope.BookingsList[i].dateTimeFrom <= new Date();
                    if(new Date($scope.BookingsList[i].pickup_time_tollerance) <= new Date()){
                        $scope.BookingsList[i].showOpenCloseButtons = true;
                    }
                }
                $ionicLoading.hide();
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup(error+', riprovare!');
            })
        });
    
    }

    loadbookings();

    $scope.newBooking = function () {
        $state.go('tab.parking');
    };

    $scope.openCarManipolation = function (reservation, opT) {
        $http.get("res/627.xml").success(function (res) {
            res = res.replace('{PNR}', reservation.pnr);
            WebService.ajaxPostRequestTemp(res, 627, function (data) {
                var response = data.split(',');
                var carCoords = {
                    "lat" : response[0],
                    "long": response[1]
                }
                startCloseOpenCarProcess(reservation, opT, carCoords);
            });
        });
    }

    function startCloseOpenCarProcess (reservation, opT, carCoords){
        $ionicLoading.show();
        if(opT === "0"){
             var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                var lat  = position.coords.latitude
                var long = position.coords.longitude
                var proximityResult = checkProximity(carCoords, {"lat":lat, "long":long}, opT);
                if(proximityResult){
                    openCloseCar(reservation, opT);
                }else{
                    $ionicLoading.hide();
                    PopUpServices.errorPopup("Devi essere in prossimità dell'automobile per poterla aprire", '1');
                }
            }, function(err) {
                $ionicLoading.hide();
                PopUpServices.errorPopup("Non è stato possibile recuperare le tue coordinate", '1');
            });
        }else{
            var proximityResult = checkProximity(carCoords, {"lat":reservation.latP, "long":reservation.lngP}, opT);
            if(proximityResult){
                openCloseCar(reservation, opT);
            }else{
                $ionicLoading.hide();
                PopUpServices.errorPopup("L'automobile deve essere posizionata nel pareggio prima di poterla chiudere", '1');
            }
        }
    }
    function checkProximity (carCoords, coordsCustom, type){
            var radlat1 = Math.PI * carCoords.lat/180;
            var radlat2 = Math.PI * coordsCustom.lat/180;
            var theta = carCoords.long-coordsCustom.long;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344;
            return dist < 0.20 ? true:false;
    }

    function openCloseCar (reservation, opT){
        $http.get("res/621.xml").success(function (res) {
            res = res.replace('{PNR_NUMBER}', reservation.pnr).replace('{OPERATION_TYPE}', opT);
            $http({
                url: 'http://' + InfoFactories.getServer() + '.corporatecarsharing.biz/api.svc/ScriptParameterSets',
                method: "POST",
                data: res,
                headers: {
                    'TenForce-Auth': 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4',
                    'Content-Type': 'application/atom+xml'
                }
            }).success(function (data, status, headers, config) {
                var responsePromisee = $http.get("http://" + InfoFactories.getServer() + ".corporatecarsharing.biz/api.svc/ExecuteAdminScript?scriptId=621&scriptParameterSetId=" + data.d.Id, { headers: { 'TenForce-Auth': 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4' } });

                responsePromisee.success(function (data, status, headers, config) {
                    console.log(data)
                    $ionicLoading.hide();
                });
            }).error(function (err) {
                PopUpServices.errorPopup("Non è stato possibile aprire la macchina, riprovare!");
                $ionicLoading.hide();
            });
        })
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


    $scope.setDelay = function (pnr) {
        $scope.contextPnr = angular.copy(pnr);
        var setDelayPopup = $ionicPopup.show({
            templateUrl: 'templates/popup/postDelay.html',
            title: 'Segnala ritardo',
            subTitle: "Modifica la data e l'ora di riconsegna",
            scope: $scope,
            buttons: [
                { text: 'Annulla' },
                {
                    text: '<b>Segnala</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.contextPnr.dateTimeTo) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            return {
                                'pnr': pnr.pnr,
                                'newDate' : $scope.contextPnr.dateTimeTo,
                                'oldDate' : pnr.dateTimeTo
                            }
                        }
                    }
                }
            ]
        });

        setDelayPopup.then(function (delayInfo) {
            if (delayInfo) {
                delayInfo.delay = moment.duration(delayInfo.newDate - delayInfo.oldDate).asMinutes();
                $ionicLoading.show();
                callEditDelay(delayInfo);
            }

        });
    }

    function callEditDelay(delayInfo) {
        $http.get("res/619.xml").success(function (res) {
            res = res.replace('{PNR}', delayInfo.pnr).replace('{DELAY}', delayInfo.delay);
            delete $scope.contextPnr;
            WebService.ajaxPostRequestTemp(res, 619, function (data) {
                loadbookings();
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
        $scope.contextPnr.dateTimeTo = InfoFactories.resetDateForDefect(newDate);
    }





})