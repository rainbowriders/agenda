minutes.controller('RegisterController', ['$scope', 'AuthServices', 'toaster', '$timeout', '$location',
function RegisterController($scope, AuthServices, toaster, $timeout, $location){

	$timeout(function () {
		if($scope.userRegData.email) {
			$scope.animateInputs('registerPasswordLabel', 'registerPassword');
			$scope.animateInputs('registerEmailLabel', 'registerEmail');
		}
	}, 1200);

	$scope.userRegData = {};
	$scope.errors = {
		registerFirstName: false,
		registerLastName: false,
		registerEmail: false,
		registerPassword: false
	};
	$scope.errorsText = {
		registerFirstNameError: '',
		registerLastNameError: '',
		registerEmailError: '',
		registerPasswordError: ''
	};
	$scope.registerErrors = false;

	$scope.register = function register () {
		var data = {
			email: $scope.userRegData.email,
			password: $scope.userRegData.password,
			first_name: $scope.userRegData.firstName,
			last_name: $scope.userRegData.lastName
		};

		$scope.errors.registerFirstName = false;
		$scope.errors.registerLastName = false;
		$scope.errors.registerEmail = false;
		$scope.errors.registerPassword = false;
		$scope.registerErrors = false;
		if(!$scope.userRegData.email) {
			$scope.errors.registerEmail = true;
			$scope.errorsText.registerEmailError = 'Please enter your email address!';
			$scope.loginErrors = true;
		}
		if(!$scope.userRegData.password) {
			$scope.errors.registerPassword = true;
			$scope.errorsText.registerPasswordError = 'Please enter your password!';
			$scope.loginErrors = true;
		}else if($scope.userRegData.password.length < 6 ) {
			$scope.errors.registerPassword = true;
			$scope.errorsText.registerPasswordError = 'Password must contain at least 6 characters!';
			$scope.registerErrors = true;
		}else if($scope.userRegData.password.length > 30 ) {
			$scope.errors.registerPassword = true;
			$scope.errorsText.registerPasswordError = 'Password must contain a maximum of 30 characters!';
			$scope.registerErrors = true;
		}
		if(!$scope.userRegData.firstName) {
			$scope.errors.registerFirstName = true;
			$scope.errorsText.registerFirstNameError = 'Please enter your first name!';
			$scope.registerErrors = true;
		}
		if(!$scope.userRegData.lastName) {
			$scope.errors.registerLastName = true;
			$scope.errorsText.registerLastNameError = 'Please enter your last name!';
			$scope.registerErrors = true;
		}
		if($scope.registerErrors == true) {
			return;
		}
		var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		if(!regexEmail.test($scope.userRegData.email)){
			$scope.errorsText.registerEmailError = 'Please enter a valid email address!';
			$scope.errors.registerEmail = true;
			return;
		}
		AuthServices.register(data)
			.then(function  (res) {
				toaster.pop({type: 'success', body: res.success, showCloseButton: true});
				$location.path('/login');
			}, function  (err) {
				if(err.error.email[0]){
					$scope.errorsText.registerEmailError = err.error.email[0];
					$scope.errors.registerEmail = true;
					return;
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