minutes.controller('SendResetPasswordLinkController', ['$scope', 'toaster', 'AuthServices' , '$location',
function SendResetPasswordLinkController($scope, toaster, AuthServices, $location){

	$scope.errors = {email: false};
	$scope.errorsText = {email: ''};

	$scope.sendResetPasswordLink = function sendResetPasswordLink () {

		$scope.errors.email = false;
		var data = {email: $scope.email};
		if(!$scope.email || $scope.email == 'undefined'){
			$scope.errorsText.email = 'Please enter your email address!';
			$scope.errors.email = true;
			return;
		}
		var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		if(!regexEmail.test($scope.email)){
			$scope.errorsText.email = 'Please enter a valid email address!';
			$scope.errors.email = true;
			return;
		}

		AuthServices.sendResetPasswordLink(data)
			.then(function  (res) {
				$location.path('/login');
				toaster.pop({type: 'success', body: res.success, showCloseButton: true});
			}, function  (err) {
				if(err.error == "Invalid email address!") {
					$scope.errorsText.email = "Invalid email address!";
					$scope.errors.email = true;
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