angular.module('starter').controller('PoolingConfirmCtrl', function(ReservationService, $ionicHistory, $filter, PopUpServices, ScriptServices, $scope, $rootScope, $state, InfoFactories, $timeout, $ionicLoading, $ionicPopup) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.userInfo = InfoFactories.getUserInfo();
    $scope.selectedCar = $state.params.time;
    $scope = Object.assign($scope, ReservationService.instance);
    /* $scope.request = {}; */
    
    function init(){
        if (window.plugins && window.plugins.Keyboard) {
            window.plugins.Keyboard.disableScroll(true);
        }
/*         if($scope.selectedClient.justifiedUse){
            $ionicLoading.show();
            ScriptServices.directWithOutScriptID(588).then(function (data) {
                $scope.justifyList = data.ListJustification;
                $scope.justifyList[0].selected = true;
                $scope.selectedJustify = $scope.justifyList[0]; 
                $scope.bagsList = data.ListBagsQty;
                $scope.seatsList = data.ListSeatsRequested;
                $scope.selectedBags = $scope.bagsList[0];
                $scope.selectedSeats = $scope.seatsList[0];
                $ionicLoading.hide();
            }, function (error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            });
        } */
    }

/*     $scope.selectJustify = function(index, justify) {
        for(var i = 0; i < $scope.justifyList.length; i++){
            $scope.justifyList[i].selected = false;
        }
        $scope.justifyList[index].selected = true;
        $scope.selectedJustify = justify;
    }; */
    

    
    $scope.confirm = function() {
        reserve();
    };

    function reserve(params) {
        $ionicLoading.show();
        ScriptServices.getXMLResource(671).then(function(res) {
            var driverNumber = InfoFactories.getUserInfo().driverNumber;
            res = res.replace('{TRAVELNR}', $scope.selectedCar.Nr)
            .replace('{NUMBER_DRIVER}', driverNumber)
            .replace('{DATE_FROM}', $scope.selectedCar.date)
            .replace('{TIME_FROM}', $scope.selectedCar.time)
            .replace('{PARKA}', $scope.selectedPark.Nr)
            .replace('{PARKB}', ($scope.selectedParkB || {}).Nr || $scope.selectedPark.Nr)
            ScriptServices.callGenericService(res, 671).then(function(data) {
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

    /* $scope.getService = function(serviceID) {
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
    }; */

    $scope.cancel = function () {
        ReservationService.resetReservation();
        $state.go('tab.bookings');
    };

    init();

});