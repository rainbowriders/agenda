minutes.controller('HelpController', ['$scope', 'HelpServices', 'toaster', '$rootScope',
function HelpController($scope, HelpServices, toaster, $rootScope){
	
	if(localStorage.isUserLoged){
		var firstName = localStorage.user_first_name || '';
		var lastName = localStorage.user_last_name || '';
		$scope.name = firstName + ' ' + lastName;
		$scope.email = localStorage.user_email;
	}
	
	$scope.cancel = function () {
    	$rootScope.modalInstance.dismiss('cancel');
  	};

	$scope.sendMessage = function sendMessage () {
		var data = {
			name: $scope.name,
			email: $scope.email,
			subject: $scope.subject,
			text: $scope.text
		};
		HelpServices.sendMessage(data)
			.then(function  (res) {
				$scope.cancel();
				toaster.pop({type: 'success', body: res.success, showCloseButton: true});
			}, function  (err) {
				console.log(err);
			});
	}


}]);