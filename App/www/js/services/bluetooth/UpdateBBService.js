angular.module('starter').service("UpdateBBService", function($q, $rootScope, ScriptServices) {

    function checkIsExistingRequest(bookings) {
       var TKN = localStorage.getItem('updateBB');
       if (TKN) {
            var tknObj = JSON.parse(atob(TKN));
            console.log("tknObj", tknObj);
            var iteractionFound;
            dance:
            for (var k = 0; k < bookings.length; k++) {
                if (bookings[k].pnr === tknObj.data.rid && ((bookings[k].status === 'Booked' && tknObj.ty === 101) || (bookings[k].status === 'Collected' && tknObj.ty === 102))) {
                    /* iteractionFound = bookings[k]; */
                    updateBBWithTKN({TKN: TKN});
                    break dance;
                }
                
            }
            

/*             setTimeout(() => {
                if (iteractionFound) {
                    iteractionFound = null;
                    deleteExistingRequest();
                }
                
            }, 1000); */
       }
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

    function updateBBWithTKN(interaction) {
        var tknObj = JSON.parse(atob(interaction.TKN));
        console.log("tknObj", tknObj);
        if (tknObj.ty === 101) {
            pickupUpdate(tknObj, interaction.TKN);
        } else {
            returnUpdate(tknObj, interaction.TKN);
        }
    }

    function pickupUpdate(tknObj, TKN) {
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
                $rootScope.$broadcast('refreshBookings', {resultStatus: 'OK'});
                console.log('i updateBB');
            }, function(error) {
                setUpdateRequest(TKN);
                console.log('i updateBB, error');
            });
        });
    }


    function returnUpdate(tknObj, TKN) {

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
                $rootScope.$broadcast('refreshBookings', {resultStatus: 'OK'});
            }, function(error) {
                setUpdateRequest(TKN);
                console.log('i updateBB, error');
            });
        });
    }

    return {
        setUpdateRequest: function (TKN) {
            return setUpdateRequest(TKN);
        },
        checkIsExistingRequest: function (bookings) {
            return checkIsExistingRequest(bookings);
        },
        updateBBWithTKN: function (interaction) {
            return updateBBWithTKN(interaction);
        }
    };

});
