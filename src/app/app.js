'use strict';

angular.module('wsApp', [
    'ui.router',
    'ngMaterial',
    'infinite-scroll',
    'ui.tree',
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
    .run(['$rootScope', 'AuthService', 'PostService', 'Constants', 'SyncService', function ($rootScope, AuthService, PostService, Constants, SyncService) {
        AuthService.authenticate(4997138);
        AuthService.resize(1024, 768);

        AuthService.getMyProfile({
            version: Constants.API_VERSION
        }).then(function (userId) {
            $rootScope.userId = userId;

            console.log("Start synchronization.");
            syncPostsFromVK(0); // 0 - START_OFFSET
        });

        function syncPostsFromVK(offset) {
            console.log("offset: ", offset);
            PostService.getAllPostsFromVK({
                offset: offset,
                count: Constants.POSTS_REQUEST_MAX,
                filter: 'owner',
                extended: '1',
                v: Constants.API_VERSION
            }).then(function (posts) {
                if (posts.length > 0) {
                    var postDTOs = [];
                    for (var i = 0; i < posts.length; i++) {
                        postDTOs.push({"postId": posts[i].id, "publicationDate": posts[i].date});
                    }

                    SyncService.synchronizePosts($rootScope.userId, postDTOs).$promise.then(function (deletedPosts) {
                        syncPostsFromVK(offset + posts.length);
                    });
                } else {
                    $rootScope.$broadcast('synchronizationEvent', {
                        synchronized: true
                    });
                    console.log("End synchronization.");
                }
            });
        }
    }]);