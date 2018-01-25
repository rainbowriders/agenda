var minutes = angular.module('minutes',
    ['ngResource',
    'ngRoute',
    'satellizer',
    'angular-extend-promises',
    'toaster',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'ngTagsInput',
    'ngSanitize',
    'wt.responsive',
    'monospaced.elastic']);



minutes.run(function($rootScope, $location, $auth, AuthServices, $window) {
    $rootScope.$on( "$routeChangeStart", function() {
        var location = $location.path();
        $rootScope.location = $location.path();
        var resetPassLocation = $location.path();

        if(($location.path() == '/' || $location.path() == '/login' || $location.path() == '/register') && localStorage.isUserLoged === 'true') {
            return $location.path('/dashboard');
        } else if($location.path() == '/' && localStorage.isUserLoged === 'false') {
            return $location.path('/login');
        }
        if(location.substring(0, 17) !== '/confirm-account/'
            && $location.path() !== '/send-reset-password-link'
            && resetPassLocation.substring(0, 16) !== '/reset-password/'
            && $location.path() !== '/privacy'
            && $location.path() !== '/terms'){

            if(localStorage.isUserLoged === 'true'){
                $rootScope.isUserLoged = true;
            }else{
                $rootScope.isUserLoged = false;
            }
            if(!$rootScope.isUserLoged
                && ($location.path() !== '/login'
                    && $location.path() !== '/register'
                    && $location.path() !== '/reset-password'
                    && $location.path() !== '/new-password' )){
                $rootScope.lastAttachedUrl = $location.path();
                $location.path('/login');
            } else if($rootScope.isUserLoged
                    && ($location.path() == '/login'
                    && $location.path() == '/register'
                    && $location.path() == '/reset-password'
                    && $location.path() == '/new-password' )){
                    $location.path('/dashboard');
            }
        }
    });
});