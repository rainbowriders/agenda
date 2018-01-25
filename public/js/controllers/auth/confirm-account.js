minutes.controller('ConfirmAccountController', ['$scope', '$location', '$timeout', 'toaster', 'AuthServices',
function ConfirmAccountController ($scope, $location, $timeout, toaster, AuthServices) {

	// $scope.confirmAccount = function confirmAccount () {
	// 	var token = {token: $location.path().substring(17, $location.path().length)};
	// 	AuthServices.confirmAccount(token)
	// 		.then(function  (res) {
	// 			toaster.pop({type: 'success', body: res.success, showCloseButton: true});
	// 			$timeout(function  () {
	// 				$location.path('/login');
	// 			}, 5000);
	// 		},function  (err) {
	// 			toaster.pop({type: 'error', body: err.error, showCloseButton: true});
	// 		});
	// };
	
	var token = {token: $location.path().substring(17, $location.path().length)};
	AuthServices.confirmAccount(token)
		.then(function  (res) {
			$location.path('/');
			toaster.pop({type: 'success', body: res.success, showCloseButton: true});
		},function  (err) {
			$location.path('/');
			$location.search('login=true');
			toaster.pop({type: 'error', body: err.error, showCloseButton: true});
		});
}]);