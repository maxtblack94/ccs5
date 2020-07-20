angular.module('starter').factory("MapReservationService", function($ionicPopup, $filter) {
    var parkList = null;
    
    function setParks(parkList) {
        parkList = parkList;
    };

    function getParks() {
        return parkList;
     };

    return {
        setParks: function (parkList) {
            return setParks(parkList);
        },
        getParks: function () {
            return getParks();
        }
    };



})
