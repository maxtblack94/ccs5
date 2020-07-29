angular.module('starter').controller('GppRegistrationTermsCtrl', function($state, $filter, GppRegistrationService, InfoFactories, $ionicLoading, ScriptServices, pdfDelegate, $scope, PopUpServices) {
    $scope.request = GppRegistrationService.getRegistrationInfo();
    $scope.selectedClient = InfoFactories.getClientSelected();

    function getConsensi(){
        $ionicLoading.show();
        ScriptServices.getXMLResource(651).then(function(res) {
            res = res.replace('{DRIVERID}', null);
            ScriptServices.callGenericService(res, 651).then(function(data) {
                $scope.consent = data.data.acceptances.find(function (item) {
                    return item.step === "2"
                })
                $ionicLoading.hide();
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            });
        });
    }

    getConsensi();

    $scope.currentPage = function () {
        return pdfDelegate.$getByHandle('termsPdf').getCurrentPage();
    }

    $scope.totalPages = function () {
        return pdfDelegate.$getByHandle('termsPdf').getPageCount();
    }

    $scope.nextPage = function () {
        return pdfDelegate.$getByHandle('termsPdf').next();
    }

    $scope.zoomIn = function () {
        return pdfDelegate.$getByHandle('termsPdf').zoomIn();
    }

    $scope.zoomOut = function () {
        return pdfDelegate.$getByHandle('termsPdf').zoomOut();
    }
    
    $scope.proceed = function () {
        createCustomer();
    }

    function createCustomer() {
        $ionicLoading.show();
        ScriptServices.getXMLResource(645).then(function(res) {
            res = res.replace('{USERNAME}', $scope.request.email || null)
            .replace('{PASSWORD}', $scope.request.password || '')
            .replace('{EMAIL}', $scope.request.email || '')
            .replace('{LASTNAME}', $scope.request.lastName || '')
            .replace('{FIRSTNAME}', $scope.request.firstName || '')
            .replace('{GENDER}', $scope.request.gender.code || '')
            .replace('{BIRTHDATE}', moment($scope.request.birthDate).format('DD/MM/YYYY') || '')
            .replace('{TAXCODE}', $scope.request.taxCode || '')
            .replace('{IDIDENTITY}', $scope.request.idIdentity || 'NO')
            .replace('{IDIDENTITYTYPE}', $scope.request.docType.code || 'NO')
            .replace('{NUMBER}', $scope.request.number || 'NO')
            .replace('{ADDRESS}', $scope.request.address || '')
            .replace('{ZIPCODE}', $scope.request.zipCode || '')
            .replace('{CITY}', $scope.request.city || '')
            .replace('{COUNTRY}', $scope.request.nation || '')
            .replace('{LICENSENUMBER}', $scope.request.licenseNumber  || '')
            .replace('{LICENSEISSUED}', $scope.request.issuer || '')
            .replace('{LICENSECOUNTRY}', $scope.request.countryIssue || '')
            .replace('{LICENSEDATE}', moment($scope.request.licenseIssueDate).format('DD/MM/YYYY') || '')
            .replace('{LICENSEEXPIRE}', moment($scope.request.licenseEndDate).format('DD/MM/YYYY') || '')
            .replace('{ACCEPT1}', $scope.request.accept1 || '')
            .replace('{ACCEPT5}', 'YES')
            .replace('{BASE64Front}', $scope.request.licenseFront || '')
            .replace('{BASE64Retro}', $scope.request.licenseBack || '');
            ScriptServices.callGenericService(res, 645).then(function(data) {
                if(data.retcode === 5 || data.retcode === 2) {
                    PopUpServices.errorPopup($filter('translate')('commons.emailAlreadyUsed'));
                } else {
                    callLoginService($scope.request.email, $scope.request.password);
                }
                $ionicLoading.hide();
                
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            });
        });
    }

    function callLoginService(user, pw){
        $ionicLoading.show(); 
        ScriptServices.getXMLResource(515).then(function(res) {
            res = res.replace('{USER_NAME}', user).replace('{PASSWORD}', pw);
            ScriptServices.callGenericService(res, 515).then(function(data) {
                if(data.data.DriverList.length > 0){
                    var userInfo = {
                        driverNumber : data.data.DriverList[0].Nr
                    };
                    getUserInfo(userInfo, data.retcode && data.retcode === 2);
                }else{
                    PopUpServices.errorPopup($filter('translate')('login.dataWrong')+ $filter('translate')('commons.retry'));
                    $ionicLoading.hide(); 
                }
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            })
        });
    }

    function registerPushID (){
        if (window.plugins && window.plugins.OneSignal) {
            window.plugins.OneSignal.getIds(function(ids) {
                if (ids && ids.userId) {
                    ScriptServices.getXMLResource(567).then(function(res) {
                        var driverNumber = InfoFactories.getUserInfo().driverNumber;
                        res = res.replace('{USER_ID}', driverNumber).replace('{PUSH_ID}', ids.userId);
                        ScriptServices.callGenericService(res, 567);
                    });
                }
            });
        }
    }

    function getUserInfo(userInfo){
        ScriptServices.getXMLResource(554).then(function(res) {
            res = res.replace('{NUMBER_DRIVER}', userInfo.driverNumber);
            ScriptServices.callGenericService(res, 554).then(function(data) {
                userInfo.registry =  data.data.GetUser[0];
                $scope.userInfo = userInfo;
                window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
                registerPushID();
                PopUpServices.messagePopup($filter('translate')('commons.profileCreated'), $filter('translate')('commons.profileAlertModal1'), $scope.paymentModal());
                $ionicLoading.hide(); 
            }, function(error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
            })
        });
    }

    $scope.paymentModal = function (params) {
        var modalContent = `<div class="bt-content" style="padding: 20px; z-index: 9999; color: rgb(0, 0, 0);">`+ $filter('translate')('commons.paymentModalContent')+ ` `  + ($scope.selectedClient.contact || {}).telephone +`</div>
                <ion-item class="item-image">
                    <img src="icons/cartedicredito.png">
                </ion-item>`;
        var configObj = {
            "buttons": [{
                text: $filter('translate')('commons.cancel'),
                type: 'button-stable',
                onTap: function () {
                    $state.go('tab.bookings');
                }
            }, {
                text: '<b>'+$filter('translate')('gpp.proceed')+'</b>',
                type: 'button-positive',
                onTap: function () {
                    startPay();
                }
            }],
            "message": modalContent,
            "title": $filter('translate')('commons.paymentMethodTitle'),
            "cssClass": 'info'
        }
        PopUpServices.buttonsPopup(configObj);
    }

    function startPay() {   
        $ionicLoading.show();
        ScriptServices.getXMLResource(655).then(function(res) {
            res = res.replace('{DRIVERID}', $scope.userInfo.driverNumber || null);
            ScriptServices.callGenericService(res, 655).then(function(data) {
                window.open(data.data, '_system', 'location=yes');
                $state.go('tab.bookings');
                $ionicLoading.hide();
            }, function(error) {
                PopUpServices.errorPopup($filter('translate')('commons.retry'));
                $ionicLoading.hide();
            });
        });
    }
    
})