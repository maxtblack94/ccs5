angular.module('starter').factory("UpdateStatusBBService", function($ionicLoading, ScriptServices) {
    
    function processUpdate(interactionData) {
        var token = interactionData.interaction.TKN;
        var action = interactionData.operation;
        var tknObj = JSON.parse(atob(token));
        console.log("tknObj", tknObj);
        if (action === 'pushPNR') {
            pickupUpdate(tknObj);
        } else {
            returnUpdate(tknObj);
        }
    }

    function checkUpdateInSession(params) {
        console.log('check update in session');
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
        processUpdate: function (tkn, action) {
            return processUpdate(tkn, action);
        }
        
    };

})
