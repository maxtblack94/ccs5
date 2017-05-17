angular.module('starter').controller('EditPasswordCtrl', function($ionicHistory, InfoFactories, ScriptServices, $state, $scope, PopUpServices, $ionicLoading) {
   $scope.locale = window.locale;
   $scope.userInfo = InfoFactories.getUserInfo();
   $scope.request = {};
   setTimeout(function() {$('#oldPassword').focus(); });


   $scope.edit = function(){
       if(!$scope.request.oldPassword || !$scope.request.newPassword || !$scope.request.confirmedPassword){
            PopUpServices.errorPopup("Inserisci tutte le informazioni necessarie", "1");
            setTimeout(function() {$('#newPassword').focus(); });
       }else if(($scope.userInfo && $scope.userInfo.registry) && $scope.userInfo.registry.password !== $scope.request.oldPassword){
            PopUpServices.errorPopup("La vecchia password non è corretta", "1");
       }else if($scope.request.newPassword !== $scope.request.confirmedPassword){
            PopUpServices.errorPopup("La nuova password non coincide", "1");
       }else{
           callEditService($scope.request.newPassword);
       }
   }

   $scope.cancel = function(){
       if($ionicHistory.viewHistory().backView){
            $ionicHistory.goBack(); 
       }else{
           $state.go("tab.bookings");
       }
       
   }

   function callEditService(password){
       $ionicLoading.show();
        ScriptServices.getXMLResource(557).then(function(res) {
            var driverNumber = InfoFactories.getUserInfo().driverNumber;
            res = res.replace('{NEWPASSOWRD}', password)
            .replace('{DRIVERNUMBER}', driverNumber);
            ScriptServices.callGenericService(res, 557).then(function(data) {
                ($scope.userInfo.registry || {}).password = data.data;
                window.localStorage.setItem('userInfo', JSON.stringify($scope.userInfo));
                $ionicLoading.hide();
                PopUpServices.messagePopup("Password modificata correttamente", "Successo", returnBooking);
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup("Non è stato possibile modificare la password");
            })
        });
   };

   function returnBooking (){
       $state.go('tab.bookings');
   }


})