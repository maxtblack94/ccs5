angular.module('starter').controller('ConfirmPrenotationCtrl', function(PopUpServices, ScriptServices, $scope, $rootScope, $state, InfoFactories, $timeout, $ionicLoading, $ionicPopup) {
    function init(){
        $scope.locale = window.locale;
        $scope.selectedClient = InfoFactories.getClientSelected();
        $scope.dateTimeFrom = InfoFactories.getDateTimeFrom();
        $scope.dateTimeTo = InfoFactories.getDateTimeTo();
        $scope.selectedParking = InfoFactories.getPark();
        $scope.hasTelepass  = InfoFactories.getTelepass();
        $scope.hasCC = InfoFactories.getCC();
        $scope.selectedCar = $state.params.car;

        if($scope.selectedClient.justifiedUse){
            $ionicLoading.show();
            ScriptServices.directWithOutScriptID(588).then(function (data) {
                $scope.justifyList = data.ListJustification;
                $scope.justifyList[0].selected = true;
                $scope.selectedJustify = $scope.justifyList[0]; 
                $ionicLoading.hide();
            }, function (error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup(error);
            })
        }
    }

    $scope.backToCars = function(){
        $state.go('tab.selcar');
    }

    $scope.selectJustify = function(index, justify) {
        for(var i = 0; i < $scope.justifyList.length; i++){
            $scope.justifyList[i].selected = false;
        }
        $scope.justifyList[index].selected = true;
        $scope.selectedJustify = justify;
    };
    

    
    $scope.confirm = function() {
        var place = $('.place_val').val();
        var justifyCode = $scope.selectedJustify ? $scope.selectedJustify.code : null;
        var cc = !$scope.selectedClient.cc ? false : $scope.hasCC;
		var telepass = !$scope.selectedClient.telepass ? false : $scope.hasTelepass;
            
        if(!place) {
            $ionicPopup.alert({
                title: $scope.locale.confirmation.labelIncomplete,
                template: 'Inserire "'+$scope.selectedClient.lbldestination+'"'
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
                    title: $scope.locale.confirmation.labelRequestComplete,
                    template: $scope.locale.home.rsvinfo.labPRN + ': <b>' + $scope.PNRstring + '</b>'
                });
                pnrPopup.then(function(res) {
                    $state.go('tab.bookings');
                });
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup(error);
            })
        });
    };


    init();

})
