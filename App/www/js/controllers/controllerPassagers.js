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
                            startPlace: data.stops[k].passengers[p].pickupStation,
                            stopPlace: data.stops[k].passengers[p].returnStation
                        });
                    } else if(data.stops[k].passengers[p].status === '' || data.stops[k].passengers[p].status === 'booked') {
                        $scope.passengersBooked.push({
                            passengerName: data.stops[k].passengers[p].passengerName,
                            passengerId: data.stops[k].passengers[p].passengerId,
                            status: data.stops[k].passengers[p].status,
                            codiceViaggio: data.pnr,
                            position: data.stops[k].order,
                            startPlace: data.stops[k].passengers[p].pickupStation,
                            stopPlace: data.stops[k].passengers[p].returnStation
                        });
                    }
                    
                }
            }
        }

        console.log($scope.passengersBooked);
        console.log($scope.passengersCollected);
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



    $scope.alertActionSheet = function (passenger) {
        var hideSheet = $ionicActionSheet.show({
            buttons: getActions(passenger.status),
            titleText: "Seleziona un'azione",
            cancelText: ionic.Platform.isAndroid() ? "<i class='fa fa-times' aria-hidden='true'></i> "+$filter('translate')('commons.close') : $filter('translate')('commons.close'),
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index, obj) {
                switch (obj.type) {
                    case "collected":
                        hideSheet();
                        $scope.passangerStatusCall(passenger, 'collected');
                        break;
                    case "missing":
                        hideSheet();
                        $scope.passangerStatusCall(passenger, 'missing');
                        break;
                    case "delivered":
                        hideSheet();
                        $scope.passangerStatusCall(passenger, 'delivered');
                        break;
                    default:
                        break;
                }
            }
        });

    };

    function getActions (status){
        array = [];
        if (status === '' || status === 'booked') {
            array.push({ 
                text: ionic.Platform.isAndroid() ? '<i class="fa ion-close-round" aria-hidden="true"></i> Il passeggero è assente' : 'Il passeggero è assente', 
                type: "missing" 
            });
            array.push({ 
                text: ionic.Platform.isAndroid() ? '<i class="fa ion-arrow-up-a" aria-hidden="true"></i> Il passeggero sale' : 'Il passeggero sale', 
                type: "collected" 
            });
        } else {
            array.push({ 
                text: ionic.Platform.isAndroid() ? '<i class="fa ion-arrow-down-a" aria-hidden="true"></i> Il passeggero scende': 'Il passeggero scende', 
                type: "delivered" 
            });
        }
        
        return array;
    }



});