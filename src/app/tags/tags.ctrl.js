angular.module('wsApp.tags')

    .controller('TagsController', ['$scope', '$rootScope', '$stateParams', 'TagService', 'SyncService', 'AuthService', 'Constants', function ($scope, $rootScope, $stateParams, TagService, SyncService, AuthService, Constants) {
        $scope.tags = TagService.tags;

        AuthService.getMyProfile({
            version: Constants.API_VERSION
        }).then(function (userId) {
            if (SyncService.isSynchronized) {
                TagService.getTagsByOwner(userId).$promise.then(function (data) {
                    showTags(data.tags);
                });
            }

            $scope.$on('synchronizationEvent', function (event, data) {
                TagService.getTagsByOwner(userId).$promise.then(function (data) {
                    showTags(data.tags);

                    SyncService.isSynchronized = true;
                });
            });

            $scope.$on('tagAdded', function (event, data) {
                var found = false;
                for (var i = 0; i < $scope.tags.length; i++) {
                    if ($scope.tags[i].name == data.tag) {
                        $scope.tags[i].count += 1;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    $scope.tags.push({"name": data.tag, "isActive": false, "count": 1});
                }
            });

            $scope.$on('tagRemoved', function (event, data) {
                for (var i = 0; i < $scope.tags.length; i++) {
                    if ($scope.tags[i].name == data.tag) {
                        $scope.tags[i].count -= 1;

                        if ($scope.tags[i].count <= 0) {
                            $scope.tags.splice(i, 1);
                        }

                        break;
                    }
                }
            });
        });

        function showTags(tags) {
            $scope.tags = tags;
            for (var i = 0; i < $scope.tags.length; i++) {
                $scope.tags[i].isActive = ($scope.tags[i].name == $stateParams.tagName);
            }
            TagService.tags = tags;
        }

    }]);
