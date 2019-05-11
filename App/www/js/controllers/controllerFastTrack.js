angular.module('starter').controller('FastTrackCtrl', function(InfoFactories, ScriptServices, $state, $scope, $ionicLoading) {
    $scope.userInfo = InfoFactories.getUserInfo();


    $scope.cancel = function(){
        $state.go("tab.bookings");
    };
 
    
    function getCarInfo(device){
         ScriptServices.getXMLResource(670).then(function(res) {
             res = res.replace('{BLEID}', device.id);
             ScriptServices.callGenericService(res, 670).then(function(data) {
                 if (!$scope.firstSearch) {
                    $scope.items.push(data.data.carInfo);
                    $scope.firstSearch = true;
                 }
             }, function(error) {
             });
         });
    };

    $scope.startScan = function() {
        $scope.firstSearch = false;
        $scope.$broadcast('scroll.refreshComplete');
        $scope.items = [];
        ble.startScan([], function(device) {
            getCarInfo(device);
            
        }, function() { 
            console.log("stopScan failed");
        });
        
        setTimeout(ble.stopScan,
            2000,
            function() { 
                console.log("Scan complete"); 
            },
            function() { 
                console.log("stopScan failed");
            }
        );
    }
 
});