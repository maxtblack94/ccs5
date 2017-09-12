// Setup an event listener to make an API call once auth is complete
    function onLinkedInLoad() {
        IN.Event.on(IN, "auth", getProfileData);
    }

    // Handle the successful return from the API call
    function onSuccess(data) {
        console.log(data);
    }

    // Handle an error response from the API call
    function onError(error) {
        console.log(error);
    }

    // Use the API call wrapper to request the member's basic profile data
    function getProfileData() {
        IN.API.Raw("/people/~").result(onSuccess).error(onError);
    }


(function() {
	var app = angular.module('app', ['ui.router', 'navController', 'ngAnimate', 'ui.bootstrap'])

	// define for requirejs loaded modules
	define('app', [], function() { return app; });

	// function for dynamic load with requirejs of a javascript module for use with a view
	// in the state definition call add property `resolve: req('/views/ui.js')`
	// or `resolve: req(['/views/ui.js'])`
	// or `resolve: req('views/ui')`
	function req(deps) {
		if (typeof deps === 'string') deps = [deps];
		return {
			deps: function ($q, $rootScope) {
				var deferred = $q.defer();
				require(deps, function() {
					$rootScope.$apply(function () {
						deferred.resolve();
					});
					deferred.resolve();
				});
				return deferred.promise;
			}
		}
	}

	app.config(function($stateProvider, $urlRouterProvider, $controllerProvider){
		var origController = app.controller
		app.controller = function (name, constructor){
			$controllerProvider.register(name, constructor);
			return origController.apply(this, arguments);
		}

		var viewsPrefix = 'views/';

		// For any unmatched url, send to /
		$urlRouterProvider.otherwise("/")

		$stateProvider
			// you can set this to no template if you just want to use the html in the page
			.state('home', {
				url: "/",
				templateUrl: viewsPrefix + "home.html",
				controller: function($scope){
					function callbackFunction(data){
						console.log("callbackFunction",data)
					}
					function callbackScope (data){
						console.log('callbackScope',data)
					}

					$scope.login = function() {
						IN.User.authorize(callbackFunction, callbackScope);
					}

					$scope.logOut = function(){
						IN.User.logout(callbackFunction, callbackScope);
					}
				},
				data: {
					pageTitle: 'Home'
				}
			})
			.state('about', {
				url: "/about",
				templateUrl: viewsPrefix + "about.html",
				data: {
					pageTitle: 'About'
				}
			})
			.state('contact', {
				url: "/contact",
				templateUrl: viewsPrefix + "contact.html",
				data: {
					pageTitle: 'Contact'
				}
			})
			.state('contact.list', {
				url: "/list",
				templateUrl: viewsPrefix + "contact-list.html",
				controller: function($scope){
					$scope.things = ["A", "Set", "Of", "Things"];
				}
			})
			.state('theme', {
				url: "/theme",
				templateUrl: viewsPrefix + "theme.html",
				data: {
					pageTitle: 'Theme Example'
				}
			})
			.state('blog', {
				url: "/blog",
				templateUrl: viewsPrefix + "blog.html",
				data: {
					pageTitle: 'Blog'
				}
			})
			.state('grid', {
				url: "/grid",
				templateUrl: viewsPrefix + "grid.html",
				data: {
					pageTitle: 'Grid'
				}
			})
			.state('ui', {
				url: "/ui",
				resolve: req('/views/ui.js'),
				templateUrl: viewsPrefix + "ui.html",
				data: {
					pageTitle: 'UI'
				}
			})
	})
	.directive('updateTitle', ['$rootScope', '$timeout',
		function($rootScope, $timeout) {
			return {
				link: function(scope, element) {
					var listener = function(event, toState) {
						var title = 'Project Name';
						if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle + ' - ' + title;
						$timeout(function() {
							element.text(title);
						}, 0, false);
					};

					$rootScope.$on('$stateChangeSuccess', listener);
				}
			};
		}
	]);
}());