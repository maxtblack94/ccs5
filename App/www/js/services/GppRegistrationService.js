angular.module('starter').factory("GppRegistrationService", function() {
    var registrationInfo, lastCustomerResponse;

    function setRegistrationInfo (info) {
        registrationInfo = info;
    }

    function getRegistrationInfo() {
        return registrationInfo
    }

    function getLastCustomerResponse() {
        return lastCustomerResponse;
    }

    function setLastCustomerResponse(customer) {
        lastCustomerResponse = customer;
    }
 
    return {
        setRegistrationInfo: function (info) {
            return setRegistrationInfo(info);
        },
        getRegistrationInfo: function () {
            return getRegistrationInfo();
        },
        getLastCustomerResponse: function () {
            return getLastCustomerResponse();
        },
        setLastCustomerResponse: function (customer) {
            return setLastCustomerResponse(customer);
        }
    };



})
