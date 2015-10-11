angular.module('SortingApp.wall')

    .config(function config($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/wall/wall.html',
                controller: 'WallController'
            });

    });