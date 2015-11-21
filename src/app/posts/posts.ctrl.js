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

            $scope.dropzoneFields = [];
            $scope.dragging = false;

            $scope.draggable = {
                connectWith: ".dropzone",
                start: function (e, ui) {
                    $scope.$apply(function() {
                        $scope.dragging = true;
                    });
                    $('.dropzone').sortable('refresh');
                },
                update: function (e, ui) {
                    if (ui.item.sortable.droptarget[0].classList[0] !== "dropzone")
                        ui.item.sortable.cancel();
                },
                stop: function (e, ui) {

                    if (ui.item.sortable.droptarget == undefined) {
                        $scope.$apply($scope.dragging = false);
                        return;
                    }else if (ui.item.sortable.droptarget[0].classList[0] == "dropzone") {


                        $scope.$apply($scope.dragging = false);

                        var tagged = ui.item.sortable.droptarget[0].firstChild.attributes.href.nodeValue;
                        var droppedTag = tagged.substr(5);

                        TagService.addTagToPost(userId, ui.item.sortable.model.id, droppedTag).$promise.then(function(response) {
                            $scope.$emit('tagAdded', {
                                tag: droppedTag
                            });
                        });

                    }else{
                        $scope.$apply($scope.dragging = false);
                    }

                }

            };

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
        })


    }]);
