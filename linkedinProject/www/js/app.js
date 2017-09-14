(function () {
	var app = angular.module('app', ['ui.router', 'ngAnimate', 'ui.bootstrap'])

	// define for requirejs loaded modules
	define('app', [], function () { return app; });

	// function for dynamic load with requirejs of a javascript module for use with a view
	// in the state definition call add property `resolve: req('/views/ui.js')`
	// or `resolve: req(['/views/ui.js'])`
	// or `resolve: req('views/ui')`
	function req(deps) {
		if (typeof deps === 'string') deps = [deps];
		return {
			deps: function ($q, $rootScope) {
				var deferred = $q.defer();
				require(deps, function () {
					$rootScope.$apply(function () {
						deferred.resolve();
					});
					deferred.resolve();
				});
				return deferred.promise;
			}
		}
	}

	app.config(function ($stateProvider, $urlRouterProvider, $controllerProvider) {
		var origController = app.controller
		app.controller = function (name, constructor) {
			$controllerProvider.register(name, constructor);
			return origController.apply(this, arguments);
		}

		var viewsPrefix = 'views/';

		// For any unmatched url, send to /
		$urlRouterProvider.otherwise("/login")

		$stateProvider
			.state('login', {
				url: '/login',
				templateUrl: 'views/login.html',
				controller: 'controllerLogin'
				/* resolve: {
					// controller will not be loaded until $waitForSignIn resolves
					// Auth refers to our $firebaseAuth wrapper in the factory below
					"currentAuth": ["Auth", function (Auth) {
						// $waitForSignIn returns a promise so the resolve waits for it to complete
						return Auth.$waitForSignIn();
					}]
				} */
			})

			.state('viewMain', {
				abstract: true,
				views: {
					"": {
						templateUrl: 'views/main.html',
						controller: 'controllerMain',
						/* resolve: {
							// controller will not be loaded until $requireSignIn resolves
							// Auth refers to our $firebaseAuth wrapper in the factory below
							"currentAuth": ["Auth", function (Auth) {
								// $requireSignIn returns a promise so the resolve waits for it to complete
								// If the promise is rejected, it will throw a $stateChangeError (see above)
								return Auth.$requireSignIn();
							}]
						} */
					} ,
					"header@viewMain": {
						templateUrl: 'views/header.html',
						controller: 'controllerHeader'
					},
					"footer@viewMain": {
						templateUrl: 'views/footer.html'
					}
				},
			})

			.state('viewMain.home', {
				url: '/home',
				templateUrl: 'views/home.html'
			})/* 
			.state('viewMain.locations', {
				url: '/locations',
				templateUrl: 'view/content/locations.html',
				controller: 'controllerLocations'
			})
			.state('viewMain.events', {
				url: '/events',
				templateUrl: 'view/content/events.html',
				controller: 'controllerEvents'
			}); */
	})
		.directive('updateTitle', ['$rootScope', '$timeout',
			function ($rootScope, $timeout) {
				return {
					link: function (scope, element) {
						var listener = function (event, toState) {
							var title = 'Project Name';
							if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle + ' - ' + title;
							$timeout(function () {
								element.text(title);
							}, 0, false);
						};

						$rootScope.$on('$stateChangeSuccess', listener);
					}
				};
			}
		]);
}());