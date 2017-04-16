angular.module('starter').factory("InfoFactories", [function () {
    var parking, server, selectedClient, selectedCar, dateTimeFrom, dateTimeTo,
    telepass = false, 
    CC = false, 
    selectedRangeDriver = { value: 'short' };

    function resetService (){
        parking = undefined, server = undefined, selectedClient = undefined, selectedCar = undefined, telepass = false, CC = false, selectedRangeDriver = { value: 'short' },
        dateTimeFrom = undefined, dateTimeTo = undefined;
        return;
    };
    function applyClientStyle (url){
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
    function resetDateService (date){
        var d = new Date(date);
        var m = new Date(date);
        if(d.getMinutes() >= 0 && d.getMinutes() <= 14){
            m.setMinutes(15);
        }else if(d.getMinutes() >= 15 && d.getMinutes() <= 29){
            m.setMinutes(30);
        }else if(d.getMinutes() >= 30 && d.getMinutes() <= 44){
            m.setMinutes(45);
        }else if(d.getMinutes() >= 45 && d.getMinutes() <= 59){
            m.setMinutes(0);
            m.setHours(m.getHours()+1);
        }
        return m;      
    }
    function resetDateForDefect (date, dateFrom){
        var d = new Date(date);
        var m = new Date(date);
        dateFrom = new Date(dateFrom);
        if(d.getMinutes() >= 0 && d.getMinutes() <= 7){
            m.setMinutes(0);
        }else if(d.getMinutes() >= 8 && d.getMinutes() <= 19){
            m.setMinutes(15);
        }else if(d.getMinutes() >= 20 && d.getMinutes() <= 34){
            m.setMinutes(30);
        }else if(d.getMinutes() >= 35 && d.getMinutes() <= 48){
            m.setMinutes(45);
        }else if(d.getMinutes() >= 49 && d.getMinutes() <= 59){
            m.setMinutes(0);
            m.setHours(m.getHours()+1);
        }
        if(dateFrom && new Date(dateFrom).valueOf() === new Date(m).valueOf()){
            m = m.setMinutes(m.getMinutes() + 15);
        }
        return m;
    }
    function setDateTimeFrom(varDate) {
        dateTimeFrom = varDate;
    };
    function getDateTimeFrom() {
        return dateTimeFrom;
    };
    function setDateTimeTo(varDate) {
        dateTimeTo = varDate;
    };
    function getDateTimeTo() {
        return dateTimeTo;
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
    function setClientSelected(varSelectedClient) {
        selectedClient = varSelectedClient;
    };
    function getClientSelected() {
        return selectedClient || eval('('+window.localStorage.getItem('selclient')+')');
    };
    function setServer(varServer) {
        server = varServer;
    };
    function getServer() {
        return server || eval('('+window.localStorage.getItem('selclient')+')').value.toLowerCase();
    };
    function setSelectedCar(varCar) {
        selectedCar = varCar;
    };
    function getSelectedCar() {
        return selectedCar;
    };
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
    function trascodeFuel(value) {
        switch(value) {
            default: 
                break;
            case '0/4': 
                return '0%';
            case '1/4': 
                return '25%';
            case '2/4': 
                return '50%';
            case '3/4': 
                return '75%';
            case '4/4': 
                return '100%';
        }
    };

    return {
        setPark: function (varPark) {
            return setPark(varPark);
        },
        getPark: function () {
            return getPark();
        },
        setClientSelected: function (varSelectedClient) {
            return setClientSelected(varSelectedClient);
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
        setServer: function (varServer) {
            return setServer(varServer);
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
        trascodeFuel: function (fuel) {
            return trascodeFuel(fuel);
        },
        resetDateService: function (date) {
            return resetDateService(date);
        },
        resetDateForDefect: function (date, dateFrom) {
            return resetDateForDefect(date, dateFrom);
        },
        applyClientStyle: function (url) {
            return applyClientStyle(url);
        }
    };



}])
