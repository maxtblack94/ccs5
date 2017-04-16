angular.module('starter').controller('LoginCtrl', function($scope, $ionicPush, $rootScope, PopUpServices, InfoFactories, $http, $state, $ionicLoading, WebService, $ionicPopup) {
    function init(){
        $scope.locale = window.locale;
        $scope.recorveryPassword = false;
        $scope.request = {};
        var c = eval('('+window.localStorage.getItem('selclient')+')');  
        if(c) {
            InfoFactories.setClientSelected(c);
            InfoFactories.setServer(c.value.toLowerCase());
            registerPushID();
        }else{
            $ionicLoading.show();
            $http.get("res/589.xml").success(function(res) {
                res = res.replace('{LANGUAGE}', 'Italiano');
                WebService.ajaxPostRequestDemo(res, 589, function(data) {
                    $ionicLoading.hide();
                    $scope.clientList = data.clientListBooking;
                });
            });
            $scope.configCompanyAccount = true;
        }
        InfoFactories.applyClientStyle('css/stylesheet.css')        
        var userId = window.localStorage.getItem('Nr');
        if (userId) {
            $state.go('tab.bookings');
        }
    }

    $scope.verifyCompanyCode = function(){
        if(!$scope.request.verifyCode){
            setTimeout(function() {
                $('#verifyCode-input').focus();
            });
        }else{
            for (var i = 0; i < $scope.clientList.length; i++) {
                var element = $scope.clientList[i];
                if($scope.request.verifyCode === $scope.clientList[i].clientCode){
                    InfoFactories.setClientSelected($scope.clientList[i]);
                    InfoFactories.setServer($scope.clientList[i].value.toLowerCase());
                    window.localStorage.setItem('selclient', JSON.stringify($scope.clientList[i]));
                    $scope.configCompanyAccount = false;
                    break;
                }
            }
        }
    }

    init();

    $scope.recorveryPasswordOn = function(){
        $scope.recorveryPassword = !$scope.recorveryPassword;
        $scope.request = {};
    } 

    $scope.callRecoverService = function(){
        if(!$scope.request.email){
            setTimeout(function() {
                $('#email-input').focus();
            });
        }else{
            getClientInfo('recover');
        }
    }

    function recoverPassowrd(){
        $ionicLoading.show();
        $http.get("res/591.xml").success(function(res) {
            res = res.replace('{EMAIL}', $scope.request.email);
            WebService.ajaxPostRequestTemp(res, 591, function(data) {
                var pnrPopup = $ionicPopup.alert({
                    title: 'Esito richiesta',
                    template: data
                });
                pnrPopup.then(function(res) {
                    $scope.recorveryPasswordOn();
                });
                $ionicLoading.hide();
                
            });
        });
    }

    getClientInfo = function(action){
        if(action === 'login'){
            callLoginService($scope.request.userid, $scope.request.password);
        }else if(action === 'recover'){
            recoverPassowrd();
        }
    }
    
    $scope.login = function() {
        if($scope.request.userid && $scope.request.password){
            getClientInfo('login');
        }else if(!$scope.request.userid){
            setTimeout(function() {
                $('#user-input').focus();
            });
        }else if(!$scope.request.password){
            setTimeout(function() {
                $('#password-input').focus();
            });
        }
    };

    function callLoginService(user, pw){
        $ionicLoading.show();
        WebService.ccsLogin(user, pw, function() {  
            registerPushID();
            $state.go('tab.bookings');
            $ionicLoading.hide();            
        }, function(error) {
            $ionicLoading.hide();
            PopUpServices.errorPopup('Email/Password sono errati, riprovare!')
        });
    }

    function storeToken (pushId){
        $http.get('res/567.xml').success(function(res) {  
            var Nr = window.localStorage.getItem('Nr');
            res = res.replace('{USER_ID}', Nr);
            res = res.replace('{PUSH_ID}', pushId);
            WebService.ajaxPostRequest(res, 567, null);
        });
    }


    function registerPushID (){
        $ionicPush.register().then(function(t) {
            storeToken(t.token);
            return $ionicPush.saveToken(t);
        }).then(function(t) {
            storeToken(t.token);
            console.log('Token saved:', t.token);
        });
    }
})