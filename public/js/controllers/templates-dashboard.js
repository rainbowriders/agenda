minutes.controller('TemplatesDashboardController', [
'$scope', '$location', '$timeout', 'TemplateService', 'AuthServices', '$auth',
function ($scope, $location, $timeout, TemplateService, AuthServices, $auth) {

    if(localStorage.getItem('satellizer_token') == null && localStorage.getItem('remember_token') != null) {

        var data = {'remember_token' : localStorage.getItem('remember_token')};
        $auth.login(data)
            .then(function (res) {
                AuthServices.setUserData(res.data.user);
                load();
            }, function (err) {
                AuthServices.logout();
                $location.path('/login');
            });
    } else if(localStorage.getItem('satellizer_token') == null && localStorage.getItem('remember_token') == null){
        localStorage.clear();
        $rootScope.isUserLoged = false;
        $location.path('/login');
    } else {
        load();
    }

    $scope.searchPattern = '';
    

    $scope.search = function search() {

        var temp = $scope.searchPattern;
        $timeout(function () {
            if(temp == $scope.searchPattern) {
                var data = {pattern: $scope.searchPattern}
                load(data);
            }
        }, 500);
    };

    $scope.openTemplate = function openTemplate(id) {
        $location.path('templates/' + id);
    };

    function load(data) {
        TemplateService.showAll(data)
            .then(function (res) {
                $scope.templates = res.templates;
            }, function (err) {
                if(localStorage.getItem('remember_token') != null) {

                    var data = {'remember_token': localStorage.getItem('remember_token')};
                    $auth.login(data)
                        .then(function (res) {
                            AuthServices.setUserData(res.data.user);
                            load();
                        }, function (err) {
                            AuthServices.logout();
                            $location.path('/login');
                        });
                } else {
                    AuthServices.logout();
                    $location.path('/login');
                }
            })
    }
}]);