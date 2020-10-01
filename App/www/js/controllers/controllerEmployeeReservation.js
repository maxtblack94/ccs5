angular.module('starter').controller('EmployeeReservationCtrl', function(ScriptServices, $scope, $ionicModal, PopUpServices, $ionicLoading, InfoFactories) {
    $scope.selectedClient = InfoFactories.getClientSelected();
    

    function getEmployee(params) {
        $ionicLoading.show();
        ScriptServices.getXMLResource(705).then(function(res) {
            res = res.replace('{DRIVERNUMBER}', InfoFactories.getUserInfo().driverNumber)
            .replace('{MINVAL}', 0)
            .replace('{MAXVAL}', 25);
            ScriptServices.callGenericService(res, 705).then(function(data) {
                $ionicLoading.hide();
                $scope.employeeReservationList = ((data.data || {}).AllBookingList || []);
            }, function(error) {
                $ionicLoading.hide();
                $scope.employeeReservationList = [];
            });
        });
    }

    function init(params) {
        getEmployee();
        $ionicModal.fromTemplateUrl('js/commons/modalTemplates/reservationEmployeeModal.html', {
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
