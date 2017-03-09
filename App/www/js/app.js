angular.module('starter', ['ionic', 'ngCordova'])

  .run(function ($ionicPlatform, $cordovaStatusbar, $cordovaDevice) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        //cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        //StatusBar.styleDefault();

        if ($cordovaDevice.getPlatform() == 'iOS')
          $cordovaStatusbar.styleHex('#fff');
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $stateProvider

      .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('confirmPrenotation', {
        url: '/confirm-prenotation',
        params: {
          car: null
        },
        cache: false,
        templateUrl: 'templates/confirmPrenotation.html',
        controller: 'ConfirmPrenotationCtrl'
      })

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.bookings', {
        url: '/bookings',
        cache: false,
        views: {
          'tab-bookings': {
            templateUrl: 'templates/tab-bookings.html',
            controller: 'BookingsCtrl'
          }
        }
      })

      .state('tab.map', {
        url: '/map',
        params: {
          pnrInfo: null
        },
        cache: false,
        views: {
          'tab-bookings': {
            templateUrl: 'templates/map.html',
            controller: 'MapCtrl'
          }
        }
      })

      .state('tab.parking', {
        url: '/parking',
        cache: false,
        views: {
          'tab-parking': {
            templateUrl: 'templates/tab-parking.html',
            controller: 'ParkingCtrl'
          }
        }
      })

      .state('tab.resume', {
        url: '/resume',
        cache: false,
        params: {
          error: null
        },
        views: {
          'tab-resume': {
            templateUrl: 'templates/tab-book-resume.html',
            controller: 'ResumeCtrl'
          }
        }
      })

      .state('tab.selcar', {
        url: '/selcar',
        cache: false,
        views: {
          'tab-selcar': {
            templateUrl: 'templates/car-selection.html',
            controller: 'CarCtrl'
          }
        }
      })

      .state('tab.account', {
        url: '/account',
        cache: false,
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/login');

  });
