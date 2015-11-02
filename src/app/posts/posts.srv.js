angular.module('wsApp.posts')
    .factory('PostService', ['$q', '$resource', 'SyncService', 'Constants', function ($q, $resource, SyncService, Constants) {
        return {
            getPostsNumber: function (apiVersion) {
                var deferred = $q.defer();

                VK.api('wall.get', {
                    count: Constants.POSTS_REQUEST_MAX,
                    filter: 'owner',
                    extended: '1',
                    v: apiVersion
                }, function (data) {
                    if (data.hasOwnProperty("response")) {
                        if (data.response.hasOwnProperty("count")) {
                            deferred.resolve(data.response.count);
                        }
                    } else {
                        deferred.reject("Posts were not found");
                    }
                });

                return deferred.promise;
            },
            getAllPostsFromVK: function (params) {
                var deferred = $q.defer();

                VK.api('wall.get', params, function (data) {
                    if (data.hasOwnProperty("response")) {
                        if (data.response.hasOwnProperty("items")) {
                            if (undefined != data.response.items && data.response.items.length >= 0) {
                                deferred.resolve(data.response);
                            }
                        }
                    } else {
                        deferred.resolve(data);
                    }
                });

                return deferred.promise;
            },

            getPostsByTag: function (tag, ownerId) {
                var Posts = $resource('api/tag/:tagName', {tagName: '@tagName'});
                return Posts.get({ownerId: ownerId}, {tagName: tag});
            },

            getPostsFromVKById: function (params) {
                var deferred = $q.defer();

                VK.api('wall.getById', params, function (data) {
                    if (data.hasOwnProperty("response") && data.response.hasOwnProperty("items") && data.response.items.length > 0) {
                        deferred.resolve(data.response.items);
                    } else {
                        deferred.reject("getPostsFromVKById error");
                    }
                });

                return deferred.promise;
            },

            addTagToPost: function (ownerId, postId, tagName) {
                var Post = $resource('api/post/tag');
                return Post.save({ownerId: ownerId, postId: postId, tag: tagName});
            }

        };
    }]);