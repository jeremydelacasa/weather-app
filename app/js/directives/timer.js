'use strict';

//Directive for Timer 

angular.module('weather')
    .directive('myTimer', function ($interval, homeService) {
        return {
            restrict: 'EA',
            replace: false,
            scope:{
              timestamp: '@',
              latitude: '@',
              longitude: '@'
            },
            template:'{{timer}}{{date}}',
            link: function compile(scope, element, attrs){

              homeService.getTimeZone(scope.latitude, scope.longitude, scope.timestamp).success(function(data){
                
                scope.timer = moment.tz(data.timeZoneId).format('HH:mm');

                element.on('$destroy', function(){

                  $interval.cancel(interval);

                });

                var interval = $interval(function(){

                  scope.timer = moment.tz(data.timeZoneId).format('HH:mm');

                },1000);

              });

            }
        };
    });