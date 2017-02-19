angular.module('starter').controller('ConfirmPrenotationCtrl', function($scope, $http, $rootScope, $state, InfoFactories, $timeout, $ionicModal, $ionicLoading, $ionicPopup, WebService) {
    function init(){
        $scope.locale = window.locale;
        selectedClient = InfoFactories.getClientSelected();
        $scope.selectedParking = InfoFactories.getPark();
        $scope.hasTelepass  = InfoFactories.getTelepass();
        $scope.hasCC = InfoFactories.getCC();
        $scope.selectedCar = $state.params.car;

        WebService.ajaxPostRequestDirect(588, function(data) {
            $scope.justifyList = data.ListJustification;
            $scope.justifyList[0].selected = true;
            if(selectedClient.justifiedUse){
                $scope.selectedJustify = $scope.justifyList[0]; 
            }
        });
    }

    $scope.backToCars = function(){
        $state.go('tab.selcar');
    }


    
    $scope.selectJustify = function(index, justify) {
        for(var i = 0; i < $scope.justifyList.length; i++)
            $scope.justifyList[i].selected = false;
        
        $scope.justifyList[index].selected = true;
        $scope.selectedJustify = justify;
    };
    

    
    $scope.confirm = function() {
        var place = $('.place_val').val();
        var drivename = $('.driverName_val').val();
        var justifyCode = $scope.selectedJustify ? $scope.selectedJustify.code : null;
        var cc = !selectedClient.cc ? false : $scope.hasCC;
		var telepass = !selectedClient.telepass ? false : $scope.hasTelepass;
            
        if(!place) {
            $ionicPopup.alert({
                title: $scope.locale.confirmation.labelIncomplete,
                template: $scope.locale.confirmation.labelSelectPlace
            });
            return;
        }
        
        if(selectedClient.driveName && !drivename) {
            $ionicPopup.alert({
                title: $scope.locale.confirmation.labelIncomplete,
                template: $scope.locale.confirmation.labelSelectDriveName
            });
			return;
		}
            
        $ionicLoading.show();
        $http.get('res/514.xml').success(function(res) {
			var driver = window.localStorage.getItem('Nr');
            
            res = res.replace('{NUMBER_VEHICLE}', $scope.selectedCar.Nr)
                        .replace('{NUMBER_DRIVER}', driver)
                        .replace('{DATE_FROM}', moment($rootScope.dateFromPick.inputDate).format('DD/MM/YYYY'))
                        .replace('{DATE_TO}', moment($rootScope.dateToPick.inputDate).format('DD/MM/YYYY'))
                        .replace('{TIME_FROM}', moment($rootScope.timeFromPick.inputTime).format('HH:mm'))
                        .replace('{TIME_TO}', moment($rootScope.timeToPick.inputTime).format('HH:mm'))
                        .replace('{PLACE}', place)
                        .replace('{JUSTIFICATION}', justifyCode)
                        .replace('{CC}', cc || false)
                        .replace('{TELEPASS}', cc || false)
                        .replace('{DRIVE_NAME}', drivename);
            
            WebService.ajaxPostRequest(res, 514, function(data) {
                $ionicLoading.hide();
                
                $scope.PNRstring = data.data.PNRstring[0].PNR;
                $scope.isConfirmed = true;
                
                var pnrPopup = $ionicPopup.alert({
                    title: $scope.locale.confirmation.labelRequestComplete,
                    template: $scope.locale.home.rsvinfo.labPRN + ': <b>' + $scope.PNRstring + '</b>'
                });
                pnrPopup.then(function(res) {
                    $state.go('tab.bookings');
                });
            });
        });
    };


    init();

})