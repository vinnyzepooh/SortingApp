angular.module('SortingApp.wall')

    .controller('WallController', ['$scope', '$rootScope', '$firebase', '$firebaseArray', '$firebaseObject', 'AuthService', 'WallService', 'PostService', function ($scope, $rootScope, $firebase, $firebaseArray, $firebaseObject, AuthService, WallService, PostService) {
        $scope.count = 100;

        AuthService.authenticate(4997138);

        AuthService.resize(1024, 768);

        $scope.TheIdIs = [];
        $scope.preVkIds = [];
        $scope.VkIds = [];
        $scope.posts = [];

        //PostService.getTag(1).$promise.then(function (tag) {
        //    $scope.tag = tag;
        //});

        WallService.getMyProfile({filter: 'all', count: '1', extended: '1', v: '5.34'}).then(function (profile) {
            $scope.screenName = profile;
            $scope.userid = profile.id;

            //var areEntries = true;
            //var entriesOffset = 0;

            getVKPosts(0);

            var link = 'https://vkbaseapp.firebaseio.com/' + $scope.userid + '/';
            var ref = new Firebase(link);
            var query = ref.limitToFirst(20);
            $scope.posts = $firebaseArray(query);
            ref.on("value", function (snapshot) {
                $scope.BasePosts = snapshot.val();
                $scope.TheIdIs = Object.keys($scope.BasePosts);
            }, function (errorObject) {
                console.log("failed: " + errorObject.code);
            });


        });

        function getVKPosts(offset) {
            console.log("offset: " + offset);
            WallService.getPosts({
                offset: offset,
                count: $scope.count,
                filter: 'all',
                extended: '1',
                v: '5.34'
            }).then(function (posts) {
                if (posts.length > 0) {
                    for (var i = 0; i < posts.length; i++) {
                        //$scope.posts.push(posts[i]);
                        var link = 'https://vkbaseapp.firebaseio.com/' + $scope.userid + '/';
                        var ref = new Firebase(link);
                        var postsRef = ref.child(-1 * posts[i].id);
                        var prioritySet = 1000000 - posts[i].id;
                        postsRef.setWithPriority(posts[i], prioritySet);
                        $scope.preVkIds.push(-1 * posts[i].id);
                        $scope.VkIds = JSON.stringify($scope.preVkIds);
                    }

                    getVKPosts(offset + posts.length);
                }

                if (!$rootScope.$$phase) $rootScope.$apply();
                //console.log('done_loading...');
            });
        }







        //OldPostsDeletion = setInterval(function (deletion) {
        //    console.log('leat');
        //    Array.prototype.diff = function (a) {
        //        return this.filter(function (i) {
        //            return a.indexOf(i) < 0;
        //        });
        //    };
        //    var result = $scope.TheIdIs.diff($scope.VkIds);
        //
        //    for (var i = 0; result.length > i; i++) {
        //        if (result.length > 0) {
        //            var removerLink = 'https://vkbaseapp.firebaseio.com/' + $scope.userid + '/' + result[i] + '/';
        //            var removeFromBase = new Firebase(removerLink);
        //            removeFromBase.remove();
        //        } else {
        //            console.log('error happened');
        //        }
        //    }
        //}, 12000);
        //
        //
        //setTimeout(function () {
        //    clearInterval(OldPostsDeletion);
        //    console.log('stop');
        //    console.log('Firebase');
        //    console.log($scope.posts);
        //}, 14000);


        $scope.postsOptions = {
            dropped: function (event) {
                console.log(event.source.nodeScope.$modelValue);
                //var postsOrder = [];
                //for (var i = 0; i < $scope.posts.length; i++) {
//                    postsOrder.push($scope.posts[i]);
//                    var link = 'https://vkbaseapp.firebaseio.com/'+$scope.userid+'/';
//                    var ref = new Firebase(link);
//                    $scope.list = $firebaseArray(ref);
//                    event.source.nodeScope.$modelValue
//
//                    console.log('done');
//
////                    console.log(JSON.stringify($scope.posts[i].$id));
////                    var postsRef = ref.child(JSON.stringify($scope.posts[i].$id));
////                    postsRef.set (postsOrder);
//                }
//                localStorage.setItem("postsOrder", postsOrder);
//
//
//            //
//
//                console.log(postsOrder);
                console.log('ok');
            }
        };






              $scope.loadMorePosts = function () {
                  console.log('started scroller');
                  var link = 'https://vkbaseapp.firebaseio.com/' + $scope.userid + '/';
                  var ref = new Firebase(link);
                  var offset = $scope.posts.length + 25;
                  var query = ref.limitToFirst(offset);
                  $scope.posts = $firebaseArray(query);

              };




    }]);
