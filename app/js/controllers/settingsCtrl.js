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