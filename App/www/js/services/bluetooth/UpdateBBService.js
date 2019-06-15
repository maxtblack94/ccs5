angular.module('starter').service("UpdateBBService", function($q, $rootScope, ScriptServices) {

    function checkIsExistingRequest() {
       var updateBB = localStorage.getItem('updateBB');
       return updateBB ? true: false;
    }

    function setUpdateRequest(TKN) {
        localStorage.setItem('updateBB', TKN);
    }

    function deleteExistingRequest() {
        localStorage.removeItem(updateBB);
    }

    function updateBB() {
        return $q(function(resolve, reject) {
            if (checkIsExistingRequest()) {
                resolve();
                console.log('i updateBB');
                deleteExistingRequest();
            } else {
                resolve();
            }
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

});
