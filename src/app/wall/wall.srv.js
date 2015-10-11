angular.module('SortingApp.wall')
    .factory('WallService', ['$q', function ($q) {
        return {
            getPosts: function (params) {
                var deferred = $q.defer();

                VK.api('wall.get', params, function (data) {
                    if (undefined != data.response.items && data.response.items.length > 0) {
                        deferred.resolve(data.response.items);
                    } else {
                        deferred.reject("Posts were not found");
                    }

                });

                return deferred.promise;
            },

            getMyProfile: function (params) {
                var deferred = $q.defer();

                VK.api('wall.get', params, function (data) {
                    if (undefined != data.response.profiles && data.response.profiles.length > 0) {
                        deferred.resolve(data.response.profiles[0]);
                    } else {
                        deferred.reject("Profile search error");
                    }
                });

                return deferred.promise;
            }
        }
    }]);