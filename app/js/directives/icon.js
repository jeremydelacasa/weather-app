'use strict';

//Directive for Icon Weather Day or Night

angular.module('weather')
    .directive('myIcon', function () {
        return {
            restrict: 'EA',
            replace: false,
            scope:{
              timestamp: '@',
              sunrise: '@',
              sunset: '@',
              id: '@'
            },
            template : '<i ng-class="icon" class="widget-icon wi" ></i> ',
            link: function compile(scope, element, attrs){

              var icon;
              var base = 'wi-owm-';

              if(scope.timestamp > scope.sunrise && scope.timestamp < scope.sunset){
                var icon = base+'day-'+scope.id;
              }else{
                var icon = base+'night-'+scope.id;
              }

              scope.icon = icon;

            }
        };
    });