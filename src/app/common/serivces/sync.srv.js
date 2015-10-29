angular.module('wsApp.common.services')
    .factory('SyncService', ['$resource', 'Constants', function ($resource, Constants) {
        return {
            isSynchronized: true,

            synchronizePosts: function (ownerId, posts) {
                var Posts = $resource('api/posts', {}, {"query":  {method:'POST', isArray:true}});
                return Posts.query({ownerId: ownerId, posts: posts});
            }
        };
    }]);