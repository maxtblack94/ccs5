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
        localStorage.removeItem('updateBB');
    }

    function updateBB() {
        return $q(function(resolve, reject) {
            if (checkIsExistingRequest()) {
                var tknObj = JSON.parse(atob(getExistingToken()));
                console.log("tknObj", tknObj);
                if (tknObj.ty === 101) {
                    pickupUpdate(tknObj, resolve, reject);
                } else {
                    returnUpdate(tknObj, resolve, reject);
                }
                
            } else {
                resolve();
            }
        });
        
    }

    function pickupUpdate(tknObj, resolve, reject) {
        ScriptServices.getXMLResource(522).then(function(res) {
            res = res.replace('{PNR}', tknObj.data.rid)
            .replace('{BADGEID}', tknObj.data.bid)
            .replace('{DATA}', JSON.stringify(new Date(tknObj.dd  * 1000 )))
            .replace('{IDZB}', null)
            .replace('{LAT}', tknObj.poi ? tknObj.poi.geo.coordinates[0] : -1)
            .replace('{LONG}', tknObj.poi ? tknObj.poi.geo.coordinates[1] : -1)
            .replace('{QUALITY}', tknObj.poi ? tknObj.poi.a : 0);
            ScriptServices.callGenericService(res, 522).then(function(data) {
                deleteExistingRequest();
                resolve();
                console.log('i updateBB');
            }, function(error) {
                resolve();
                console.log('i updateBB, error');
            });
        });
    }


    function returnUpdate(tknObj, resolve, reject) {

        ScriptServices.getXMLResource(523).then(function(res) {
            res = res.replace('{PNR}', tknObj.data.rid)
            .replace('{BADGEID}', tknObj.data.pnr)
            .replace('{DATA}', JSON.stringify(new Date(tknObj.dd  * 1000 )))
            .replace('{KM}', tknObj.data.odo || null)
            .replace('{FUEL}', tknObj.data.fl || -1)
            .replace('{STATO}', tknObj.data.iv || 0)
            .replace('{STATOOP}', tknObj.data.ic || 0)
            .replace('{SLOT}', 0)
            .replace('{IDZB}', null)
            .replace('{LAT}', tknObj.poi ? tknObj.poi.geo.coordinates[0] : -1)
            .replace('{LONG}', tknObj.poi ? tknObj.poi.geo.coordinates[1] : -1)
            .replace('{QUALITY}', tknObj.poi ? tknObj.poi.a : 0);
            ScriptServices.callGenericService(res, 523).then(function(data) {
                console.log('i updateBB');
                deleteExistingRequest();
                resolve();
            }, function(error) {
                resolve();
                console.log('i updateBB, error');
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