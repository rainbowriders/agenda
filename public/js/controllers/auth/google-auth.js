minutes.controller('GoogleAuthController', ['$scope', '$rootScope', '$auth', '$location', 'AuthServices', 'toaster',
function GoogleAuthController ($scope, $rootScope, $auth, $location, AuthServices, toaster) {

    $scope.googleLogin = function googleLogin () {

        $auth.authenticate('google')
            .then(function (res) {
                AuthServices.setUserData(res.data.user);
                if($rootScope.lastAttachedUrl != 'undefined' && $rootScope.lastAttachedUrl != undefined){
                    $location.path($rootScope.lastAttachedUrl);
                }else{
                    $location.path('/dashboard');
                }
                toaster.pop({type: 'success', body: res.data.success, showCloseButton: true});
            }).catch(function (error) {
                console.log(error);
            })

    }

}]);