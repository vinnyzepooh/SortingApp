angular.module('wsApp.tags')

    .config(function config($stateProvider) {
        $stateProvider
            .state('tags', {
                url: '/tag/:tagName',
                views: {
                    'main@': {
                        templateUrl: 'app/tags/tags.html',
                        controller: 'TagsController'
                    },
                    'posts@tags': {
                        templateUrl: 'app/posts/posts.html',
                        controller: 'PostsController'
                    }
                }
            });

    });