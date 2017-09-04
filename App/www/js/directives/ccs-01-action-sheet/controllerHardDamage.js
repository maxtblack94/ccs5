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
angular.module('starter').controller('hardDamageCtrl', function($scope, DamageService, ManipolationServices, PopUpServices, ScriptServices, $ionicLoading) {
    function init(){
        $scope.locale = window.locale;
        $scope.requestParameters = {};
        $scope.operationType = DamageService.getOperationType().operationType;
        $scope.damageType = DamageService.getOperationType().damageType;
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

    $scope.fuelList = [{
        code: "0",
        text: "25%"
    },{
        code: "50",
        text: "50%"
    },{
        code: "75",
        text: "75%"
    },{
        code: "100",
        text: "100%"
    }]

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
                    PopUpServices.messagePopup('Segnalazione effettuta con successo', 'Successo', createCallback());
                }
            }, function (error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup("Non è stato possibile salvare la segnalazione. Riprovare");
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
                PopUpServices.messagePopup('Segnalazione effettuta con successo', 'Successo', createCallback());
            }, function (error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup("Non è stato possibile salvare la segnalazione. Riprovare");
            })
        });
    }

    function createCallback(){
        $scope.params.modalInstance.hide();
        $scope.params.callback();
    }

    init();
})