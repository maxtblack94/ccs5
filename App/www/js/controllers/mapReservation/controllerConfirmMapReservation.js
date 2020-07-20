angular.module('starter').controller('ConfirmMapReservationCtrl', function(PopUpServices, ScriptServices, $ionicLoading, $state, $filter, $ionicPopup, InfoFactories, $stateParams,$scope) {
    var isSubmit = false;
    function init() {
        $scope.currentVehicle = $stateParams.vehicle;
        $scope.userInfo = InfoFactories.getUserInfo();
        $scope.request = {};
        $scope.request.subscription = $scope.getService();
        $scope.request.tarif = $scope.getService().tarifs[0];
        $scope.request.parkings = {
            address : $scope.currentVehicle.parkingAddress,
            Nr: $scope.currentVehicle.parkingId,
            parking_name: $scope.currentVehicle.parkingName,
        }
        ScriptServices.getXMLResource(512).then(function(res) {
            var driverNumber = InfoFactories.getUserInfo().driverNumber;
            res = res.replace('{DRIVER_NUMBER}', driverNumber);
            ScriptServices.callGenericService(res, 512).then(function(data) {
                $scope.parkingList = data.data.ParkingsList || [];
                $ionicLoading.hide();
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            });
        });
    }
    

    $scope.reservationTime = [{
        code: 20,
        description: "20 Min"
    },{
        code: 40,
        description: "40 Min"
    },{
        code: 60,
        description: "1 H"
    },{
        code: 80,
        description: "1 H 20 Min"
    },{
        code: 100,
        description: "1 H 40 Min"
    },{
        code: 120,
        description: "2 H"
    },{
        code: 140,
        description: "2 H 20 Min"
    },{
        code: 160,
        description: "2 H 40 Min"
    },{
        code: 180,
        description: "3 H"
    }];

    $scope.cancel = function () {
        $state.go('tab.bookings');
    }

    $scope.proceed= function () {
        if (!$scope.request.subscription || !$scope.request.tarif || !$scope.request.reserveTime) {
            PopUpServices.messagePopup($filter('translate')('commons.mandatoryField'), $filter('translate')('commons.attention'));
        } else if (!isSubmit) {
            getPrice();
        } else {
            createReservation();
        }
    }

    $scope.getService = function() {
        var service = $scope.userInfo.registry.services.find(function (serviceItem) {
            return serviceItem.id === 72193;
        });
        return service || $scope.userInfo.registry.services[0];
    };

    $scope.selectPicklistValue = function (picklist, title, subTitle) {
        var templateUrl;
        if (picklist === 'reserveTime') {
            templateUrl = "templates/picklists/reserveTime.html";
        } else if(picklist === 'parkings') {
            templateUrl = "templates/picklists/park.html";
        }

        $ionicPopup.show({
            templateUrl: templateUrl,
            title: title,
            subTitle: subTitle,
            cssClass: 'picklist',
            scope: $scope,
            buttons: [{
                text: $filter('translate')('commons.cancel'),
                type: 'button-stable',
            }, {
                text: '<b>'+$filter('translate')('commons.save')+'</b>',
                type: 'button-positive',
                onTap: function (e) {
                    if (!$scope.request.picklistValue) {
                        $scope.request.picklistValue = null;
                        e.preventDefault();
                    } else {
                        $scope.request[picklist] = $scope.request.picklistValue;
                        $scope.request.picklistValue = null;
                    }
                }
            }]
        });
    };

    function getPrice() {
        $ionicLoading.show();
        defineCurrectDates();
        ScriptServices.getXMLResource(739).then(function(res) {
            res = res.replace('{NUMBER_DRIVER}', $scope.userInfo.driverNumber)
            .replace('{VEHICLEID}', $scope.currentVehicle.id)
            .replace('{FROMDATE}', moment().format('DD/MM/YYYY'))
            .replace('{TODATE}', moment($scope.request.dateTimeTo).format('DD/MM/YYYY'))
            .replace('{FROMORA}', moment().format('HH:mm'))
            .replace('{TOORA}', moment($scope.request.dateTimeTo).format('HH:mm'))
            .replace('{PARKB}', $scope.request.parkings.Nr)
            .replace('{SERVICEID}', $scope.request.subscription.id)
            .replace('{TARIFID}', $scope.request.tarif.id);
            ScriptServices.callGenericService(res, 739).then(function(data) {
                $ionicLoading.hide(); 
                $scope.currentImport = data.data.import;
                isSubmit = true;
            }, function (err) {
                $ionicLoading.hide(); 
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            });
        });
    }

    function defineCurrectDates() {
        $scope.request.dateTimeTo = moment().add($scope.request.reserveTime.code, 'minutes');
    }


    function createReservation() {
        $ionicLoading.show(); 
        ScriptServices.getXMLResource(740).then(function(res) {
            res = res.replace('{NUMBER_DRIVER}', $scope.userInfo.driverNumber)
            .replace('{VEHICLEID}', $scope.currentVehicle.id)
            .replace('{FROMDATE}', moment().format('DD/MM/YYYY'))
            .replace('{TODATE}', moment($scope.request.dateTimeTo).format('DD/MM/YYYY'))
            .replace('{FROMORA}', moment().format('HH:mm'))
            .replace('{TOORA}', moment($scope.request.dateTimeTo).format('HH:mm'))
            .replace('{PARKB}', $scope.currentVehicle.parkingId)
            .replace('{SERVICEID}', $scope.request.subscription.id)
            .replace('{TARIFID}', $scope.request.tarif.id)
            .replace('{IMPORT}', $scope.currentImport);
            ScriptServices.callGenericService(res, 740).then(function(data) {
                $scope.PNRstring = data.data.PNRstring[0].PNR;
                var pnrPopup = $ionicPopup.alert({
                    title: $filter('translate')('confirmReservation.requestComplete'),
                    template: $filter('translate')('confirmReservation.pnr') + ': <b>' + $scope.PNRstring + '</b>'
                });
                pnrPopup.then(function(res) {
                    $state.go('tab.bookings');
                });
                $ionicLoading.hide(); 
            }, function (err) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide(); 
            });
        });
    }

    init();
})