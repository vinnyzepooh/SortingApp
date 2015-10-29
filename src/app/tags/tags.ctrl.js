angular.module('wsApp.tags')

    .controller('TagsController', ['$scope', '$rootScope', 'TagService', 'SyncService', 'AuthService', 'Constants', function ($scope, $rootScope, TagService, SyncService, AuthService, Constants) {
        $scope.isSynchronized = function() {
            return SyncService.isSynchronized;
        };

        AuthService.getMyProfile({
            version: Constants.API_VERSION
        }).then(function (userId) {
            if (SyncService.isSynchronized) {
                TagService.getTagsByOwner(userId).$promise.then(function (data) {
                    $scope.tags = data.tags;
                });
            }

            $scope.$on('synchronizationEvent', function (event, data) {
                SyncService.isSynchronized = true;
                TagService.getTagsByOwner(userId).$promise.then(function (data) {
                    $scope.tags = data.tags;
                });
            });

        });

    }]);
