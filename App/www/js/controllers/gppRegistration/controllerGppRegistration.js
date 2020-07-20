angular.module('starter').controller('GppRegistrationCtrl', function($state, GppRegistrationService, RegexService, DatePikerServices, $ionicPopup, $filter, LovServices, InfoFactories, $ionicLoading, $scope, ScriptServices, PopUpServices) {
    function init() {
        $scope.selectedClient = InfoFactories.getClientSelected();
        $scope.nazioni = LovServices.getNations();
        $scope.request = {};
        getConsensi();
    }
    

    $scope.openUrl = function(url){
        if (url) {
            window.open(url, '_system', 'location=yes');
        }
    }

    $scope.selectDate = function(input) {
        DatePikerServices.selectDate(input).then(function (date) {
            $scope.request[input] = date;
        }, function err() {
            
        });
    };

    $scope.selectPicklistValue = function (picklist, title, subTitle) {
        var templateUrl;
        if (picklist === 'nation') {
            templateUrl = "templates/picklists/nation.html";
        } else if(picklist === 'docType') {
            templateUrl = "templates/picklists/documentType.html";
        } else if(picklist === 'gender') {
            templateUrl = "templates/picklists/gender.html"
        }

        $ionicPopup.show({
            templateUrl: templateUrl,
            title: title,
            subTitle: subTitle,
            cssClass: 'picklist',
            scope: $scope,
            buttons: [{
                text: $filter('translate')('commons.cancel'),
                type: 'button-stable',
            }, {
                text: '<b>'+$filter('translate')('commons.save')+'</b>',
                type: 'button-positive',
                onTap: function (e) {
                    if (!$scope.request.picklistValue) {
                        $scope.request.picklistValue = null;
                        e.preventDefault();
                    } else {
                        $scope.request[picklist] = $scope.request.picklistValue;
                        $scope.request.picklistValue = null;
                    }
                }
            }]
        });
    };

    function getConsensi(){
        $ionicLoading.show();
        ScriptServices.getXMLResource(651).then(function(res) {
            res = res.replace('{DRIVERID}', null);
            ScriptServices.callGenericService(res, 651).then(function(data) {
                GppRegistrationService.setLastCustomerResponse(data.data);
                $scope.acceptances = data.data.acceptances;
                $scope.documentsType = data.data.docType;
                $scope.gender = data.data.sexType;
                $ionicLoading.hide();
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            });
        });
    }

    $scope.isValid = function () {
        if (!$scope.request.password ||
            !$scope.request.confirmPassword ||
            /* !$scope.request.username || */
            !$scope.request.number ||
            !$scope.request.birthDate ||
            !$scope.request.address ||
            !$scope.request.firstName ||
            !$scope.request.lastName ||
            !$scope.request.gender ||
            !$scope.request.city ||
            !$scope.request.zipCode ||
            !$scope.request.nation ||
            !$scope.request.taxCode ||
            !$scope.request.docType ||
            !$scope.request.idIdentity
        ) {
            PopUpServices.messagePopup($filter('translate')('gpp.mandatoryFields'), $filter('translate')('commons.attention'));
        } else if($scope.request.password && !$scope.request.password.match(RegexService.getRegex().password)){
            PopUpServices.messagePopup($filter('translate')('gpp.attention'), $filter('translate')('commons.attention'));
        } else if ($scope.request.password !== $scope.request.confirmPassword ) {
            PopUpServices.messagePopup($filter('translate')('gpp.passwordMatch'), $filter('translate')('commons.attention'));
        } else if ($scope.request.email !== $scope.request.confirmEmail) {
            PopUpServices.messagePopup($filter('translate')('gpp.emailMatch'), $filter('translate')('commons.attention'));
        } else if(!$scope.request.zipCode.match(/^\d{5}$/)) {
            PopUpServices.messagePopup($filter('translate')('gpp.invalidZipCode'), $filter('translate')('commons.attention'));
        } else if(!$scope.request.email || !$scope.request.email.match(/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
            PopUpServices.messagePopup($filter('translate')('gpp.emailRegex'), $filter('translate')('commons.attention'));
        } else if($scope.request.accept1 !== 'YES') {
            PopUpServices.messagePopup($filter('translate')('gpp.consentsMandatory'), $filter('translate')('commons.attention'));
        } else {
            GppRegistrationService.setRegistrationInfo($scope.request);
            $state.go('gppRegistrationLicense');
        }
    }

    init();
})