angular.module('wsApp.posts')
    .factory('PostService', ['$q', '$resource', 'Constants', function ($q, $resource, Constants) {
        return {
            getAllPostsFromVK: function (params) {
                var deferred = $q.defer();

                VK.api('wall.get', params, function (data) {
                    if (undefined != data.response.items && data.response.items.length >= 0) {
                        deferred.resolve(data.response.items);
                    } else {
                        deferred.reject("Posts were not found");
                    }

                });

                return deferred.promise;
            },

            getPostsByTag: function (tag, ownerId) {
                var Posts = $resource('api/tag/:tagName', {tagName: '@tagName'});
                return Posts.get({ownerId: ownerId}, {tagName: tag});
            },

            getPostsFromVKById: function (params) {
                console.log(params);
                var deferred = $q.defer();

                VK.api('wall.getById', params, function (data) {
                    console.log(data);
                    if (data.response.items.length > 0) {
                        deferred.resolve(data.response.items);
                    } else {
                        deferred.reject("getPostsFromVKById error");
                    }
                });

                return deferred.promise;
            }
        };
    }]);