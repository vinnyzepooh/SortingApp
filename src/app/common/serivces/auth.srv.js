angular.module('wsApp.common.services')
    .factory('AuthService', ['$q', function ($q) {
        return {
            authenticate: function (id) {
                VK.init({
                    apiId: id
                });
            },

            resize: function (width, height) {
                VK.callMethod("resizeWindow", width, height);
            },

            getMyProfile: function (params) {
                var deferred = $q.defer();

                VK.api('users.get', params, function (data) {
                    if (undefined != data.response[0].uid) {
                        deferred.resolve(data.response[0].uid);
                    } else {
                        deferred.reject("Profile search error");
                    }
                });

                return deferred.promise;
            }
        };
    }]);
