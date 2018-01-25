minutes.controller('ResetPasswordController', ['$scope', '$location', '$timeout', 'AuthServices', 'toaster' , 
function ResetPasswordController($scope, $location, $timeout, AuthServices, toaster){

	$scope.token = $location.search()['reset-password-token'];
	$scope.errors = {
		password: false,
		confirmPassword: false
	};
	$scope.errorsText = {
		password: '',
		confirmPassword: ''
	};
	$scope.resetPassword = function resetPassword () {
		var data = {
			password: $scope.password,
			repeatPassword: $scope.confirmPassword,
			token: $scope.token
		};
		$scope.errors.password = false;
		$scope.errors.confirmPassword = false;
		if(!$scope.password) {
			$scope.errors.password = true;
			$scope.errorsText.password = 'Please enter your password!';
			return;
		}else if($scope.password.length < 6 ) {
			$scope.errors.password = true;
			$scope.errorsText.password = 'Password must contain at least 6 characters!';
			return;
		}else if($scope.password.length > 30 ) {
			$scope.errors.password = true;
			$scope.errorsText.password = 'Password must contain a maximum of 30 characters!';
			return;
		}
		if($scope.confirmPassword != $scope.password) {
			$scope.errors.confirmPassword = true;
			$scope.errorsText.confirmPassword = 'Password doesn\'t match';
			return;
		}
		AuthServices.resetPassword(data)
			.then(function  (res) {
				$location.path('/login');
				toaster.pop({type: 'success', body: res.success, showCloseButton: true});
			}, function  (err) {
				toaster.pop({type: 'error', body: err.error, showCloseButton: true});
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