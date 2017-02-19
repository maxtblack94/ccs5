angular.module('starter').controller('LoginCtrl', function($scope, $rootScope, InfoFactories, $http, $state, $ionicLoading, WebService) {
    $scope.locale = window.locale;
    function init(){
        $scope.request = {};
        $ionicLoading.show();
        $http.get("res/589.xml").success(function(res) {
            res = res.replace('{LANGUAGE}', 'Italiano');
            WebService.ajaxPostRequestDemo(res, 589, function(data) {
                $ionicLoading.hide();
                $scope.clientList = data.clientListBooking;
            });
        });

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
    
    $scope.switch = function() {
        InfoFactories.setClientSelected(null);
        InfoFactories.setServer(null);
        $scope.selectedClient = null;
        window.localStorage.setItem('selclient', null);
    };
    
    $scope.selectClient = function(index, c) {
        InfoFactories.setClientSelected(c);
        $scope.selectedClient = c;
        InfoFactories.setServer(c.value.toLowerCase());
        window.localStorage.setItem('selclient', JSON.stringify(c));
    };
    
    $scope.login = function() {
        if($scope.request.user && $scope.request.password){
            callLoginService($scope.request.user, $scope.request.password);
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