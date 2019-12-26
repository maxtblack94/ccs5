angular.module('starter').controller('ConfirmCtrl', function(ReservationService, $ionicHistory, $filter, PopUpServices, ScriptServices, $scope, $rootScope, $state, InfoFactories, $timeout, $ionicLoading, $ionicPopup) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.userInfo = InfoFactories.getUserInfo();
    $scope = Object.assign($scope, ReservationService.instance);
    $scope.selectedCar = $state.params.car;
    $scope.selectedBags, $scope.selectedBags = null;
    $scope.request = {};
    
    function init(){
        if (window.plugins && window.plugins.Keyboard) {
            window.plugins.Keyboard.disableScroll(true);
        }
        if($scope.selectedClient.justifiedUse){
            $ionicLoading.show();
            ScriptServices.directWithOutScriptID(588).then(function (data) {
                $scope.justifyList = data.ListJustification;
                $scope.justifyList[0].selected = true;
                $scope.selectedJustify = $scope.justifyList[0]; 
/*                 $scope.bagsList = data.ListBagsQty;
                $scope.seatsList = data.ListSeatsRequested;
                $scope.selectedBags = $scope.bagsList[0];
                $scope.selectedSeats = $scope.seatsList[0]; */
                $ionicLoading.hide();
            }, function (error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            });
        }
    }

    $scope.selectJustify = function(index, justify) {
        for(var i = 0; i < $scope.justifyList.length; i++){
            $scope.justifyList[i].selected = false;
        }
        $scope.justifyList[index].selected = true;
        $scope.selectedJustify = justify;
    };
    

    
    $scope.confirm = function() {
        if ($scope.selectedService.parkingTypeCode === 'BT2') {
            regionalReserve();
        } else {
            classicReserve();
        }
    };

    $scope.selectPicklistValue = function (picklist, title, subTitle) {
        var templateUrl;
        if (picklist === 'selectedSeats') {
            templateUrl = "templates/picklists/seats.html";
        } else if(picklist === 'selectedBags') {
            templateUrl = "templates/picklists/bags.html";
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

    function classicReserve(params) {
        var place = $('.place_val').val();
        var justifyCode = $scope.selectedJustify ? $scope.selectedJustify.code : null;
        var cc = !$scope.selectedClient.cc ? false : $scope.hasCC;
		var telepass = !$scope.selectedClient.telepass ? false : $scope.hasTelepass;
            
        if(!place) {
            $ionicPopup.alert({
                title: $filter('translate')('commons.attention'),
                template: $filter('translate')('commons.insert') +' "' +$scope.selectedClient.lbldestination+'"'
            });
            return;
        }
        $ionicLoading.show();
        ScriptServices.getXMLResource(514).then(function(res) {
            var driverNumber = InfoFactories.getUserInfo().driverNumber;
            res = res.replace('{NUMBER_VEHICLE}', $scope.selectedCar.Nr)
            .replace('{NUMBER_DRIVER}', driverNumber)
            .replace('{DATE_FROM}', moment($scope.dateTimeFrom ).format('DD/MM/YYYY'))
            .replace('{DATE_TO}', moment($scope.dateTimeTo).format('DD/MM/YYYY'))
            .replace('{TIME_FROM}', moment($scope.dateTimeFrom).format('HH:mm'))
            .replace('{TIME_TO}', moment($scope.dateTimeTo).format('HH:mm'))
            .replace('{PLACE}', place)
            .replace('{JUSTIFICATION}', justifyCode)
            .replace('{CC}', cc || false)
            .replace('{TELEPASS}', telepass || false)
            .replace('{PARKA}', $scope.selectedPark.Nr)
            .replace('{PARKB}', ($scope.selectedParkB || {}).Nr || $scope.selectedPark.Nr)
            .replace('{IMPORTOPRESUNTO}', $scope.selectedCar.importoPresunto || 0)
            .replace('{SERVICEID}', $scope.selectedService.id)
            .replace('{TARIFFAID}', (($scope.selectedTarif || {}).value || {}).id || null);
            ScriptServices.callGenericService(res, 514).then(function(data) {
                $ionicLoading.hide();
                InfoFactories.setDateTimeFrom();
                InfoFactories.setDateTimeTo();
                $scope.PNRstring = data.data.PNRstring[0].PNR;
                $scope.isConfirmed = true;
                var pnrPopup = $ionicPopup.alert({
                    title: $filter('translate')('confirmReservation.requestComplete'),
                    template: $filter('translate')('confirmReservation.pnr') + ': <b>' + $scope.PNRstring + '</b>'
                });
                pnrPopup.then(function(res) {
                    $state.go('tab.bookings');
                });
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            });
        });
    }

    $scope.back = function (params) {
        $ionicHistory.goBack();
     };

    function regionalReserve() {
        $ionicLoading.show();
        ScriptServices.getXMLResource(642).then(function(res) {
            var driverNumber = InfoFactories.getUserInfo().driverNumber;
            res = res.replace('{MODEL}', $scope.selectedCar.id)
            .replace('{NUMBER_DRIVER}', driverNumber)
            .replace('{DATE_FROM}', moment($scope.dateTimeFrom ).format('DD/MM/YYYY'))
            .replace('{DATE_TO}', moment($scope.dateTimeTo).format('DD/MM/YYYY'))
            .replace('{TIME_FROM}', moment($scope.dateTimeFrom).format('HH:mm'))
            .replace('{TIME_TO}', moment($scope.dateTimeTo).format('HH:mm'))
            .replace('{SERVICE}', $scope.selectedService.id)
            .replace('{TARIFFAID}', $scope.selectedTarif.value.id)
            .replace('{PARKA}', $scope.selectedPark.Nr)
            .replace('{PARKB}', ($scope.selectedParkB || {}).Nr || $scope.selectedPark.Nr)
            .replace('{DRIVERRANGE}', $scope.driverRange.value.code || 'short')
            /* .replace('{SEAT}', $scope.selectedSeats || 1)
            .replace('{BAGS}', $scope.selectedBags || 1) */
            .replace('{NOTE}', $scope.request.note || '')
            .replace('{IMPORTOPRESUNTO}', $scope.selectedCar.importoPresunto || 0);
            ScriptServices.callGenericService(res, 642).then(function(data) {
                $ionicLoading.hide();
                $scope.PNRstring = data.data.PNRstring[0].PNR;
                $scope.isConfirmed = true;
                var pnrPopup = $ionicPopup.alert({
                    title: $filter('translate')('confirmReservation.requestCompleteRegional'),
                    template: $filter('translate')('confirmReservation.pnr') + ': <b>' + $scope.PNRstring + '</b>'
                });
                pnrPopup.then(function(res) {
                    $state.go('tab.bookings');
                });
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            });
        });
    }

    $scope.getService = function(serviceID) {
        var service = $scope.userInfo.registry.services.find(function (serviceItem) {
            return serviceItem.id === serviceID;
        });
        return service || {};
    };

    $scope.getTarif = function (serviceID, tarifID) {
        var tarif;
        var service = $scope.getService(serviceID);
        if (service.tarifs && service.tarifs.length) {
            tarif = service.tarifs.find(function (tarifItem) {
                return tarifItem.id === tarifID;
            });
        }
        return tarif || {};
    };

    $scope.cancel = function () {
        ReservationService.resetReservation();
        $state.go('tab.bookings');
    };

    init();

});