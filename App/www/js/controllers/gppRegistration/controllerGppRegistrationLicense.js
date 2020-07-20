angular.module('starter').controller('GppRegistrationLicenseCtrl', function(PopUpServices, $state, $filter, InfoFactories, LovServices ,$ionicPopup, DatePikerServices, $scope, GppRegistrationService) {
    $scope.request = GppRegistrationService.getRegistrationInfo();
    $scope.selectedClient = InfoFactories.getClientSelected();
    $scope.nazioni = LovServices.getNations();

    $scope.selectDate = function(input) {
        DatePikerServices.selectDate(input).then(function (date) {
            $scope.request[input] = date;
        }, function err() {
            
        });
    };

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
        } else {
            GppRegistrationService.setRegistrationInfo($scope.request);
            $state.go('gppRegistrationTerms');
        }
    }

    /* $scope.uploadImage = function() {
        onDeviceReady: function() {
            // Method below REQUIRES elements we removed from body in index.html
            // So we comment it out.
            // this.receivedEvent('deviceready');
    
            let options = {
                x: 0,
                y: 0,
                width: window.screen.width,
                height: window.screen.height,
                camera: CameraPreview.CAMERA_DIRECTION.BACK,  // Front/back camera
                toBack: true,   // Set to true if you want your html in front of your preview
                tapPhoto: false,  // Tap to take photo
                tapFocus: true,   // Tap to focus
                previewDrag: false
            };
    
            var flash_mode = 'off';
            // Take a look at docs: https://github.com/cordova-plugin-camera-preview/cordova-plugin-camera-preview#methods
            CameraPreview.startCamera(options);
    
    
            // Create a rectangle & buttons
            var rect = document.createElement('div');
            var take_pic_btn = document.createElement('img');
            var flash_on_btn = document.createElement('img');
            var flash_off_btn = document.createElement('img');
    
            // You must specify path relative to www folder
            take_pic_btn.src = 'img/take_photo.png';
            flash_on_btn.src = 'img/flash_on.svg';
            flash_off_btn.src = 'img/flash_off.svg';
    
            // Add styles
            rect.className += 'rect_class';
            take_pic_btn.className += ' take_pic_class'
            flash_on_btn.className += ' flash_class'
            flash_off_btn.className += ' flash_class'
    
            // Hide flash_off btn by default
            flash_off_btn.style.visibility = 'hidden';
    
            // Append to body section
            document.body.appendChild(rect);
            document.body.appendChild(take_pic_btn);
            document.body.appendChild(flash_on_btn);
            document.body.appendChild(flash_off_btn);
    
            // Get rectangle coordinates
            var rect_coords = rect.getBoundingClientRect();
            var x_coord = rect_coords.left, y_coord = rect_coords.top;
    
            take_pic_btn.onclick = function(){
                // Get rectangle size
                var rect_width = rect.offsetWidth, rect_height = rect.offsetHeight;
    
                CameraPreview.takePicture(function(base64PictureData) {
    
                    // We pass width, height, x and y coordinates of our rectangle to crop method
                    // At the very end, crop methods send cropped image to server
                    var cropped_img = crop(base64PictureData, rect_width, rect_height, x_coord, y_coord, function(cropped_img_base64) {
    
                        // Ending slash is necessary
                        $.post("http://192.168.42.25:8000/api/images/create/",
                            {
                                // Data sent along with a request
                                image: cropped_img_base64
                            },
                            function(data, status, xhr) {
                                // Success callback
                                alert('Status: ' + status + '\nData: ' + data);
                            }
                        )
                        .fail(function(error, status, xhr) {
                            // Failure callback
                            alert('Status: ' + status + '\nReason: ' + xhr);
                        });
    
                    });
                });
            };
    
            flash_on_btn.onclick = function() {
                flash_mode = 'on';
                flash_off_btn.style.visibility = 'visible';
                flash_on_btn.style.visibility = 'hidden';
    
                CameraPreview.setFlashMode(flash_mode);
            }
    
            flash_off_btn.onclick = function() {
                flash_mode = 'off';
                flash_off_btn.style.visibility = 'hidden';
                flash_on_btn.style.visibility = 'visible';
    
                CameraPreview.setFlashMode(flash_mode);
            }
        }
    
        // Update DOM on a Received Event
        
    } */

    /* receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    } */
})