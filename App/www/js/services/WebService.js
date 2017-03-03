angular.module('starter').service('WebService', function($http, $q, InfoFactories) {
    return ({
        ccsLogin: ccsLogin,
        ajaxPostRequest: ajaxPostRequest,
        ajaxPostRequestDemo: ajaxPostRequestDemo,
        ajaxPostRequestTemp: ajaxPostRequestTemp,
        ajaxPostRequestDirect: ajaxPostRequestDirect
    });
    
    function ccsLogin(name, password, success, fail) {
        $http.get("res/515.xml").success(function(res) {
	    	res = res.replace('{USER_NAME}', name).replace('{PASSWORD}', password);
    		$http({
    			url: 'http://'+InfoFactories.getServer()+'.corporatecarsharing.biz/api.svc/ScriptParameterSets',
		        method: "POST",
		        data: res,
		        headers: {
                    'TenForce-Auth' : 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4', 
                    'Content-Type' : 'application/atom+xml'
                }
	    	}).success(function (data, status, headers, config) {
	    		var responsePromisee = $http.get("http://"+InfoFactories.getServer()+".corporatecarsharing.biz/api.svc/ExecuteAdminScript?scriptId=515&scriptParameterSetId=" + data.d.Id, {headers: {'TenForce-Auth': 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4'}});
	    		
                responsePromisee.success(function(data, status, headers, config) {
                    console.log(data.d.ExecuteAdminScript);
	    			var ResultValue = JSON.parse(data.d.ExecuteAdminScript.ResultValue);
	    			var DriverList = ResultValue.data.DriverList;
	    			if(DriverList.length > 0) {
	    				window.localStorage.setItem('Nr', DriverList[0].Nr);
	    				window.localStorage.setItem('user_name', name);
                        if(success)
                            success();
	    			}
                    else
                        fail();
	    		});
	        }).error(function(err) {
                console.log(err);
                fail();
            });
    	})
    }
    
    function ajaxPostRequestDirect(scriptId, callback) {
        var responsePromisee = $http.get("http://"+InfoFactories.getServer()+".corporatecarsharing.biz/api.svc/ExecuteAdminScript?scriptId="+scriptId+"&scriptParameterSetId=0", {headers: {'TenForce-Auth': 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4'}});
        responsePromisee.success(function(data, status, headers, config) {
            var ResultValue;
        
            if(scriptId != 553) {
                ResultValue = JSON.parse(data.d.ExecuteAdminScript.ResultValue);
                if(callback)
                    callback(ResultValue);
            }
            else
                callback();
        });
    }
    
    function ajaxPostRequestDemo(res, scriptId, callback) {
    		$http({
    			url: 'http://demo.corporatecarsharing.biz/api.svc/ScriptParameterSets',
		        method: "POST",
		        data: res,
		        headers: {
		        	'TenForce-Auth' : 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4', 'Content-Type' : 'application/atom+xml'
		        }
	    	})
	    	.success(function (data, status, headers, config) {
	    		var responsePromisee = $http.get("http://demo.corporatecarsharing.biz/api.svc/ExecuteAdminScript?scriptId="+scriptId+"&scriptParameterSetId=" + data.d.Id, {headers: {'TenForce-Auth': 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4'}});
	    		responsePromisee.success(function(data, status, headers, config) {
	    			var ResultValue;
	    		
	    			if(scriptId != 553) {
	    				ResultValue = JSON.parse(data.d.ExecuteAdminScript.ResultValue);
                        if(callback)
                            callback(ResultValue);
	    			}
	    			else
	    				callback();
	    		});
	        });
    }
    
    function ajaxPostRequest(res, scriptId, callback) {
    		$http({
    			url: 'http://'+InfoFactories.getServer()+'.corporatecarsharing.biz/api.svc/ScriptParameterSets',
		        method: "POST",
		        data: res,
		        headers: {
		        	'TenForce-Auth' : 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4', 'Content-Type' : 'application/atom+xml'
		        }
	    	})
	    	.success(function (data, status, headers, config) {
	    		var responsePromisee = $http.get("http://"+InfoFactories.getServer()+".corporatecarsharing.biz/api.svc/ExecuteAdminScript?scriptId="+scriptId+"&scriptParameterSetId=" + data.d.Id, {headers: {'TenForce-Auth': 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4'}});
	    		responsePromisee.success(function(data, status, headers, config) {
	    			var ResultValue;
                    console.log(data);
	    		
	    			if(scriptId != 553) {
	    				ResultValue = JSON.parse(data.d.ExecuteAdminScript.ResultValue);
                        if(callback)
                            callback(ResultValue);
	    			}
	    			else
	    				callback();
	    		});
	        });
    }
    
    function ajaxPostRequestTemp(res, scriptId, callback) {
    		$http({
    			url: 'http://'+InfoFactories.getServer()+'.corporatecarsharing.biz/api.svc/ScriptParameterSets',
		        method: 'POST',
		        data: res,
		        headers: { 'TenForce-Auth' : 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4', 'Content-Type' : 'application/atom+xml' }
    		
	    	}).success(function (data, status, headers, config) {
	    		var responsePromisee = $http.get("http://"+InfoFactories.getServer()+".corporatecarsharing.biz/api.svc/ExecuteAdminScript?scriptId="+scriptId+"&scriptParameterSetId=" + data.d.Id, {headers: {'TenForce-Auth': 'dGVuZm9yY2UuaXRAVEYuY29tfGRlbW9pdGFseTEyMTY4'}});
	    		
	    		responsePromisee.success(function(data, status, headers, config) {
					if(data.d.ExecuteAdminScript.ResultValue.charAt(0) === '{'){
						var ResultValue = JSON.parse(data.d.ExecuteAdminScript.ResultValue.replace('}, ] }' ,'} ] }'));
					}else{
						var ResultValue = data.d.ExecuteAdminScript.ResultValue;
					}	    			
	    			if(ResultValue) {
	    				if(callback)
                            callback(ResultValue);
	    			}
	    		});
	        });
    }

    function handleError(response) {
        if (
        !angular.isObject(response.data) || 
        !response.data.message
        ) {
            return ($q.reject("An unknown error occurred."));
        }
        return ($q.reject(response.data.message));
    }
    
    function handleSuccess(response) {
        quizeController.dataLoaded = true;
        return (response.data);
    }
})