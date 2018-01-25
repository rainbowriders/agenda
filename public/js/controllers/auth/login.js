minutes.controller('LoginController', ['$scope', '$auth', '$location', '$timeout', '$rootScope', 'toaster', 'AuthServices',
function LoginController($scope, $auth, $location, $timeout, $rootScope, toaster, AuthServices){

	$timeout(function () {
		if($scope.userLoginData.email) {
			$scope.animateInputs('loginEmailLabel', 'loginEmail');
			$scope.animateInputs('loginPasswordLabel', 'loginPassword');
		}
	}, 1200);

	$scope.userLoginData = {};
	$scope.userLoginData.checkboxValue = false;
	$scope.errors = {
		loginEmail: false,
		loginPassword: false
	};
	$scope.errorsText = {
		loginEmailError: '',
		loginPasswordError: ''
	};

	$scope.checkRememberMe = function checkRememberMe() {
		$scope.userLoginData.checkboxValue = !$scope.userLoginData.checkboxValue;
		document.getElementById("login-btn").focus();
	};

	$scope.loginErrors = false;
	$scope.rememberMe = false;
	$scope.login = function login () {

		$scope.errors.loginEmail = false;
		$scope.errors.loginPassword = false;
		$scope.loginErrors = false;
		var data = {
			email: $scope.userLoginData.email,
			password: $scope.userLoginData.password
		};
		if($scope.userLoginData.checkboxValue === true){
			data.rememberMe = true;
		}
		if(!$scope.userLoginData.email || $scope.userLoginData.email == 'undefined'){
			$scope.errorsText.loginEmailError = 'Please enter your email address!';
			$scope.errors.loginEmail = true;
			$scope.loginErrors = true;
		}
		if(!$scope.userLoginData.password || $scope.userLoginData.password == 'undefined'){
			$scope.errorsText.loginPasswordError = 'Please enter your password!';
			$scope.errors.loginPassword = true;
			$scope.loginErrors = true;
		}

		if($scope.loginErrors == true) {
			return;
		}
		var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		if(!regexEmail.test($scope.userLoginData.email)){
			$scope.errorsText.loginEmailError = 'Please enter a valid email address!';
			$scope.errors.loginEmail = true;
			return;
		}

		localStorage.clear();		
		$auth.login(data)
			.then(function  (res) {
				AuthServices.setUserData(res.data.user);
				if($rootScope.lastAttachedUrl != 'undefined' && $rootScope.lastAttachedUrl != undefined){
					$location.path($rootScope.lastAttachedUrl);
				}else{
					$location.path('/dashboard');	
				}
				toaster.pop({type: 'success', body: res.data.success, showCloseButton: true});
			}, function  (err) {
				if(err.data.error == "Invalid email adress!") {
					$scope.errorsText.loginEmailError = "Invalid email adress!";
					$scope.errors.loginEmail = true;
					return;
				} else if(err.data.error == "Invalid Password") {
					$scope.errorsText.loginPasswordError = "Invalid Password";
					$scope.errors.loginPassword = true;
					return;
				} else {
					toaster.pop({type: 'error', body: err.data.error, showCloseButton: true});
					if(err.data.error === 'Please check your email address and confirm your account!'){
						$timeout(function  () {
							$location.path('/send-confirmation-code');

						}, 5000);
					}
				}
			});
	};
	$scope.animateInputs = function animateInputs(labelId, inputId) {
		$('#' + labelId).addClass('small-label');
		$('#' + inputId).addClass('small-label');
	};

	$scope.resetInputs = function resetInputs (labelId, inputId) {
		if($('#' + inputId).val()) {
			return;
		}
		$('#' + labelId).removeClass('small-label');
		$('#' + inputId).removeClass('small-label');
	}
}]);