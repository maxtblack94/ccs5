angular.module('starter').factory("InfoFactories", [function () {
    var parking, selectedCar, dateTimeFrom, dateTimeTo,
    telepass = false, 
    CC = false, 
    selectedVehicleType = { value: null },
    selectedRangeDriver = { value: 'short' },
    lastDeviceCoords;

    function isLoggedUser() {
        return window.localStorage.getItem('userInfo')? true: false;
    }

    function isRegionalSilver() {
        userInfo = getUserInfo();
        var isSilver = false;
        if (((userInfo.registry || {}).services || []) && userInfo.registry.services.length > 0) {
            for (var k = 0; k < userInfo.registry.services.length; k++) {
                isSilver = userInfo.registry.services[k].tarifs.find(function (item) {
                    return item.text === 'Gold';
                });
                if (isSilver) {
                    break;
                }
            }
        }
        return isSilver ? true: false;
        
    }

    function resetService (){
        parking = undefined, selectedCar = undefined, telepass = false, CC = false, selectedRangeDriver = { value: 'short' },
        dateTimeFrom = undefined, dateTimeTo = undefined, selectedVehicleType = { value: null };
        return;
    };
    function applyClientStyle (url){
        if(!url){
            url = 'css/stylesheet.css'
        }
        var cssId = 'myCss';  // you could encode the css path itself to generate id..
        if (!document.getElementById(cssId)){
            var head  = document.getElementsByTagName('head')[0];
            var link  = document.createElement('link');
            link.id   = cssId;
            link.rel  = 'stylesheet';
            link.type = 'text/css';
            link.href = url;
            link.media = 'all';
            head.appendChild(link);
        }
    };
    function setDateTimeFrom(varDate) {
        dateTimeFrom = varDate;
    };
    function getDateTimeFrom() {
        return window.serverRootLocal ? "16/11/2018 14:40:00" : dateTimeFrom;
    };
    function setDateTimeTo(varDate) {
        dateTimeTo = varDate;
    };
    function getDateTimeTo() {
        return window.serverRootLocal ? "16/11/2018 17:40:00" : dateTimeTo;
    };
    function setPark(varPark) {
        
        if(varPark.opening == "00:00" && varPark.closing == "23:59"){
            varPark.h24 = true;
        }else{
            varPark.opening = new Date(moment(varPark.opening, 'DD/MM/YYYY HH:mm:ss'));
            varPark.closing = new Date(moment(varPark.closing, 'DD/MM/YYYY HH:mm:ss'));
        }
        parking = varPark;
    };
    function getPark() {
        return parking;
    };
    function getClientSelected() {
        return JSON.parse(window.localStorage.getItem('selectedClient'));
    };
    function getUserInfo() {
        return JSON.parse(window.localStorage.getItem('userInfo')) || {};
    };
    function getServer() {
        if (window.localStorage.getItem('selectedClient')) {
            return JSON.parse(window.localStorage.getItem('selectedClient')).serverName.toLowerCase();
        }else{
            return undefined;
        }
    };
    function setSelectedCar(varCar) {
        selectedCar = varCar;
    };
    function getSelectedCar() {
        return selectedCar;
    };
    function setSelectedVehicleType(type){
        selectedVehicleType = type;
    }
    function getSelectedVehicleType(){
        return selectedVehicleType;
    }
    function setCC(varCC) {
        CC = varCC;
    };
    function getCC() {
        return CC;
    };
    function setTelepass(varTelepass) {
        telepass = varTelepass;
    };
    function getTelepass() {
        return telepass;
    };
    function setSelectedRangeDriver(varRangeDriver) {
        selectedRangeDriver = varRangeDriver;
    };
    function getSelectedRangeDriver() {
        return selectedRangeDriver;
    };

    function getLastDeviceCoords (){
        return lastDeviceCoords;
    };

    function setLastDeviceCoords (coords){
        lastDeviceCoords = coords;
    }
    

    return {
        getLastDeviceCoords: function () {
            return getLastDeviceCoords();
        },
        setLastDeviceCoords: function (coords) {
            return setLastDeviceCoords(coords);
        },
        getPark: function () {
            return getPark();
        },
        setPark: function (varPark) {
            return setPark(varPark);
        },
        getPark: function () {
            return getPark();
        },
        getClientSelected: function () {
            return getClientSelected();
        },
        setSelectedCar: function (varCar) {
            return setSelectedCar(varCar);
        },
        getSelectedCar: function () {
            return getSelectedCar();
        },
        setCC: function (varCC) {
            return setCC(varCC);
        },
        getCC: function () {
            return getCC();
        },
        setTelepass: function (varTelepass) {
            return setTelepass(varTelepass);
        },
        getTelepass: function () {
            return getTelepass();
        },
        setSelectedRangeDriver: function (varRangeDriver) {
            return setSelectedRangeDriver(varRangeDriver);
        },
        getSelectedRangeDriver: function () {
            return getSelectedRangeDriver();
        },
        getServer: function () {
            return getServer();
        },
        setDateTimeFrom: function (vatDate) {
            return setDateTimeFrom(vatDate);
        },
        getDateTimeFrom: function () {
            return getDateTimeFrom();
        },
        setDateTimeTo: function (vatDate) {
            return setDateTimeTo(vatDate);
        },
        getDateTimeTo: function () {
            return getDateTimeTo();
        },
        resetService: function () {
            return resetService();
        },
        applyClientStyle: function (url) {
            return applyClientStyle(url);
        },
        setSelectedVehicleType: function (type) {
            return setSelectedVehicleType(type);
        },
        getSelectedVehicleType: function () {
            return getSelectedVehicleType();
        },
        getUserInfo: function () {
            return getUserInfo();
        },
        isRegionalSilver: function (userInfo) {
            return isRegionalSilver(userInfo);
        },
        isLoggedUser: function () {
            return isLoggedUser();
        }
    };



}])