angular.module('starter').controller('LoginCtrl', function($scope, $rootScope, InfoFactories, $http, $state, $ionicLoading, WebService, $ionicPopup) {
    function init(){
        $scope.locale = window.locale;
        $scope.recorveryPassword = false;
        $scope.request = {};

        var c = eval('('+window.localStorage.getItem('selclient')+')');  
        if(c) {
            InfoFactories.setClientSelected(c);
            InfoFactories.setServer(c.value.toLowerCase());
        }
        
        var userId = window.localStorage.getItem('Nr');
        if (userId != null && userId != '') {
            $state.go('tab.bookings');
        }
    }

    init();

    $scope.recorveryPasswordOn = function(){
        $scope.recorveryPassword = !$scope.recorveryPassword;
        $scope.request.email = undefined;
        $scope.loginError = false;
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
        $ionicLoading.show();
        $http.get("res/614.xml").success(function(res) {
			res = res.replace('{DOMAIN}', $scope.request.user.replace(/.*@/, ""));
			WebService.ajaxPostRequestDemo(res, 614, function(c) {
				InfoFactories.setClientSelected(c);
                $scope.selectedClient = c;
                InfoFactories.setServer(c.value.toLowerCase());
                window.localStorage.setItem('selclient', JSON.stringify(c));
                if(action === 'login'){
                    callLoginService($scope.request.user, $scope.request.password);
                }else if(action === 'recover'){
                    recoverPassowrd();
                }
                
			});
		});
        
    }
    
    $scope.login = function() {
        if($scope.request.user && $scope.request.password){
            getClientInfo('login');
        }else if(!$scope.request.user){
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
        $scope.loginError = false;
        WebService.ccsLogin(user, pw, function() {  
            $http.get('res/567.xml').success(function(res) {  
                $ionicLoading.hide();
        
                var Nr = window.localStorage.getItem('Nr');
                var pushId = window.localStorage.getItem('pushId');
                res = res.replace('{USER_ID}', Nr);
                res = res.replace('{PUSH_ID}', pushId);
                WebService.ajaxPostRequest(res, 567, null);
                        
                $state.go('tab.bookings');

            });
        }, function(error) {
            $ionicLoading.hide();
            $scope.loginError = true;
        });
    }
})