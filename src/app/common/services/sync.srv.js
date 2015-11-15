angular.module('wsApp.common.services')
    .factory('SyncService', ['$resource', 'Constants', function ($resource, Constants) {
        return {
            isSynchronized: false,

            synchronizePosts: function (ownerId, posts) {
                var Posts = $resource('api/posts');
                return Posts.save({ownerId: ownerId, posts: posts});
            }
        };
    }]);