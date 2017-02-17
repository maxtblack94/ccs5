angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers'])

.run(function($ionicPlatform, $cordovaStatusbar, $cordovaDevice) {
  moment.locale('it');
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      //cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      //StatusBar.styleDefault();
      
      if($cordovaDevice.getPlatform()=='iOS')
        $cordovaStatusbar.styleHex('#fff');
    }

    moment.locale('it');
    if(navigator.globalization) {
      var devlan = null;
      navigator.globalization.getLocaleName(function (lan) {   
          if(lan.value.indexOf('-') != 0) 
              devlan = lan.value.split('-')[0];
          else
              devlan = lan.value;
              
          switch(devlan) {
              default:
                  $('.head').append('<script src="locale/angular-locale_en.js"></script>');
                  break;
              case 'it':
                  $('.head').append('<script src="locale/angular-locale_it.js"></script>');
                  break;
              case 'en':
                  $('.head').append('<script src="locale/angular-locale_en.js"></script>');
                  break;
          }
      },
      function () {
          alert('Error getting language\n');
      });  
    };
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'AppCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.bookings', {
    url: '/bookings',
    views: {
      'tab-bookings': {
        templateUrl: 'templates/tab-bookings.html',
        controller: 'BookingsCtrl'
      }
    }
  })

  .state('tab.map', {
      url: '/map',
      views: {
        'tab-bookings': {
          templateUrl: 'templates/map.html',
          controller: 'MapCtrl'
        }
      }
    })

  .state('tab.newbooking', {
      url: '/newbooking',
      views: {
        'tab-newbooking': {
          templateUrl: 'templates/tab-newbooking.html',
          controller: 'NewbookingsCtrl'
        }
      }
    })

  .state('tab.parking', {
      url: '/parking',
      views: {
        'tab-parking': {
          templateUrl: 'templates/tab-parking.html',
          controller: 'ParkingCtrl'
        }
      }
    })

  .state('tab.resume', {
      url: '/resume',
      views: {
        'tab-resume': {
          templateUrl: 'templates/tab-book-resume.html',
          controller: 'ResumeCtrl'
        }
      }
    })

  .state('tab.selcar', {
      url: '/selcar',
      views: {
        'tab-resume': {
          templateUrl: 'templates/car-selection.html',
          controller: 'CarCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/login');

});
