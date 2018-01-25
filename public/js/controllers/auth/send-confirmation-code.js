minutes.controller('SendConfirmationCodeController', ['$scope', 'AuthServices', 'toaster',
function SendConfirmationCodeController ($scope, AuthServices, toaster) {
	//document.body.style.background = 'white';
	
	$scope.sendNewConfirmationCode = function sendNewConfirmationCode () {
		var data = {email: $scope.email};
		AuthServices.sendNewConfirmationCode(data)
			.then(function  (res) {
				toaster.pop({type: 'success', body: res.success, showCloseButton: true});
			},function  (err) {
				toaster.pop({type: 'error', body: err.error, showCloseButton: true});
			});
	};

}]);