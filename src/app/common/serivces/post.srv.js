angular.module('SortingApp.common.services')
    .factory('PostService', ['$resource', 'Constants', function ($resource, Constants) {
        return {
            synchronizePosts: function(ownerId, postsIds) {
                var Posts = $resource(Constants.API + '/posts');
                return Posts.save({ownerId: ownerId, postsIds: postsIds});
            }
        };
    }]);