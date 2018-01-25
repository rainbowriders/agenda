minutes.controller('FacebookAuthController', ['$scope', '$rootScope', '$auth', '$location', 'AuthServices', 'toaster',
function GoogleAuthController($scope, $rootScope, $auth, $location, AuthServices, toaster) {

    $scope.facebookLogin = function facebookLogin () {
        $auth.authenticate('facebook')
            .then(function (res) {
                var data = {token: res.access_token};
                AuthServices.facebookAuth(data)
                    .then(function (res) {
                        localStorage.setItem('satellizer_token', res.token);
                        AuthServices.setUserData(res.user);
                        if($rootScope.lastAttachedUrl != 'undefined' && $rootScope.lastAttachedUrl != undefined){
                            $location.path($rootScope.lastAttachedUrl);
                        }else{
                            $location.path('/dashboard');
                        }
                        toaster.pop({type: 'success', body: res.success, showCloseButton: true});
                    }, function (err) {
                        console.log(err);
                    })
            })
            .catch(function (err) {
                console.log(err);
            });
    }

}]);
