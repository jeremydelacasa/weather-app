'use strict';


angular.module('weather')
  .factory('settingsService', function ($http, $q) {
    return{
        search: function(query){
          return $http.get("http://api.openweathermap.org/data/2.5/find?q=" + query + "&type=like&sort=population&cnt=9&units=metric&appid=" + OPENWEATHERMAP_API_KEY);
        },
        getPosition: function(data){
          return $http.get("http://api.openweathermap.org/data/2.5/weather?lat=" + data.coords.latitude + "&lon="+ data.coords.longitude +"&type=like&sort=population&cnt=9&units=metric&appid=" + OPENWEATHERMAP_API_KEY);  
        }
    }
  });