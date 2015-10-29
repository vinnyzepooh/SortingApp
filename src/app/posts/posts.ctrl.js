angular.module('wsApp.posts')

    .controller('PostsController', ['$scope', '$stateParams', 'PostService', 'AuthService', 'Constants', 'SyncService', function ($scope, $stateParams, PostService, AuthService, Constants, SyncService) {
        var self = this;
        self.initPosts = [];

        $scope.postSignatures = [];

        AuthService.getMyProfile({
            version: Constants.API_VERSION
        }).then(function (userId) {
            if (SyncService.isSynchronized) {
                PostService.getPostsByTag($stateParams.tagName, userId).$promise.then(function (data) {
                    $scope.postSignatures = data.posts;

                    PostService.getPostsFromVKById({
                        posts: $scope.postSignatures.slice(0, 9),
                        extended: '1',
                        v: '5.37',
                        test_mode: '1'
                    }).then(function (posts1) {
                        self.initPosts = posts1;
                        PostService.getPostsFromVKById({
                            posts: $scope.postSignatures.slice(10, 19),
                            extended: '1',
                            v: '5.37',
                            test_mode: '1'
                        }).then(function (posts2) {
                            self.initPosts = self.initPosts.concat(posts2);
                            PostService.getPostsFromVKById({
                                posts: $scope.postSignatures.slice(20, 29),
                                extended: '1',
                                v: '5.37',
                                test_mode: '1'
                            }).then(function (posts3) {
                                self.initPosts = self.initPosts.concat(posts3);

                                $scope.posts = {
                                    posts_: self.initPosts,
                                    // Required.
                                    getItemAtIndex: function(index) {
                                        console.log("index: " + index);
                                        if (index > this.posts_.length) {
                                            this.fetchMoreItems_(index);
                                            return null;
                                        }
                                        return this.posts_[index];
                                    },
                                    // Required.
                                    // For infinite scroll behavior, we always return a slightly higher
                                    // number than the previously loaded items.
                                    getLength: function() {
                                        console.log("index: " + this.posts_.length + 5);
                                        return this.posts_.length + 5;
                                    },
                                    fetchMoreItems_: function(index) {
                                        var self2 = this;
                                        console.log("fetch: " + index);
                                        var nextSlice = $scope.postSignatures.slice(this.posts_.length, this.posts_.length + 9);
                                        PostService.getPostsFromVKById({
                                            posts: nextSlice,
                                            extended: '1',
                                            v: '5.37'
                                        }).then(function (posts) {
                                            self2.posts_ = self2.posts_.concat(posts);
                                        });
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
                            });

                        });
                    });
                });
            }
        });

        //$scope.loadMorePosts = function () {4
        //    console.log("inside loadMore");
        //    var nextSlice = $scope.postSignatures.slice($scope.posts.length, $scope.posts.length + 25);
        //    PostService.getPostsFromVKById({
        //        posts: nextSlice,
        //        extended: '1',
        //        v: '5.37'
        //    }).then(function (posts) {
        //        console.log("posts:" + posts);
        //        $scope.posts.concat(posts);
        //        console.log("scope posts: " + $scope.posts)
        //    });
        //};

        //$scope.postsOptions = {
        //    accept: function(sourceNodeScope, destNodesScope, destIndex) {
        //        return true;
        //    },
        //    dropped: function(e) {
        //        console.log ("source modelValue: " + e.source.nodeScope.$modelValue);
        //        console.log ("dest modelValue: " + e.dest.nodeScope.$modelValue);
        //    }
        //};

    }]);
