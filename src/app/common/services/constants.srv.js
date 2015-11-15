angular.module('wsApp.common.services')

    .constant('Constants', {
        API_URL: 'http://appws-vinnyzepooh.rhcloud.com/api',
        API_VERSION: '5.37',
        POSTS_REQUEST_MAX: 100,
        POSTS_PER_CHUNK: 15
    });