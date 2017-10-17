angular.module('starter').controller('HelpCtrl', function($scope, $http, $ionicLoading, InfoFactories, WebService) {
    $scope.locale = window.locale;
    $scope.selectedClient = InfoFactories.getClientSelected();

    $scope.openUrl = function(url){
        window.open(url, '_system', 'location=yes');
    }
    
    $scope.helpList = [{
        "title": "Come recuperare la password?",
        "description": "dsadsad ad sddsads ada dsd adsad sadsa dsad asdk sd sakdmsal dsklad ",
        "url": "http://google.it/"
    },{
        "title": "Account Bloccato?",
        "description": "das ds dsad sad sdsaas da dsda ad sa",
        "url": ""
    }];
    
})