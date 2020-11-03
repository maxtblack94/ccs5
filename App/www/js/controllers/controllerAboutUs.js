angular.module('starter').controller('aboutUsCtrl', function( $scope, InfoFactories,$ionicLoading,ScriptServices) {
    $scope.selectedClient = InfoFactories.getClientSelected();

    function getConsensi(){
        $ionicLoading.show();
        ScriptServices.getXMLResource(651).then(function(res) {
            res = res.replace('{DRIVERID}', null);
            ScriptServices.callGenericService(res, 651).then(function(data) {
                $scope.acceptances = data.data.acceptances;
                $ionicLoading.hide();
                $scope.textGPDR = $scope.acceptances[0].url
                $scope.textContract = $scope.acceptances[4].url
                console.log($scope.acceptances);
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            });
        });
    }

    getConsensi();


    $scope.openLinkGPDR = function () {
        window.open($scope.textGPDR , '_system', 'location=yes');
    } 

    $scope.openLinkContract = function () {
        window.open($scope.textContract , '_system', 'location=yes');
    } 



   

  
})