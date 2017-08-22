angular.module('starter').directive('ccsActionSheet', function(){
	return {
        templateUrl : "js/directives/ccs-01-action-sheet/templates/main.html",
		scope: {
			book: '=',
            callback: '&?',
            actionButtons : "=",
            labelKey: '=?'
		},
		controller: "ActionSheetCtrl"
    }
});