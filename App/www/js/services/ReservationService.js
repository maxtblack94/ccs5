
angular.module('starter').factory("ReservationService", function($ionicPopup, $filter) {
    var self = this;
    this.selectedService,
    this.selectedPark,
    this.selectedParkB,
    this.telepass = false,
    this.cc = false,
    this.driverRange = 'short',
    this.vehicleType,
    this.dateTimeFrom = window.serverRootLocal ? "2019-04-12T10:20:15.120Z" : undefined,
    this.dateTimeTo = window.serverRootLocal ? "2019-04-12T11:20:30.120Z" : undefined;

    function resetReservation() {
        self.selectedService = undefined;
        self.selectedPark = undefined;
        self.selectedParkB = undefined;
        self.telepass = false;
        self.cc = false;
        self.driverRange = 'short';
        self.vehicleType = undefined;
        self.dateTimeFrom = window.serverRootLocal ? "2019-03-12T00:21:15.120Z" : undefined;
        self.dateTimeTo = window.serverRootLocal ? "2019-03-12T00:21:30.120Z" : undefined;
    }

    return {
        resetReservation: function () {
            return resetReservation();
        },
        setService: function (service) {
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
        setParkB: function (parkB) {
            self.selectedParkB = parkB;
        },
        setTelepass: function (telepass) {
            self.telepass = telepass;
        },
        setCC: function (cc) {
            self.cc = cc;
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
        instance: self
    };
});
