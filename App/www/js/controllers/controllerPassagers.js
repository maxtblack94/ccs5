angular.module('starter').controller('PassagersCtrl', function ($ionicActionSheet, $filter, PopUpServices, ScriptServices, $scope, $http, $state, $ionicLoading, $cordovaGeolocation, $ionicPopup) {
    $scope.selectedBooking = $state.params.pnrInfo;

    $scope.getPassegers = function () {
        $ionicLoading.show();
        ScriptServices.getXMLResource(672).then(function(res) {
            res = res.replace('{BOOKING_NUMBER}', $scope.selectedBooking.Nr);
            ScriptServices.callGenericService(res, 672).then(function(data) {
                console.log(data);
                getPassagersList(data.data);
                $ionicLoading.hide();
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            });
        });
    };

    $scope.getPassegers();


    function getPassagersList (data) {
        $scope.passengersBooked = [];
        $scope.passengersCollected = [];
        for (var k = 0; k < data.stops.length; k++) {
            for (var p = 0; p < data.stops[k].passengers.length; p++) {
                var itemExists;
                itemExists = $scope.passengersBooked.find(function (item) {
                    return item.passengerId === data.stops[k].passengers[p].passengerId;
                });

                if (!itemExists) {
                    itemExists = $scope.passengersCollected.find(function (item) {
                        return item.passengerId === data.stops[k].passengers[p].passengerId;
                    });
                }

                if (data.stops[k].passengers[p].passengerId && !itemExists) {
                    if (data.stops[k].passengers[p].status === 'collected') {
                        $scope.passengersCollected.push({
                            passengerName: data.stops[k].passengers[p].passengerName,
                            passengerId: data.stops[k].passengers[p].passengerId,
                            status: data.stops[k].passengers[p].status,
                            codiceViaggio: data.pnr,
                            position: data.stops[k].order,
                            startPlace: data.stops[k].name
                        });
                    } else if(data.stops[k].passengers[p].status === '' || data.stops[k].passengers[p].status === 'booked') {
                        $scope.passengersBooked.push({
                            passengerName: data.stops[k].passengers[p].passengerName,
                            passengerId: data.stops[k].passengers[p].passengerId,
                            status: data.stops[k].passengers[p].status,
                            codiceViaggio: data.pnr,
                            position: data.stops[k].order,
                            startPlace: data.stops[k].name
                        });
                    }
                    
                }
            }
        }
    }


    $scope.passangerStatusCall = function (passanger, status) {
        $ionicLoading.show();
        ScriptServices.getXMLResource(673).then(function(res) {
            res = res.replace('{TRAVELNR}', passanger.codiceViaggio)
            .replace('{STATUS}', status)
            .replace('{PASSANGERID}', passanger.passengerId);
            ScriptServices.callGenericService(res, 673).then(function(data) {
                console.log(data);
                $scope.getPassegers();
                $ionicLoading.hide();
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            });
        });
    }



    $scope.alertActionSheet = function () {
        var hideSheet = $ionicActionSheet.show({
            buttons: getActions(),
            titleText: 'Seleziona un azione',
            cancelText: ionic.Platform.isAndroid() ? "<i class='fa fa-times' aria-hidden='true'></i> "+$filter('translate')('commons.close') : $filter('translate')('commons.close'),
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index, obj) {
                switch (obj.type) {
                    case "collected":
                        hideSheet();
                        alertCleanness($scope.book.pnr);
                        break;
                    case "missing":
                        hideSheet();
                        DamageService.setOperationType({
                            "alertList": $scope.alertList,
                            "operationType" : "DEFECTIVE"
                        });
                        $ionicModal.fromTemplateUrl('js/directives/ccs-01-action-sheet/templates/hardDamage.html', {
                            scope: $scope
                        }).then(function (modal) {
                            alertDamage($scope.book, modal);
                        });
                        break;
                    case "delivered":
                        hideSheet();
                        DamageService.setOperationType({
                            "alertList": $scope.alertList,
                            "operationType" : "FAULT"
                        });
                        $ionicModal.fromTemplateUrl('js/directives/ccs-01-action-sheet/templates/hardDamage.html', {
                            scope: $scope
                        }).then(function (modal) {
                            alertDamage($scope.book, modal);
                        });
                        break;
                    default:
                        break;
                }
            }
        });

    };

    function getActions (){
        array = [];
        array.push({ 
            text: ionic.Platform.isAndroid() ? '<i class="fa ion-android-time" aria-hidden="true"></i> ' + $scope.selectedClient.lbldelay || $filter('translate')('bookings.delay'): $scope.selectedClient.lbldelay || $filter('translate')('bookings.delay'), 
            type: "collected" 
        });
        array.push({ 
            text: ionic.Platform.isAndroid() ? '<i class="fa fa-id-card-o" aria-hidden="true"></i>' +$filter('translate')('bookings.changeDriver') : $filter('translate')('bookings.changeDriver'), 
            type: "missing" 
        });
        array.push({ 
            text: ionic.Platform.isAndroid() ? '<i class="fa fa-wrench" aria-hidden="true"></i> ' +$filter('translate')('bookings.damageHard') : $filter('translate')('bookings.damageHard'), 
            type: "delivered" 
        });
        return array;
    }



});