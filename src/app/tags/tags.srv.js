angular.module('wsApp.tags')
    .factory('TagService', ['$resource', function ($resource) {
        return {
            tags: [],

            getTagsByOwner: function (ownerId) {
                var Tags = $resource('api/tags');
                return Tags.get({ownerId: ownerId});
            },

            getPostsByTag: function (tag, ownerId) {
                var Posts = $resource('api/tag/:tagName', {tagName: '@tagName'});
                return Posts.get({ownerId: ownerId}, {tagName: tag});
            },

            addTagToPost: function (ownerId, postId, tagName) {
                var Post = $resource('api/tag', {ownerId: '@ownerId', postId: '@postId', tag: '@tag'});
                return Post.save({ownerId: ownerId, postId: postId, tag: tagName});
            },

            removeTagFromPost: function (ownerId, postId, tagName) {
                var Post = $resource('api/tag', {ownerId: '@ownerId', postId: '@postId', tag: '@tag'});
                return Post.delete({ownerId: ownerId, postId: postId, tag: tagName});
            }
        };
    }]);