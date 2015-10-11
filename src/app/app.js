'use strict';

angular.module('SortingApp', [
    'ui.router',
    'ngMaterial',
    'infinite-scroll',
    'ui.tree',
    'ngResource',
    'firebase',
    'SortingApp.common',
    'SortingApp.wall',
    'AngTeam.common.services']);

angular.module('SortingApp.wall', ['ui.router']);

angular.module('SortingApp.common', [
    'SortingApp.common.services'
]);

angular.module('SortingApp.common.services', []);

angular.module('AngTeam.common.services', []);

angular.module('SortingApp')

    .config(['$urlRouterProvider', '$locationProvider', function ($urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/404");

        $locationProvider.html5Mode(true);
    }]);

angular.element(document).ready(function () {
    angular.bootstrap(document, ['SortingApp']);
});