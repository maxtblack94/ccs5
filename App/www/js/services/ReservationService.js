
angular.module('starter').factory("ReservationService", function($ionicPopup, $filter) {
    var self = this;
    this.selectedService,
    this.selectedPark,
    this.selectedParkB,
    this.telepass = false,
    this.cc = false,
    this.isReservationWithMap = false,
    this.driverRange = {"value":{"text":"","code":"short"}},
    this.selectedTarif = {"value":{"text":"","id":""}},
    this.vehicleType = {"value":{"text":"","code":""}},
    this.preselectPark = {value : false},
    this.dateTimeFrom = window.serverRootLocal ? "2019-06-12T10:20:15.120Z" : undefined,
    this.dateTimeTo = window.serverRootLocal ? "2019-06-12T11:20:30.120Z" : undefined;
    this.dateFrom = window.serverRootLocal ? "2019-06-12" : undefined;
    this.timeFrom = window.serverRootLocal ? "11:20" : undefined;

    function resetReservation() {
        self.selectedService = undefined;
        self.selectedPark = undefined;
        self.selectedParkB = undefined;
        self.telepass = false;
        self.cc = false;
        self.isReservationWithMap = false;
        self.preselectPark = {value : false};
        self.driverRange = {"value":{"text":"","code":"short"}};
        self.selectedTarif = {"value":{"text":"","id":""}};
        self.vehicleType = {"value":{"text":"","code":""}};
        self.dateTimeFrom = window.serverRootLocal ? "2019-06-12T00:21:15.120Z" : null;
        self.dateTimeTo = window.serverRootLocal ? "2019-06-12T00:21:30.120Z" : null;
        self.dateFrom = window.serverRootLocal ? "2019-06-12" : undefined;
        self.timeFrom = window.serverRootLocal ? "11:20" : undefined;
    }

    return {
        resetReservation: function () {
            return resetReservation();
        },
        setService: function (service) {
            if (service && service.tarifs && service.tarifs.length) {
                this.setTarif({
                    value: service.tarifs[0]
                });
            }
            self.selectedService = service;
        },
        setPark: function (varPark) {
            if(varPark.opening == "00:00" && varPark.closing == "23:59"){
                varPark.h24 = true;
            }else{
                varPark.opening = new Date(moment(varPark.opening, 'DD/MM/YYYY HH:mm:ss'));
                varPark.closing = new Date(moment(varPark.closing, 'DD/MM/YYYY HH:mm:ss'));
            }
            self.selectedPark = varPark;
        },
        setParkB: function (varPark) {
            if (varPark) {
                if(varPark.opening == "00:00" && varPark.closing == "23:59"){
                    varPark.h24 = true;
                }else{
                    varPark.opening = new Date(moment(varPark.opening, 'DD/MM/YYYY HH:mm:ss'));
                    varPark.closing = new Date(moment(varPark.closing, 'DD/MM/YYYY HH:mm:ss'));
                }
            }
            
            self.selectedParkB = varPark;
        },
        setTelepass: function (telepass) {
            self.telepass = telepass;
        },
        setCC: function (cc) {
            self.cc = cc;
        },
        setIsReservationWithMap: function (isReservationWithMap) {
            self.isReservationWithMap = isReservationWithMap;
        },
        setDriverRange: function (driverRange) {
            self.driverRange = driverRange;
        },
        setVehicleType: function (vehicleType) {
            self.vehicleType = vehicleType;
        },
        setDateTimeFrom: function (dateTimeFrom) {
            self.dateTimeFrom = dateTimeFrom;
        },
        setDateTimeTo: function (dateTimeTo) {
            self.dateTimeTo = dateTimeTo;
        },
        setDateFrom: function (dateFrom) {
            self.dateFrom = dateFrom;
        },
        setTimeFrom: function (timeFrom) {
            self.timeFrom = timeFrom;
        },
        setTarif: function (tarif) {
            self.selectedTarif = tarif;
        },
        instance: self
    };
});
