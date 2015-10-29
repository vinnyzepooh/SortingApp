angular.module('wsApp.tags')
    .factory('TagService', ['$resource', function ($resource) {
        return {
            getTagsByOwner: function (ownerId) {
                var Tags = $resource('api/tags');
                return Tags.get({ownerId: ownerId});
            }
        };
    }]);