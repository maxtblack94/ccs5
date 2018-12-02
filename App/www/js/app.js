angular.module('starter', ['ionic', 'ngCordova', 'tagged.directives.autogrow', 'angularMoment', 'pascalprecht.translate'])

  .run(function ($ionicPlatform, $cordovaStatusbar, $cordovaDevice, amMoment, $rootScope, LanguageService) {
    amMoment.changeLocale('it');
    $ionicPlatform.ready(function () {
      var pushCallback = function(jsonData) {
        if (jsonData) {
          var parsedNotification = {
              "title" : ((jsonData.notification || {}).payload || {}).title,
              "body" : ((jsonData.notification || {}).payload || {}).body,
              "additionalData" : (((jsonData.notification || {}).payload || {}).additionalData || {}),
              "eventName" : (((jsonData.notification || {}).payload || {}).additionalData || {}).eventName,
              "pushID" : (((jsonData.notification || {}).payload || {}).additionalData || {}).pushID
          }
          $rootScope.$broadcast('pushNotificationEvent', parsedNotification);
        }
      };
      if (window.plugins && window.plugins.OneSignal) {
        window.plugins.OneSignal
        .startInit("9e4aefd1-79ba-4ea2-b7c1-755e85dc5851")
        .handleNotificationOpened(pushCallback)
        .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
        .endInit();
      }

      if (window.StatusBar) {
        if ($cordovaDevice.getPlatform() == 'iOS'){
          $cordovaStatusbar.styleHex('#111');
        }
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, $translateProvider) {
    $translateProvider.translations('en', window.locale_en);
    $translateProvider.translations('it_IT', window.locale_it);
    $translateProvider.translations('ro_RO', window.locale_ro);
    $translateProvider.useSanitizeValueStrategy('sanitize');
    if (navigator.language === "it-IT" || navigator.language === "it_IT") {
      $translateProvider.preferredLanguage("it_IT");
    }else if (navigator.language === "ro-RO" || navigator.language === "ro_RO") {
      $translateProvider.preferredLanguage("ro_RO");
    }else {
      $translateProvider.preferredLanguage('en');
    }
    
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $httpProvider.defaults.timeout = 30000;
    $stateProvider

      .state('login', {
        url: '/login',
        cache: false,
        params: {
          error401: null
        },
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('confirmPrenotation', {
        url: '/confirm-prenotation',
        params: {
          car: null
        },
        cache: false,
        templateUrl: 'templates/tabs/confirmPrenotation.html',
        controller: 'ConfirmPrenotationCtrl'
      })

      .state('contacts', {
        url: '/contacts',
        cache: false,
        templateUrl: 'templates/commons/contacts.html',
        controller: 'ContactsCtrl'
      })

      .state('editPassword', {
        url: '/edit-password',
        cache: false,
        templateUrl: 'templates/commons/edit-password.html',
        controller: 'EditPasswordCtrl'
      })
      .state('clientDetails', {
        url: '/client-details',
        cache: false,
        templateUrl: 'templates/commons/client-details.html',
        controller: 'ClientDetailCtrl'
      })

      .state('license', {
        url: '/license',
        cache: false,
        templateUrl: 'templates/commons/license-edit.html',
        controller: 'LicenseEditCtrl'
      })

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'TabCtrl'
      })

      // Each tab has its own nav history stack:

      .state('tab.bookings', {
        url: '/bookings',
        cache: false,
        views: {
          'tab-bookings': {
            templateUrl: 'templates/tabs/tab-bookings.html',
            controller: 'BookingsCtrl'
          }
        }
      })
      
      .state('tab.sos', {
        url: '/sos',
        cache: false,
        views: {
          'tab-sos': {
            templateUrl: 'templates/tabs/tab-sos.html',
            controller: 'SosCtrl'
          }
        }
      })

      .state('tab.ble', {
        url: '/ble',
        cache: false,
        views: {
          'tab-ble': {
            templateUrl: 'templates/tabs/tab-ble-test.html',
            controller: 'BleCtrl'
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
            templateUrl: 'templates/tabs/map.html',
            controller: 'MapCtrl'
          }
        }
      })

      .state('tab.parking', {
        url: '/parking',
        cache: false,
        views: {
          'tab-parking': {
            templateUrl: 'templates/tabs/tab-parking.html',
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
            templateUrl: 'templates/tabs/tab-book-resume.html',
            controller: 'ResumeCtrl'
          }
        }
      })

      .state('tab.selcar', {
        url: '/selcar',
        cache: false,
        views: {
          'tab-selcar': {
            templateUrl: 'templates/tabs/car-selection.html',
            controller: 'CarCtrl'
          }
        }
      })

      .state('tab.notifications', {
        url: '/notifications',
        cache: false,
        views: {
          'tab-notifications': {
            templateUrl: 'templates/tabs/tab-notifications.html',
            controller: 'notificationsCtrl'
          }
        }
      })

      .state('settings', {
        url: '/settings',
        cache: false,
        templateUrl: 'templates/commons/settings.html',
        controller: 'SettingsCtrl'
      })
      
      .state('help', {
        url: '/help',
        cache: false,
        templateUrl: 'templates/commons/help.html',
        controller: 'HelpCtrl'
      });

    $urlRouterProvider.otherwise('/login');

  });
