minutes.factory('AuthServices', ['$q', '$http', 
function AuthServices ($q, $http) {
	
	function setUserData (user) {
		localStorage.setItem('user_first_name', user.first_name);
		localStorage.setItem('user_last_name', user.last_name);
		localStorage.setItem('user_email', user.email);
		localStorage.setItem('isUserLoged', true);
		localStorage.setItem('userID', user.id);
		if(user.remember_token !== null){
			localStorage.setItem('remember_token', user.remember_token);
		}
	};

	function clearUserData () {
		localStorage.clear();
	};

	function setUnsavedAccountData (user, token) {
		localStorage.setItem('unsavedID', user.unsavedID);
		localStorage.setItem('satellizer_token', token);
		localStorage.setItem('userID', user.id);
	};

	function sendNewConfirmationCode (email) {
		var defer = $q.defer();
		$http({
			method: 'POST',
			url: 'api/resend-confirmation-link',
			data: email
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	};

	function confirmAccount (token) {
		var defer = $q.defer();
		$http({
			method: 'POST',
			url: 'api/activate-account',
			data: token
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	};

	function sendResetPasswordLink (email) {
		var defer = $q.defer();
		$http({
			method: 'POST',
			url: 'api/reset-password-link',
			data: email
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	};

	function resetPassword (data) {
		var defer = $q.defer();
		$http({
			method: 'POST',
			url: 'api/reset-password',
			data: data
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	};

	function register (data) {
		var defer = $q.defer();
		$http({
			method: 'POST',
			url: 'auth/register',
			data: data
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	};

	function logout () {
		clearUserData();
	};

	function createUnsavedAccount () {
		var defer = $q.defer();
		$http({
			method: 'POST',
			url: 'auth/unsaved-account'
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	}

    function facebookAuth(data) {
        var defer = $q.defer();
        $http({
            method: 'POST',
            url: 'auth/facebook',
            data: data
        }).success(function  (res) {
            defer.resolve(res);
        }).error(function  (err) {
            defer.reject(err);
        });

        return defer.promise;
    }

	return {
		setUserData: setUserData,
		clearUserData: clearUserData,
		sendNewConfirmationCode: sendNewConfirmationCode,
		confirmAccount: confirmAccount,
		sendResetPasswordLink: sendResetPasswordLink,
		resetPassword: resetPassword,
		register: register,
		logout: logout,
		createUnsavedAccount: createUnsavedAccount,
		setUnsavedAccountData: setUnsavedAccountData,
		facebookAuth: facebookAuth
	};
}]);