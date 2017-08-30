angular.module('starter').factory('DamageService', function() {
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
angular.module('starter').controller('hardDamageCtrl', function($scope, DamageService) {
    function init(){
        $scope.showCase = "start";
        $scope.locale = window.locale;
    }

    $scope.close = function(){
        $scope.params = DamageService.getModalObj();
        $scope.params.modalInstance.hide();
    };

    $scope.changeShowCase = function(type){
        $scope.showCase = type;
        $scope.params = DamageService.getModalObj();
    }


    init();
})