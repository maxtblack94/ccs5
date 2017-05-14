angular.module('starter').controller('EditPasswordCtrl', function($ionicHistory, InfoFactories, ScriptServices, $state, $scope, PopUpServices, $ionicLoading) {
   $scope.locale = window.locale;
   $scope.userInfo = InfoFactories.getUserInfo();
   $scope.request = {};


   $scope.edit = function(){
       if(!$scope.request.oldPassword || !$scope.request.newPassword || !$scope.request.confirmedPassword){
            PopUpServices.errorPopup("Inserisci tutte le informazioni necessarie", "1");
       }else if(($scope.userInfo && $scope.userInfo.registry) && $scope.userInfo.registry.password !== $scope.request.oldPassword){
            PopUpServices.errorPopup("La vecchia password non è corretta", "1");
       }else if($scope.request.newPassword !== $scope.request.confirmedPassword){
            PopUpServices.errorPopup("La nuova password non coincide", "1");
       }else{
           callEditService($scope.request.newPassword);
       }
   }

   $scope.cancel = function(){
       if($ionicHistory.goBack()){
            $ionicHistory.goBack(); 
       }else{
           $state.go("tab.booking");
       }
       
   }

   function callEditService(password){
       $ionicLoading.show();
        ScriptServices.getXMLResource(577).then(function(res) {
            var driverNumber = InfoFactories.getUserInfo().driverNumber;
            res = res.replace('{NEWPASSOWRD}', password)
            .replace('{DRIVERNUMBER}', driverNumber);
            ScriptServices.callGenericService(res, 577).then(function(data) {
                $ionicLoading.hide();
                PopUpServices.messagePopup("Password modificata correttamente", "Successo", $state.go('tab.bookings'));
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup(error);
            })
        });
   };


})