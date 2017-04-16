angular.module('starter').controller('BookingsCtrl', function ($timeout, $cordovaDatePicker, $scope, $rootScope, InfoFactories, $http, $state, $ionicPopup, $ionicLoading, WebService) {
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

        $http.get("res/516.xml").success(function (res) {
            var driver = window.localStorage.getItem('Nr');
            res = res.replace('{DRIVER_NUMBER}', driver);

            WebService.ajaxPostRequestTemp(res, 516, function (data) {
                $scope.BookingsList = data.data.BookingsList;
                var blength = $scope.BookingsList.length;
                for (var i = 0; i < blength; i++) {
                    $scope.BookingsList[i].return_time = $scope.BookingsList[i].return_time.slice(10, -3);
                    $scope.BookingsList[i].pickup_time = $scope.BookingsList[i].pickup_time.slice(10, -3);
                    $scope.BookingsList[i].dateTimeTo = $scope.BookingsList[i].return_date + ' ' + $scope.BookingsList[i].return_time;
                    $scope.BookingsList[i].dateTimeFrom = $scope.BookingsList[i].pickup_date + ' ' + $scope.BookingsList[i].pickup_time;
                    $scope.BookingsList[i].dateTimeTo = new Date(moment($scope.BookingsList[i].dateTimeTo, 'DD/MM/YYYY HH:mm:ss'));
                    $scope.BookingsList[i].dateTimeFrom = new Date(moment($scope.BookingsList[i].dateTimeFrom, 'DD/MM/YYYY HH:mm:ss'));
                    $scope.BookingsList[i].cmb_fuel_quantity = InfoFactories.trascodeFuel($scope.BookingsList[i].cmb_fuel_quantity);
                    $scope.BookingsList[i].showDelayBtn = moment(new Date()).isBetween($scope.BookingsList[i].dateTimeFrom, $scope.BookingsList[i].dateTimeTo);

                }
                $ionicLoading.hide();

            });
        });
    };

    loadbookings();

    $scope.newBooking = function () {
        $state.go('tab.parking');
    };

    $scope.openCarManipolation = function (reservation, opT) {
        $ionicLoading.show();
        $http.get("res/621.xml").success(function (res) {
            res = res.replace('{PNR_NUMBER}', reservation).replace('{OPERATION_TYPE}', opT);
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
                //gestire ERRORe
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