'use strict';

angular.module('wsApp', [
    'ui.router',
    'ngMaterial',
    'infinite-scroll',
    'ui.tree',
    'ngDraggable',
    'wsApp.common',
    'wsApp.tags',
    'wsApp.posts'
]);

angular.module('wsApp.tags', ['ui.router']);
angular.module('wsApp.posts', ['ui.router']);

angular.module('wsApp.common', [
    'wsApp.common.services'
]);

angular.module('wsApp.common.services', ['ngResource']);

angular.module('wsApp')

    .config(['$httpProvider', '$urlRouterProvider', '$locationProvider', function ($httpProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.when('/', '/tag/all');
        $urlRouterProvider.otherwise("/404");

        $locationProvider.html5Mode(true);
    }]);

angular.element(document).ready(function () {
    angular.bootstrap(document, ['wsApp']);
});

angular.module('wsApp')
    .run(['$rootScope', '$q', '$timeout', 'AuthService', 'PostService', 'Constants', 'SyncService', function ($rootScope, $q, $timeout, AuthService, PostService, Constants, SyncService) {
        AuthService.authenticate(5103031);
        AuthService.resize(1024, 740);

        $rootScope.isSynchronized = function () {
            return SyncService.isSynchronized;
        };

        AuthService.getMyProfile({
            version: Constants.API_VERSION
        }).then(function (userId) {
            var param = {
                count: Constants.POSTS_REQUEST_MAX,
                filter: 'owner',
                extended: '1',
                v: Constants.API_VERSION
            };


            PostService.getPostsNumber(Constants.API_VERSION).then(function(postsNumber) {
                var times = Math.floor(postsNumber / Constants.POSTS_REQUEST_MAX) + 1;
                var promises = [];
                for (var i = 0; i < times; i++) {
                    var params = {
                        count: Constants.POSTS_REQUEST_MAX,
                        filter: 'all',
                        extended: '1',
                        v: Constants.API_VERSION
                    };
                    params.offset = i * Constants.POSTS_REQUEST_MAX;
                    promises.push(PostService.getAllPostsFromVK(params));
                }

                $q.all(promises).then(function(values) {
                    var posts = [];
                    angular.forEach(values, function(value, key) {
                        if (value.hasOwnProperty("items")) {
                            Array.prototype.push.apply(this, value.items);
                        }
                    }, posts);

                    var postDTOs = [];
                    angular.forEach(posts, function(value, key) {
                        this.push({"postId" : value.id, "publicationDate" : value.date});
                    }, postDTOs);

                    SyncService.synchronizePosts(userId, postDTOs).$promise.then(function (response) {
                        console.info("Synchronizing time: %d", response.elapsedTime);
                        $rootScope.$broadcast('synchronizationEvent', {
                            deletedPosts: response.posts
                        });
                    });
                });
            });
        });

    }]);