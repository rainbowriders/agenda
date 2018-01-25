minutes.controller('LinkedAuthController', ['$scope', '$rootScope', '$auth', '$location', 'AuthServices', 'toaster',
    function LinkedAuthController($scope, $rootScope, $auth, $location, AuthServices, toaster) {

        $scope.linkedinLogin = function linkedinLogin() {
            $auth.authenticate('linkedin')
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
