angular.module('starter').controller('HistoryCtrl', function(ScriptServices, $scope, $ionicModal, PopUpServices, $ionicLoading, InfoFactories) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    

    function getHistory(params) {
        $ionicLoading.show();
        ScriptServices.getXMLResource(552).then(function(res) {
            res = res.replace('{DRIVERNUMBER}', InfoFactories.getUserInfo().driverNumber)
            .replace('{MINVAL}', 0)
            .replace('{MAXVAL}', 25);
            ScriptServices.callGenericService(res, 552).then(function(data) {
                $ionicLoading.hide();
                $scope.historyList = ((data.data || {}).AllBookingList || []);
            }, function(error) {
                $ionicLoading.hide();
                $scope.historyList = [];
            });
        });
    }

    function init(params) {
        getHistory();
        $ionicModal.fromTemplateUrl('js/commons/modalTemplates/reservationHistoryModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modalInstance = modal;
        });
    }
    
    

    $scope.openModal = function (item) {
        $scope.currentItem = item;
        $scope.modalInstance.show();
    };

    $scope.closeModal = function (item) {
        $scope.currentItem = null;
        $scope.modalInstance.hide();
    };

    init();

});
