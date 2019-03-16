angular.module('starter').controller('ConfirmCtrl', function(ReservationService, $filter, PopUpServices, ScriptServices, $scope, $rootScope, $state, InfoFactories, $timeout, $ionicLoading, $ionicPopup) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope = Object.assign($scope, ReservationService.instance);
    $scope.selectedCar = $state.params.car;
    /* $scope.hasTelepass  = InfoFactories.getTelepass();
        $scope.hasCC = InfoFactories.getCC(); */
    
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
            .replace('{TELEPASS}', telepass || false);
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

    function regionalReserve(params) {
        console.log('regionalReserve');
    }


    init();

});