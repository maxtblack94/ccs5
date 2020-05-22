angular.module('starter').factory('ChangeReturnParkService', function() {
    var modalObjValue = {};
    function setModalObj(modalObj) {
        modalObjValue = modalObj;
    };
    function getModalObj() {
        return modalObjValue;
    };
    return {
        setModalObj: function (modalObj) {
            return setModalObj(modalObj);
        },
        getModalObj: function () {
            return getModalObj();
        }
    }
})
angular.module('starter').controller('ChangeReturnParkingCtrl', function(ManipolationServices, ChangeReturnParkService, $scope, PopUpServices, InfoFactories, $filter, $ionicLoading, ScriptServices) {

    function init() {
        $ionicLoading.show();
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
   
   $scope.selectParking = function(parking) {
       $scope.currentPark = parking;
       console.log(parking)
   };

   $scope.cancel = function () {
        $scope.params = ChangeReturnParkService.getModalObj();
        $scope.params.modalInstance.hide();
   }

   $scope.save = function () {
    $ionicLoading.show();
    $scope.params = ChangeReturnParkService.getModalObj();
    ScriptServices.getXMLResource(700).then(function (res) {
        res = res.replace('{PNR}',  ManipolationServices.fixRequestParam($scope.params.book.pnr))
        .replace('{NEWPARK}', $scope.currentPark.Nr)
        .replace('{RETURNDATE}', "")
        .replace('{RETURNTIME}', "");
        delete $scope.contextPnr;
        ScriptServices.callGenericService(res, 700).then(function (data) {
            $ionicLoading.hide();
            PopUpServices.messagePopup("Operazione effettuata correttamente"), $filter('translate')('commons.success', createCallback());
        }, function (error) {
            $ionicLoading.hide();
            PopUpServices.errorPopup("Attenzione! Si è verificato un problema durante il salvataggio");
        });
    });
   }

   function createCallback(){
    $scope.params.modalInstance.hide();
    $scope.params.callback();
}

   init();
})