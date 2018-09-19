angular.module('starter').factory("ScriptServices", function ($q, $http, InfoFactories, $state) {
    function getXMLResource(scriptID) {
        var scriptPath = "res/" + scriptID + ".xml";
        return $q(function (resolve, reject) {
            $http.get(scriptPath).success(function (res) {
                if (res) {
                    resolve(res);
                } else {
                    reject('Error');
                }
            });
        });
    };

    function directWithOutScriptID(scriptID, server) {
        if(window.serverRootLocal){
            var requestGET = getLocalJson(scriptID);
            return $q(function (resolve, reject) {
                $http(requestGET).then(function successCallback(response) {
                    var resultValue = response.data;
                    if (resultValue.retcode || resultValue.retcode === 0) {
                        if (resultValue.retcode == '-1' || resultValue.retcode == '-2') {
                            reject('Error');
                        }else if (resultValue.retcode == '401') {
                            $state.go('login', {error401:true});
                        }else {
                            resolve(resultValue);
                        }
                    } else {
                        resolve(resultValue);
                    }
                }, function errorCallback(response) {
                    reject("ErrorStatus:"+response.status+", ErrorText"+response.statusText+", Url:" + response.config.url);
                });
            });
        }else{
            var request = headerGET(scriptID, 0, server);
            return $q(function (resolve, reject) {
                $http(request).then(function successCallback(response) {
                    var resultValue = response.data.d.ExecuteAdminScript.ResultValue;
                    if (resultValue) {
                        resultValue = JSON.parse(response.data.d.ExecuteAdminScript.ResultValue);
                        if (resultValue.retcode == '-1' || resultValue.retcode == '-2') {
                            reject('Error');
                        }else if (resultValue.retcode == '401') {
                            $state.go('login', {error401:true});
                        }else {
                            resolve(resultValue);
                        }
                    } else {
                        reject('Error');
                    }

                }, function errorCallback(response) {
                    reject("ErrorStatus:"+response.status+", ErrorText"+response.statusText+", Url:" + response.config.url);
                });
            });
        }
    };

    function callGenericService(res, scriptID, server) {
        if (window.serverRootLocal) {
            var requestGET = getLocalJson(scriptID);
            return $q(function (resolve, reject) {
                $http(requestGET).then(function successCallback(response) {
                    var resultValue = response.data;
                    if (resultValue.retcode || resultValue.retcode === 0) {
                        if (resultValue.retcode == '-1' || resultValue.retcode == '-2') {
                            reject('Error');
                        }else if (resultValue.retcode == '401') {
                            $state.go('login', {error401:true});
                        }else {
                            resolve(resultValue);
                        }
                    } else {
                        resolve(resultValue);
                    }
                }, function errorCallback(response) {
                    reject("ErrorStatus:"+response.status+", ErrorText"+response.statusText+", Url:" + response.config.url);
                });
            });
        } else {
            var request = headerPOST(res, server);
            return $q(function (resolve, reject) {
                $http(request).then(function successCallback(response) {
                    var requestGET = headerGET(scriptID, response.data.d.Id, server);
                    $http(requestGET).then(function successCallback(response) {
                        var resultValue = response.data.d.ExecuteAdminScript.ResultValue;
                        if (resultValue) {
                            resultValue = JSON.parse(response.data.d.ExecuteAdminScript.ResultValue);
                            if (resultValue.retcode == '-1' || resultValue.retcode == '-2') {
                                reject('Error');
                            }else if (resultValue.retcode == '401') {
                                $state.go('login', {error401:true});
                            }else {
                                resolve(resultValue);
                            }
                        } else {
                            reject('Error');
                        }
                    }, function errorCallback(response) {
                        reject("ErrorStatus:"+response.status+", ErrorText"+response.statusText+", Url:" + response.config.url);
                    });
                }, function errorCallback(response) {
                    reject("ErrorStatus:"+response.status+", ErrorText"+response.statusText+", Url:" + response.config.url);
                });
            });
        }

    };

    function getLocalJson(scriptID) {
        return {
            url: "server/" + scriptID + ".json",
            method: "GET"
        }
    }

    function headerGET(scriptID, callCode, server) {
        return {
                    url: (InfoFactories.getClientSelected() && InfoFactories.getClientSelected().serverProtocol? (InfoFactories.getClientSelected() || {}).serverProtocol : "https") + "://" + (server || InfoFactories.getServer()) + ".corporatecarsharing.biz/api.svc/ExecuteAdminScript?scriptId=" + scriptID + "&scriptParameterSetId=" + callCode,
                    headers: { 'TenForce-Auth': 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4' , 'Cache-Control' : 'no-cache'},
                    method: "GET"
        }
    }

    function headerPOST(res, server) {
        return {
            url: (InfoFactories.getClientSelected() && InfoFactories.getClientSelected().serverProtocol ? (InfoFactories.getClientSelected() || {}).serverProtocol : "https") + '://' + (server || InfoFactories.getServer()) + '.corporatecarsharing.biz/api.svc/ScriptParameterSets',
            method: "POST",
            data: res,
            headers: {
                'TenForce-Auth': 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4',
                'Content-Type': 'application/atom+xml',
                'Cache-Control' : 'no-cache'
            }
        }
    }

    
    function generateUUID4() {
        var fmt = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        return fmt.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
        });
    }

    return {
        generateUUID4: function(){
            return generateUUID4();
        },
        getXMLResource: function (scriptID) {
            return getXMLResource(scriptID);
        },
        callGenericService: function (res, scriptID, server) {
            return callGenericService(res, scriptID, server);
        },
        directWithOutScriptID: function (scriptID, server) {
            return directWithOutScriptID(scriptID, server);
        }
    };

});