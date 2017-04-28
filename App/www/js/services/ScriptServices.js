angular.module('starter').factory("ScriptServices", function($q, $http, InfoFactories) {
    function getXMLResource(scriptID) {
        var scriptPath = "res/"+scriptID+".xml";
        return $q(function(resolve, reject) {
            $http.get(scriptPath).success(function(res) {
                if (res) {
                    resolve(res);
                } else {
                    reject('Error');
                }
            });
        });
    };

    function callGenericService(res, scriptID) {
        var request = headerPOST(res);
        return $q(function(resolve, reject) {
        $http(request).then(function successCallback(response) {
            var requestGET = headerGET(scriptID, response.data.d.Id);
            $http(requestGET).then(function successCallback(response) {
                var resultValue = response.data.d.ExecuteAdminScript.ResultValue;
                if(resultValue){
                    resultValue = JSON.parse(response.data.d.ExecuteAdminScript.ResultValue);
                    if(resultValue.retcode == '-1' || resultValue.retcode == '-2'){
                        reject('Error');
                    }else{
                        resolve(resultValue);
                    }
                }else{
                    reject('Error');
                }
                    
                }, function errorCallback(response) {
                    reject('Error');
                });
            }, function errorCallback(response) {
                reject('Error');
            });
        });
    };

    function headerGET (scriptID, callCode){
        return {
            url: "http://"+InfoFactories.getServer()+".corporatecarsharing.biz/api.svc/ExecuteAdminScript?scriptId="+ scriptID +"&scriptParameterSetId=" + callCode,
            headers: {'TenForce-Auth': 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4'},
            method: "GET"
        }
    }

    function headerPOST (res){
        return {
            url: 'http://'+InfoFactories.getServer()+'.corporatecarsharing.biz/api.svc/ScriptParameterSets',
            method: "POST",
            data: res,
            headers: {
                'TenForce-Auth' : 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4', 
                'Content-Type' : 'application/atom+xml'
            }
        }
    }

    return {
        getXMLResource: function (scriptID) {
            return getXMLResource(scriptID);
        },
        callGenericService: function (res, scriptID) {
            return callGenericService(res, scriptID);
        }
    };



})
