angular.module('starter').controller('ActionSheetCtrl', function ($ionicModal, ManipolationServices, DamageService, InfoFactories, PopUpServices, $ionicLoading, ScriptServices, $ionicPopup, $ionicActionSheet, $scope) {
    $scope.selectedClient = InfoFactories.getClientSelected();

    ScriptServices.directWithOutScriptID(628).then(function (data) {
        //leader
        var response = data.data;
        // da salvare con la scadenza window.sessionStorage.setItem('alertList', JSON.stringify(data.data));
        $scope.alertList = data.data;
    }, function (error) {
        //loader
        //gestione errore per le liste delle segnalazioni
    })

    $scope.alertActionSheet = function () {
        var hideSheet = $ionicActionSheet.show({
            buttons: $scope.actionButtons,
            titleText: $filter('translate')('actionSheet.chooseAlertType'),
            cancelText: ionic.Platform.isAndroid() ? "<i class='fa fa-times' aria-hidden='true'></i> {{ 'commons.close' | translate }}" : "{{ 'commons.close' | translate }}",
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index, obj) {
                switch (obj.type) {
                    case "cleanness":
                        hideSheet();
                        alertCleanness($scope.book.pnr);
                        break;
                    case "changeDriver":
                        hideSheet();
                        $ionicModal.fromTemplateUrl('js/directives/ccs-01-action-sheet/templates/changeDriver.html', {
                            scope: $scope
                        }).then(function (modal) {
                            changeDriver(modal);
                        });
                        break;
                    case "defect":
                        hideSheet();
                        DamageService.setOperationType({
                            "alertList": $scope.alertList,
                            "operationType" : "DEFECTIVE"
                        });
                        $ionicModal.fromTemplateUrl('js/directives/ccs-01-action-sheet/templates/hardDamage.html', {
                            scope: $scope
                        }).then(function (modal) {
                            alertDamage($scope.book, modal);
                        });
                        break;
                    case "damage":
                        hideSheet();
                        DamageService.setOperationType({
                            "alertList": $scope.alertList,
                            "operationType" : "FAULT"
                        });
                        $ionicModal.fromTemplateUrl('js/directives/ccs-01-action-sheet/templates/hardDamage.html', {
                            scope: $scope
                        }).then(function (modal) {
                            alertDamage($scope.book, modal);
                        });
                        break;
                    case "delay":
                        hideSheet();
                        setDelay($scope.book.pnr);
                        break;
                    default:
                        break;
                }
            }
        });

    };

    /*function changeDriver(reservationNumber) {
        $scope.changeDriver = {};
        var myPopup = $ionicPopup.show({
            templateUrl: "js/directives/ccs-01-action-sheet/templates/picklistDamageTemplate.html",
            title: 'Scegliere una tipologia di guasto...',
            scope: $scope,
            buttons: [
                {
                    text: 'Annulla',
                    type: 'button-stable',
                },
                {
                    text: '<b>Salva</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.changeDriver.value) {
                            e.preventDefault();
                        } else {
                            var obj = {
                                "type": "1",
                                "value" : $scope.data.value,
                                "pnr" : reservationNumber
                            }
                            sendAlert(obj);
                        }
                    }
                }
            ]
        });
    };*/

/*     function alertDefect(reservationNumber) {
        $scope.data = {};
        var myPopup = $ionicPopup.show({
            templateUrl: "js/directives/ccs-01-action-sheet/templates/picklistDamageTemplate.html",
            title: 'Scegliere una tipologia di difetto...',
            scope: $scope,
            buttons: [
                {
                    text: 'Annulla',
                    type: 'button-stable',
                },
                {
                    text: '<b>Salva</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.value) {
                            e.preventDefault();
                        } else {
                            var obj = {
                                "type": "1",
                                "value": $scope.data.value,
                                "pnr": reservationNumber
                            }
                            sendAlert(obj);
                        }
                    }
                }
            ]
        });
    } */

    function alertDamage(book, modal) {
        var modalObj = {
            "book": book,
            "modalInstance": modal,
            "callback": $scope.callback 
        }
        DamageService.setModalObj(modalObj)
        modal.show(book, modal);
    }

    function changeDriver(modal) {
        $ionicLoading.show();
        ScriptServices.getXMLResource(631).then(function (res) {
            res = res.replace('{PNR}', ManipolationServices.fixRequestParam($scope.book.pnr));
            ScriptServices.callGenericService(res, 631).then(function (data) {
                $ionicLoading.hide();
                $scope.currentModalData = {
                    "driversList": data.data,
                    "modalInstance": modal,
                    "callback": $scope.callback
                }
                modal.show();
            }, function (error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('actionSheet.driversNotFound'));
            })
        });
    }

    function alertCleanness(reservationNumber) {
        $scope.data = {};
        var myPopup = $ionicPopup.show({
            templateUrl: "js/directives/ccs-01-action-sheet/templates/picklistCleanTemplate.html",
            title : $filter('translate')('actionSheet.cleanNotify'),
            subTitle : $filter('translate')('actionSheet.selectCleanStatusInfo'),
            scope: $scope,
            buttons: [
                {
                    text: $filter('translate')('commons.cancel'),
                    type: 'button-stable',
                },
                {
                    text: '<b>{{ "commons.save" | translate}}</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.value) {
                            e.preventDefault();
                        } else {
                            var obj = {
                                "type": "0",
                                "value": $scope.data.value,
                                "pnr": reservationNumber
                            }
                            sendAlert(obj);
                        }
                    }
                }
            ]
        });
    }


    function sendAlert(info) {
        $ionicLoading.show();
        ScriptServices.getXMLResource(629).then(function (res) {
            res = res.replace('{PNR}', ManipolationServices.fixRequestParam(info.pnr))
            .replace('{STATUS}', ManipolationServices.fixRequestParam())
            .replace('{STATUSC}', ManipolationServices.fixRequestParam(info.value))
            .replace('{STATUSD}', ManipolationServices.fixRequestParam())
            .replace('{TOW}', ManipolationServices.fixRequestParam())
            .replace('{NOTES}', ManipolationServices.fixRequestParam());
            ScriptServices.callGenericService(res, 629).then(function (data) {
                var response = data.data;
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('actionSheet.successAlertSent'), "2");
            }, function (error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup($filter('translate')('actionSheet.failAlertSent'));
            })
        });
    }

    function setDelay(pnr) {
        $scope.contextPnr = angular.copy(pnr);
        $scope.dataDelay = {};
        var setDelayPopup = $ionicPopup.show({
            templateUrl: 'js/directives/ccs-01-action-sheet/templates/postDelay.html',
            title: $filter('translate')('actionSheet.delayNotify'),
            subTitle: $filter('translate')('actionSheet.delayNotifyInfo'),
            scope: $scope,
            buttons: [{
                text: $filter('translate')('commons.cancel'),
                type: 'button-stable',
            }, {
                text: '<b>{{ "commons.save" | translate}} </b>',
                type: 'button-positive',
                onTap: function (e) {
                    if (!$scope.dataDelay.value) {
                        e.preventDefault();
                    } else {
                        var obj = {
                            'pnr': pnr,
                            'time': $scope.dataDelay.value
                        }
                        callSetDelay(obj)
                    }
                }
            }]
        });

        function callSetDelay(delayInfo) {
            $ionicLoading.show();
            ScriptServices.getXMLResource(619).then(function (res) {
                res = res.replace('{PNR}', delayInfo.pnr).replace('{DELAY}', delayInfo.time);
                delete $scope.contextPnr;
                ScriptServices.callGenericService(res, 619).then(function (data) {
                    $ionicLoading.hide();
                    PopUpServices.messagePopup($filter('translate')('actionSheet.successDelaySent')), $filter('translate')('commons.success', $scope.callback());
                }, function (error) {
                    $ionicLoading.hide();
                    PopUpServices.errorPopup($filter('translate')('actionSheet.failDelaySent'));
                });
            });
        };
    }

});