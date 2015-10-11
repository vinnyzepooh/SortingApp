angular.module('SortingApp.common.services')
    .factory('AuthService', function () {
    return {
        authenticate: function (id) {
            VK.init({
                apiId: id
            });
        },
        resize: function (width, height) {
            VK.callMethod ("resizeWindow", width, height);
        }
    };
});
