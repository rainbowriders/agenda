minutes.config(['$authProvider', function  ($authProvider) {
    $authProvider.loginUrl = 'auth/login';
    $authProvider.signupUrl = 'auth/signup';
    $authProvider.loginRedirect = '/deals';
    $authProvider.logoutRedirect = '/';
    $authProvider.loginOnSignup = false;

    $authProvider.google({
        clientId: '988813382835-erltut93r959akiirvr87lackh1ij0vl.apps.googleusercontent.com'
    });

    $authProvider.facebook({
        clientId: '1905369856344064',
        responseType: 'token'
    });

    $authProvider.twitter({
        responseType: 'token',
        clientId: 'FQpVAdavfVxsRkx2dNwpnT4EZ'
    });

    $authProvider.linkedin({
        clientId: '86xrsa4qe417x1',
        scope: ['r_emailaddress', 'r_fullprofile']
    });
}]);
