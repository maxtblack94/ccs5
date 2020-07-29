angular.module('starter').factory("LovServices", [function () {

    function getNations (){
        return window.nationList;
    }

    function getProvinces (){
        return [{"nome":"AG"},{"nome":"AL"},{"nome":"AN"},{"nome":"AO"},{"nome":"AP"},{"nome":"AQ"},{"nome":"AR"},{"nome":"AT"},{"nome":"AV"},{"nome":"BA"},{"nome":"BG"},{"nome":"BI"},{"nome":"BL"},{"nome":"BN"},{"nome":"BO"},{"nome":"BR"},{"nome":"BS"},{"nome":"BT"},{"nome":"BZ"},{"nome":"CA"},{"nome":"CB"},{"nome":"CE"},{"nome":"CH"},{"nome":"CI"},{"nome":"CL"},{"nome":"CN"},{"nome":"CO"},{"nome":"CR"},{"nome":"CS"},{"nome":"CT"},{"nome":"CZ"},{"nome":"EN"},{"nome":"FE"},{"nome":"FG"},{"nome":"FI"},{"nome":"FM"},{"nome":"FO"},{"nome":"FR"},{"nome":"GE"},{"nome":"GO"},{"nome":"GR"},{"nome":"IM"},{"nome":"IS"},{"nome":"KR"},{"nome":"LC"},{"nome":"LE"},{"nome":"LI"},{"nome":"LO"},{"nome":"LT"},{"nome":"LU"},{"nome":"MB"},{"nome":"MC"},{"nome":"ME"},{"nome":"MI"},{"nome":"MN"},{"nome":"MO"},{"nome":"MS"},{"nome":"MT"},{"nome":"NA"},{"nome":"NO"},{"nome":"NU"},{"nome":"OG"},{"nome":"OR"},{"nome":"OT"},{"nome":"PA"},{"nome":"PC"},{"nome":"PD"},{"nome":"PE"},{"nome":"PG"},{"nome":"PI"},{"nome":"PN"},{"nome":"PO"},{"nome":"PR"},{"nome":"PS"},{"nome":"PT"},{"nome":"PU"},{"nome":"PV"},{"nome":"PZ"},{"nome":"RA"},{"nome":"RC"},{"nome":"RE"},{"nome":"RG"},{"nome":"RI"},{"nome":"RM"},{"nome":"RN"},{"nome":"RO"},{"nome":"RV"},{"nome":"SA"},{"nome":"SI"},{"nome":"SO"},{"nome":"SP"},{"nome":"SR"},{"nome":"SS"},{"nome":"SV"},{"nome":"TA"},{"nome":"TE"},{"nome":"TN"},{"nome":"TO"},{"nome":"TP"},{"nome":"TR"},{"nome":"TS"},{"nome":"TV"},{"nome":"UD"},{"nome":"VA"},{"nome":"VB"},{"nome":"VC"},{"nome":"VE"},{"nome":"VI"},{"nome":"VR"},{"nome":"VS"},{"nome":"VT"},{"nome":"VV"}];
    }

    function getDocumentType() {
        return [{description: 'Passaporto', code: 'CSO_001_001'}, {description: "Carta D'identità", code: 'CSO_001_002'}];
    }
    

    return {
        getNations: function () {
            return getNations();
        },
        getProvinces: function () {
            return getProvinces();
        },
        getDocumentType: function () {
            return getDocumentType();
        }
    };


}])