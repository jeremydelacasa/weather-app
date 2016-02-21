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
'use strict';

angular.module('weather')
  .controller('SettingsCtrl', function ($scope, localStorageService, settingsService, $timeout) {
        
    var widgetInStore = localStorageService.get('widgets'); //Get localvar Widgets
    
    $scope.widgets = widgetInStore || []; //widgets data
    $scope.results = ''; //results of input search
    $scope.loading = false; 

    $scope.$watch('widgets', function () { //Watch widgets changes

      localStorageService.set('widgets', $scope.widgets);
        
      $scope.noData = ''
      if(widgetInStore.length == 0){ //If no data show message
        $scope.noData = 'Pour ajouter une ville utilisez le champ de recherche ou cliquez sur "Géolocaliser".'
      }

    }, true);

    $scope.addWidget = function (id, name) {
      $scope.widgets.push({id:id, name:name});
      $scope.query = '';
      $scope.results = '';
    };

    $scope.removeWidget = function (index) {
      $scope.widgets.splice(index, 1);
    };

    $scope.search = function(){

      $scope.loading = true;

      settingsService.search($scope.query).success(function(data){

        $scope.results = data.list;

        $timeout(function(){
          $scope.loading = false;
        }, 500);
        
      }).error(function(error, status){
        $scope.error = 'Erreur de connection';
      });

    }

    $scope.getPosition = function(){ //Geolocation

      if(navigator.geolocation){

        $scope.loadingGeo = "loading disabled"; //classes button during loading

        navigator.geolocation.getCurrentPosition(function(position){

          settingsService.getPosition(position).success(function(data){

            $scope.addWidget(data.id, data.name);
            $scope.loadingGeo = "";

          }).error(function(error, status){
            $scope.error = 'Erreur de connection';
            $scope.loadingGeo = "";
          });

        });

      }else{
        $scope.geolocerror = "error";
      }

    }



});
'use strict';


angular.module('weather')
  .factory('settingsService', function ($http, $q, OPENWEATHERMAP_API_KEY) {
    return{
        search: function(query){
          return $http.get("http://api.openweathermap.org/data/2.5/find?q=" + query + "&type=like&sort=population&cnt=9&units=metric&appid=" + OPENWEATHERMAP_API_KEY);
        },
        getPosition: function(data){
          return $http.get("http://api.openweathermap.org/data/2.5/weather?lat=" + data.coords.latitude + "&lon="+ data.coords.longitude +"&type=like&sort=population&cnt=9&units=metric&appid=" + OPENWEATHERMAP_API_KEY);  
        }
    }
  });
'use strict';

angular.module('weather')
  .controller('HomeCtrl', function ($scope, localStorageService, homeService, $q, $interval, $timeout) {
   
    var widgetInStore = localStorageService.get('widgets'); //Get localStorageVar
    var widgets = [];

    $scope.Math = Math;
    $scope.loader = '';

    $scope.loadData = function(){

      var ids = [];
      $scope.loader = 'loading';

      widgetInStore.map(function(item){ids.push(item.id);});
      
      homeService.search(ids.toString()).success(function(data){ //load data from Api

        widgets = data;
        $scope.widgets = widgets;

        widgetInStore.map(function(item, key){ //loop cities

            $timeout(function(){

              homeService.forecast(item.id).success(function(data){ //load data forecast 

                widgets.list[key].forecast = data;
                $scope.loader = '';

              }).error(function(error, status){

                $scope.error = 'Erreur de connection';
                $scope.loader = '';

              });

            }, 200*key);
        
        });

      }).error(function(error, status){
        $scope.error = 'Erreur de connection';
      });
     
    }

    $scope.loadData();



    $interval(function(){
      $scope.loadData();      
    }, 3600000); //Refresh Data all hour;

    if(localStorageService.get('widgets').length == 0){ //If no data register
      $scope.noData = 'Aucune ville enregistrée';
      $scope.loader = '';
    }

  });
'use strict';


angular.module('weather')
  .factory('homeService', function ($http, $q, OPENWEATHERMAP_API_KEY, GOOGLE_API_KEY) {
    return{
        search: function(query){
          return $http.get("http://api.openweathermap.org/data/2.5/group?id=" + query + "&units=metric&appid=" + OPENWEATHERMAP_API_KEY);
        },
        forecast: function(query){
          return $http.get("http://api.openweathermap.org/data/2.5/forecast/daily?id=" + query + "&units=metric&appid="+ OPENWEATHERMAP_API_KEY);
        },
        getTimeZone: function(lat, long, timestamp){
            return $http.get("https://maps.googleapis.com/maps/api/timezone/json?location="+lat+","+long+"&timestamp="+timestamp+"&key="+ GOOGLE_API_KEY)
        }
    }
  });
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