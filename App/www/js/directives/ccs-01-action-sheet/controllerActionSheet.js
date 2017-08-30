angular.module('starter').controller('ActionSheetCtrl', function($ionicModal, DamageService, InfoFactories, PopUpServices, $ionicLoading, ScriptServices, $ionicPopup, $ionicActionSheet, $scope) {
    $scope.locale = window.locale;
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
            titleText: 'Segliere tipologia segnalazione..',
            cancelText: ionic.Platform.isAndroid() ? '<i class="fa fa-times" aria-hidden="true"></i> Chiudi':'Chiudi',
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
                        changeDriver($scope.book.pnr);
                        break; 
                    case "defect":
                        hideSheet();
                        alertDefect($scope.book.pnr);
                        break;
                    case "damage":
                        hideSheet();
                        $ionicModal.fromTemplateUrl('js/directives/ccs-01-action-sheet/templates/hardDamage.html', {
                            scope: $scope
                        }).then(function(modal) {
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

    function alertDefect(reservationNumber) {
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
                                "value" : $scope.data.value,
                                "pnr" : reservationNumber
                            }
                            sendAlert(obj);
                        }
                    }
                }
            ]
        });
    }

    function alertDamage(book, modal) {
        var modalObj = {
            "book":book,
            "modalInstance" : modal,
            "damageType": $scope.alertList.damage_type
        }
        DamageService.setModalObj(modalObj)
        modal.show(book, modal);
    }

    function alertCleanness(reservationNumber) {
        $scope.data = {};
        var myPopup = $ionicPopup.show({
            templateUrl: "js/directives/ccs-01-action-sheet/templates/picklistCleanTemplate.html",
            title: "Scegliere lo stato dell'auto...",
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
                                "type": "0",
                                "value" : $scope.data.value,
                                "pnr" : reservationNumber
                            }
                            sendAlert(obj);
                        }
                    }
                }
            ]
        });
    }
    

    function sendAlert(info){
        $ionicLoading.show();
        ScriptServices.getXMLResource(629).then(function (res) {
            res = res.replace('{PNR}', info.pnr);
            //Controllare la valorizzazione della request
            if(info.type === "1"){
                res = res.replace('{STATUS}', "Difetto");
                res = res.replace('{STATUSD}', info.value);
                res = res.replace('{STATUSC}', "");
            }else{
                res = res.replace('{STATUSC}', info.value);
                res = res.replace('{STATUS}', "");
            }
            ScriptServices.callGenericService(res, 629).then(function (data) {
                var response = data.data;
                $ionicLoading.hide();
                PopUpServices.errorPopup("Salvataggio effettuato con successo", "2");
            }, function (error) {
                $ionicLoading.hide();
                PopUpServices.errorPopup("Non è stato possibile salvare la segnalazione. Riprovare");
            })
        });
    }

    function setDelay(pnr) {
        $scope.contextPnr = angular.copy(pnr);
        $scope.dataDelay = {};
        var setDelayPopup = $ionicPopup.show({
            templateUrl: 'js/directives/ccs-01-action-sheet/templates/postDelay.html',
            title: 'Segnala ritardo',
            subTitle: "Quanto ritardo farai?",
            scope: $scope,
            buttons: [{
                text: 'Annulla',
                type: 'button-stable',
            }, {
                text: '<b>Segnala</b>',
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

        function callSetDelay(delayInfo){
            $ionicLoading.show();
            ScriptServices.getXMLResource(619).then(function(res) {
                res = res.replace('{PNR}', delayInfo.pnr).replace('{DELAY}', delayInfo.time);
                delete $scope.contextPnr;
                ScriptServices.callGenericService(res, 619).then(function(data) {
                    $ionicLoading.hide();
                    PopUpServices.messagePopup('Ritardo comunicato con successo','Successo', $scope.callback());
                }, function(error) {
                    $ionicLoading.hide();
                    PopUpServices.errorPopup('Non è stato possibile comunicare il ritrado, riprovare.');
                })
            });
        };
    }

})