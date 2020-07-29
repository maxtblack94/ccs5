angular.module('starter').controller('GppRegistrationLicenseCtrl', function(PopUpServices, $state, $filter, InfoFactories, LovServices ,$ionicPopup, DatePikerServices, $scope, GppRegistrationService) {
    $scope.request = GppRegistrationService.getRegistrationInfo() || {};
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.nazioni = LovServices.getNations();

    $scope.selectDate = function(input, validations) {
        DatePikerServices.selectDate(input, validations).then(function (date) {
            $scope.request[input] = date;
        }, function err() {
            
        });
    };

    var currentLang = navigator.language.slice(0,2)
    $scope.getLang = function (item) {
        return (item.translations || {})[currentLang] || item.name || item.description;
    }

    $scope.selectPicklistValue = function (picklist, title, subTitle) {
        var templateUrl;
        if (picklist === 'countryIssue') {
            templateUrl = "templates/picklists/nation.html";
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

    $scope.isValid = function () {
        if (!$scope.request.licenseNumber ||
            !$scope.request.issuer ||
            !$scope.request.countryIssue ||
            !$scope.request.licenseIssueDate ||
            !$scope.request.licenseEndDate
        ) {
            PopUpServices.messagePopup($filter('translate')('gpp.mandatoryFields'), $filter('translate')('gpp.attention'));
        } else if(!$scope.request.licenseFront || !$scope.request.licenseBack) {
            PopUpServices.messagePopup($filter('translate')('gpp.uploadMandatoryFiles'), $filter('translate')('gpp.attention'));
        } else {
            GppRegistrationService.setRegistrationInfo($scope.request);
            $state.go('gppRegistrationTerms');
        }
    }

    $scope.openCamera = function (licenseVar) {
        var options = {
            allowEdit: true,
            quality: 20,
            destinationType: Camera.DestinationType.FILE_URI,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            targetWidth: 1024,
            targetHeight: 800
        };

        navigator.camera.getPicture(function (imageData) {
            getBase64Image(imageData, function (params) {
                console.log();
                $scope.request[licenseVar] = params;
                $scope.$apply();
            })
        }, function (err) {
            console.log(err);
        }, options);
    }


    function getBase64Image(imgUrl, callback) {

        var img = new Image();
    
        // onload fires when the image is fully loadded, and has width and height
    
        img.onload = function(){
    
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL("image/png"),
              dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    
          callback(dataURL); // the base64 string
    
        };
    
        img.setAttribute('crossOrigin', 'anonymous'); //
        img.src = imgUrl;
    
    }
})