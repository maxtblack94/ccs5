angular.module('starter').factory('DamageService', function() {
    var modalObjValue = {}, operationType = undefined;
    function setModalObj(modalObj) {
        modalObjValue = modalObj;
    };
    function setOperationType(value) {
        operationType = value;
    };
    function getOperationType() {
        return operationType;
    };
    function getModalObj() {
        return modalObjValue;
    };
    return {
        setOperationType: function (value) {
            return setOperationType(value);
        },
        getOperationType: function () {
            return getOperationType();
        },
        setModalObj: function (modalObj) {
            return setModalObj(modalObj);
        },
        getModalObj: function () {
            return getModalObj();
        }
    }
})
angular.module('starter').controller('hardDamageCtrl', function($scope, DamageService, ManipolationServices, PopUpServices, ScriptServices, $ionicLoading, $filter) {
    function init(){
        $scope.requestParameters = {};
        $scope.operationType = DamageService.getOperationType().operationType;
        $scope.alertList = DamageService.getOperationType().alertList;
        $scope.showCase = $scope.operationType === "FAULT" ? "start" : "formDamage";
    }

    $scope.close = function(){
        $scope.params = DamageService.getModalObj();
        $scope.params.modalInstance.hide();
    };

    $scope.changeShowCase = function(type){
        $scope.showCase = type;
        $scope.params = DamageService.getModalObj();
    }

    $scope.jumpStep = function(){
        var state = $scope.operationType === "FAULT" ? "fromFuel":"formNotes";
        $scope.changeShowCase(state);
    }

    $scope.submitData = function(){
        $ionicLoading.show();
        ScriptServices.getXMLResource(629).then(function (res) {
            res = res.replace('{PNR}', ManipolationServices.fixRequestParam($scope.params.book.pnr))
            .replace('{STATUS}', $scope.operationType)
            .replace('{STATUSC}', ManipolationServices.fixRequestParam())
            .replace('{STATUSD}', ManipolationServices.fixRequestParam($scope.requestParameters.statusD))
            .replace('{TOW}', ManipolationServices.fixRequestParam($scope.requestParameters.tow))
            .replace('{NOTES}', ManipolationServices.fixRequestParam($scope.requestParameters.note));
            ScriptServices.callGenericService(res, 629).then(function (data) {
                if($scope.operationType === "FAULT"){
                    closeReservation();
                }else{
                    $ionicLoading.hide();
                    PopUpServices.messagePopup($filter('translate')('actionSheet.damageSuccess'), $filter('translate')('commons.success'), createCallback());
                }
            }, function (error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('actionSheet.damageError'));
            })
        });
    }

    function closeReservation(){
        ScriptServices.getXMLResource(630).then(function (res) {
            res = res.replace('{PNR}', ManipolationServices.fixRequestParam($scope.params.book.pnr))
            .replace('{DATE}', moment(new Date()).format('DD/MM/YYYY HH:mm'))
            .replace('{KM}', ManipolationServices.fixRequestParam($scope.requestParameters.km))
            .replace('{FUEL}', ManipolationServices.fixRequestParam($scope.requestParameters.fuel));
            ScriptServices.callGenericService(res, 630).then(function (data) {
                $ionicLoading.hide();
                PopUpServices.messagePopup($filter('translate')('actionSheet.damageSuccess'), $filter('translate')('commons.success'), createCallback());
            }, function (error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('actionSheet.damageError'));
            })
        });
    }

    function createCallback(){
        $scope.params.modalInstance.hide();
        $scope.params.callback();
    }

    init();
})