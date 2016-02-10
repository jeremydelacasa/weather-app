'use strict';

angular.module('weather')
  .controller('GlobalCtrl', function ($scope, localStorageService) {

    var allreadyCome = localStorageService.get('allreadyCome'); //Get localStorageVar

    if(!allreadyCome){ //If user never come

      var array = [
        {
          'id':'2992166',
          'name':'Montpellier'
        },
        {
          'id':'2643743',
          'name':'London'
        },
        {
          'id':'5128581',
          'name':'New York'
        }
      ];

      localStorageService.set('widgets', array); //Show exemple
      localStorageService.set('allreadyCome', true); //User is now allready come

    }

  });