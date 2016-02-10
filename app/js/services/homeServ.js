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