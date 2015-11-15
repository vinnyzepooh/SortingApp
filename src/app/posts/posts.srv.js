angular.module('wsApp.posts')
    .factory('PostService', ['$q', '$resource', 'SyncService', 'Constants', function ($q, $resource, SyncService, Constants) {
        return {
            getPostsNumber: function (apiVersion) {
                var deferred = $q.defer();

                VK.api('wall.get', {
                    count: Constants.POSTS_REQUEST_MAX,
                    extended: '1',
                    v: Constants.API_VERSION
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

                VK.api('wall.get', params, {filter: 'all'}, function (data) {
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

            getPostsFromVKById: function (params) {
                var deferred = $q.defer();

                VK.api('wall.getById', params, function (data) {
                    if (data.hasOwnProperty("response") && data.response.hasOwnProperty("items") && data.response.items.length > 0) {
                        deferred.resolve(data.response.items);
                    } else {
                        if (data.hasOwnProperty("error")) {
                            console.error(data.error);
                        }
                        console.error(params);
                        deferred.reject("getPostsFromVKById error");
                    }
                });

                return deferred.promise;
            }

        };
    }]);