angular.module('starter').controller('ChangeDriverCtrl', function($scope, ManipolationServices, $filter, PopUpServices, ScriptServices, $ionicLoading) {
    function init(){
        $scope.requestParameters = {};
        $scope.showCase = "start";
    }

    $scope.close = function(){
        $scope.currentModalData.modalInstance.hide();
    };

    $scope.goToConfirm = function(selectedDriver){
        $scope.selectedDriver = selectedDriver;
        $scope.showCase = "confirm";
    }

    $scope.confirmChangeDriver = function(){
        $ionicLoading.show();
        ScriptServices.getXMLResource(632).then(function (res) {
            res = res.replace('{PNR}', ManipolationServices.fixRequestParam($scope.book.pnr))
            .replace('{DRIVERID}', $scope.selectedDriver.id);
            ScriptServices.callGenericService(res, 632).then(function (data) {
                $ionicLoading.hide();
                PopUpServices.messagePopup($filter('translate')('actionSheet.changeDriverSuccess')+ $filter('camelCase')($scope.selectedDriver.description), $filter('translate')('commons.success'), createCallback());
            }, function (error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('actionSheet.changeDriverError'));
            })
        });
    }

    $scope.changeState = function(state){
        $scope.showCase = state;
    }

    function createCallback(){
        $scope.currentModalData.modalInstance.hide();
        $scope.currentModalData.callback();
    }

    init();
})