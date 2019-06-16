angular.module('starter').service("UpdateBBService", function($q, $rootScope, ScriptServices) {

    function checkIsExistingRequest() {
       var updateBB = localStorage.getItem('updateBB');
       return updateBB ? true: false;
    }

    function setUpdateRequest(TKN) {
        localStorage.setItem('updateBB', TKN);
    }

    function getExistingToken() {
        return localStorage.getItem('updateBB');
    }

    function deleteExistingRequest() {
        localStorage.removeItem(updateBB);
    }

    function updateBB() {
        return $q(function(resolve, reject) {
            if (checkIsExistingRequest()) {
                var tknObj = JSON.parse(atob(getExistingToken));
                console.log("tknObj", tknObj);
                if (tknObj.ty === 0) {
                    pickupUpdate(tknObj, resolve, reject);
                } else {
                    returnUpdate(tknObj, resolve, reject);
                }
                resolve();
                console.log('i updateBB');
                deleteExistingRequest();
            } else {
                resolve();
            }
        });
        
    }

    function pickupUpdate(tknObj) {
        ScriptServices.getXMLResource(522).then(function(res) {
            res = res.replace('{PNR}', tknObj.rid)
            .replace('{BADGEID}', tknObj.bid)
            .replace('{DATA}', JSON.stringify(new Date(tknObj.et  * 1000 )))
            .replace('{IDZB}', tknObj.pid)
            .replace('{LAT}', tknObj.poi.geo.coordinates[0])
            .replace('{LONG}', tknObj.poi.geo.coordinates[1])
            .replace('{quality}', '100%');
            ScriptServices.callGenericService(res, 522).then(function(data) {
                console.log('updated');
            }, function(error) {

            });
        });
    }


    function returnUpdate(tknObj) {

        ScriptServices.getXMLResource(523).then(function(res) {
            res = res.replace('{PNR}', tknObj.rid)
            .replace('{BADGEID}', tknObj.pnr)
            .replace('{DATA}', JSON.stringify(new Date(tknObj.et  * 1000 )))
            .replace('{KM}', tknObj.pnr)
            .replace('{FUEL}', tknObj.pnr)
            .replace('{STATO}', tknObj.pnr)
            .replace('{STATOOP}', tknObj.pnr)
            .replace('{SLOT}', tknObj.pnr)
            .replace('{IDZB}', tknObj.pnr)
            .replace('{LAT}', tknObj.poi.geo.coordinates[0])
            .replace('{LONG}', tknObj.poi.geo.coordinates[1])
            .replace('{QUALITY}', tknObj.pnr);
            ScriptServices.callGenericService(res, 523).then(function(data) {

            }, function(error) {

            });
        });
    }

    return {
        updateBB: function () {
            return updateBB();
        },
        setUpdateRequest: function (TKN) {
            return setUpdateRequest(TKN);
        },
        checkIsExistingRequest: function () {
            return checkIsExistingRequest();
        },
    };

})