angular.module('starter').controller('EditPasswordCtrl', function(RegexService, $filter, $ionicHistory, InfoFactories, ScriptServices, $state, $scope, PopUpServices, $ionicLoading) {
   $scope.userInfo = InfoFactories.getUserInfo();
   $scope.request = {};
   setTimeout(function() {$('#oldPassword').focus(); });


   $scope.edit = function(){
        if(!$scope.request.oldPassword || !$scope.request.newPassword || !$scope.request.confirmedPassword){
            PopUpServices.errorPopup($filter('translate')('editPassword.mandatory'), "1");
            setTimeout(function() {$('#newPassword').focus(); });
        }else if(($scope.userInfo && $scope.userInfo.registry) && $scope.userInfo.registry.password !== $scope.request.oldPassword){
            PopUpServices.errorPopup($filter('translate')('editPassword.oldPasswordInvalid'), "1");
        }else if($scope.request.newPassword !== $scope.request.confirmedPassword){
            PopUpServices.errorPopup($filter('translate')('editPassword.passwordNoMatch'), "1");
        }else if($scope.request.confirmedPassword && !$scope.request.confirmedPassword.match(RegexService.getRegex().password)){
            PopUpServices.messagePopup($filter('translate')('commons.messageInvalidPassword'), $filter('translate')('commons.attention'));
        }else{
           callEditService($scope.request.newPassword);
       }
   };

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
                PopUpServices.messagePopup($filter('translate')('editPassword.editSuccess'), $filter('translate')('commons.success'), returnBooking);
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('editPassword.editFail'));
            })
        });
   };

   function returnBooking (){
       $state.go('tab.bookings');
   }


})