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