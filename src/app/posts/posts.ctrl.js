angular.module('wsApp.posts')

    .controller('PostsController', ['$scope', '$rootScope', '$stateParams', 'AuthService', 'Constants', 'PostService', 'SyncService', 'TagService', function ($scope, $rootScope, $stateParams, AuthService, Constants, PostService, SyncService, TagService) {

        $scope.isLoaded = false;


        AuthService.getMyProfile({
            version: Constants.API_VERSION
        }).then(function (userId) {
            if (SyncService.isSynchronized) {
                getPostsByTag(userId);
            }

            PostService.getAllPostsFromVK({
                filter: 'owner',
                extended: '1',
                v: Constants.API_VERSION
            }).then(function (profile) {
                $scope.screenName = profile.profiles[0].screen_name;
            });

            $scope.$on('synchronizationEvent', function (event, data) {
                getPostsByTag(userId);
            });

            function getPostsByTag(userId) {
                TagService.getPostsByTag($stateParams.tagName, userId).$promise.then(function (data) {
                    var postSignatures = [];
                    angular.forEach(data.posts, function (value, key) {
                        if (value.hasOwnProperty("originalId")) {
                            this.push(userId + "_" + value.originalId);
                        }
                    }, postSignatures);

                    $scope.posts = [];

                    PostService.getPostsFromVKById({
                        posts: postSignatures.slice(0, postSignatures < 15 ? postSignatures.length : 15).join(),
                        extended: '1',
                        v: '5.37',
                        test_mode: '1'
                    }).then(function (posts) {
                        for (var i = 0; i < posts.length; i++) {
                            posts[i].tags = data.posts[i].tags;
                            $scope.posts.push(posts[i]);

                        }
                        if (!$rootScope.$$phase) $rootScope.$apply();

                    });

                    $scope.loadMorePosts = function () {
                        PostService.getPostsFromVKById({
                            posts: postSignatures.slice($scope.posts.length, $scope.posts.length + 15).join(),
                            extended: '1',
                            v: '5.37',
                            test_mode: '1'
                        }).then(function (posts) {
                            for (var i = 0; i < posts.length; i++) {
                                posts[i].tags = data.posts[$scope.posts.length + i].tags;
                                $scope.posts.push(posts[i]);
                            }
                            if (!$rootScope.$$phase) $rootScope.$apply();
                        });
                    };

                    $scope.postsOptions = {
                        dropped: function (event) {
                            var postsOrder = [];
                            for (var i = 0; i < $scope.posts.length; i++) {
                                postsOrder.push($scope.posts[i]);
                            }
                            localStorage.setItem("postsOrder", postsOrder);
                        }
                    };


                    $scope.isLoaded = true;
                });
            }


            $scope.addTag = function (postId, tagName) {

                TagService.addTagToPost(userId, postId, tagName).$promise.then(function(response) {
                    $scope.$emit('tagAdded', {
                        tag: tagName
                    });
                });

                return {
                    name: tagName
                };
            };

            $scope.removeTag = function (postId, tagName) {
                TagService.removeTagFromPost(userId, postId, tagName);

                $scope.$emit('tagRemoved', {
                    tag: tagName
                });
            };

        });


    }]);
