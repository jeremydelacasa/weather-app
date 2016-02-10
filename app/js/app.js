'use strict';

/* App Module */

var weather = angular.module('weather', [
  'ngRoute',
  'LocalStorageModule',
  'ngAnimate',
  'config'
]);

weather.config(['localStorageServiceProvider', function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('ls');
}]).config(function($routeProvider){
  
  $routeProvider.
    when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    }).
    when('/parametres', {
      templateUrl: 'views/settings.html',
      controller: 'SettingsCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });

});