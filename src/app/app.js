'use strict';

angular.module ('SortingApp', [
    'ui.router',
    'ui.tree',
    'infinite-scroll',
    'firebase'
]);

angular.module ('SortingApp')
    .config(['$urlRouterProvider', '$locationProvider', function ($urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/404");

        $urlRouterProvider.html5Mode(true);
    }]);

angular.element(document).ready(function () {
    angular.bootstrap(document, ['SortingApp']);
});

angular.module ('SortingApp.wall', ['ui.router']);