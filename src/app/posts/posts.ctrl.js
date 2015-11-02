angular.module('wsApp.posts')

    .controller('PostsController', ['$scope', '$stateParams', '$timeout', 'PostService', 'AuthService', 'Constants', 'SyncService', function ($scope, $stateParams, $timeout, PostService, AuthService, Constants, SyncService) {
        $scope.isLoaded = false;

        AuthService.getMyProfile({
            version: Constants.API_VERSION
        }).then(function (userId) {
            if (SyncService.isSynchronized) {
                getPostsByTag(userId);
            }

            $scope.$on('synchronizationEvent', function (event, data) {
                getPostsByTag(userId);
            });

            function getPostsByTag(userId) {
                PostService.getPostsByTag($stateParams.tagName, userId).$promise.then(function (data) {
                    var postSignatures = [];
                    angular.forEach(data.posts, function (value, key) {
                        if (value.hasOwnProperty("originalId")) {
                            this.push(userId + "_" + value.originalId);
                        }
                    }, postSignatures);
                    //material
                    $scope.posts = {
                        posts_: [],
                        toLoad_: 0,
                        // Required.
                        getItemAtIndex: function (index) {
                            var self = this;
                            if (index > (this.posts_.length - 1)) {
                                $timeout(function () {
                                    self.fetchMoreItems_(index);
                                }, 300);
                                return null;
                            }
                            return self.posts_[index];
                        },
                        // Required.
                        // For infinite scroll behavior, we always return a slightly higher
                        // number than the previously loaded items.
                        getLength: function () {
                            return this.posts_.length + 5;
                        },
                        fetchMoreItems_: function (index) {
                            var self = this;
                            if (self.toLoad_ < index) {
                                self.toLoad_ += 25;
                                PostService.getPostsFromVKById({
                                    posts: postSignatures.slice(this.posts_.length, 25).join(),
                                    extended: '1',
                                    v: '5.37',
                                    test_mode: '1'
                                }).then(function (posts) {
                                    self.posts_ = self.posts_.concat(posts);
                                    for (var i = 0; i < self.posts_.length; i++) {
                                        self.posts_[i].tags = data.posts[i].tags;
                                    }
                                    console.log("After ", self.posts_);
                                });
                            }
                            // For demo purposes, we simulate loading more items with a timed
                            //// promise. In real code, this function would likely contain an
                            //// $http request.
                            //if (this.toLoad_ < index) {
                            //    this.toLoad_ += 20;
                            //    $timeout(angular.noop, 300).then(angular.bind(this, function() {
                            //        this.numLoaded_ = this.toLoad_;
                            //    }));
                            //}
                        }
                    };

                    $scope.isLoaded = true;
                    //});
                });
            }

            $scope.addTag = function (postId, tagName) {
                PostService.addTagToPost(userId, postId, tagName);
                return {
                    name: tagName
                };
            };
        });


    }]);
