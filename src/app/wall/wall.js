angular.module('SortingApp.wall')
    .config(function config($stateProvider){
        $stateProvider
            .state('home', {
                ur:'/',
                templateUrl: 'app/wall/wall.html',
                controller: 'WallController'
            })
    });