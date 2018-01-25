minutes.controller('NavbarController', 
['$scope', 
'$rootScope', 
'$location', 
'$timeout', 
'AuthServices', 
'toaster', 
'MeetingsServices',
'$uibModal',
'TemplateService',
function NavbarController(
$scope, 
$rootScope, 
$location, 
$timeout, 
AuthServices, 
toaster, 
MeetingsServices,
$uibModal,
TemplateService){

	$scope.showDashboardMenuItem = ($location.path() === '/dashboard' ? false : true);
	$scope.showTemplatesMenuItem = ($location.path().substring(0, 11) === '/templates' ? false : true);
	$scope.showNewTemplateBtn = ($location.path().substring(0, 11) == '/templates' ? true : false);
	if($rootScope.isUserLoged === true){
		$scope.userFirstName = localStorage.user_first_name;
		$scope.userLastName = localStorage.user_last_name;
	}
	$scope.logout = function logout () {
		AuthServices.logout();
		toaster.pop({type: 'success', body: 'Successful logout!', showCloseButton: true});
	};

	$scope.createNewMeeting = function createNewMeeting () {
		$rootScope.modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'views/partials/import-templates.html',
			controller: 'ImportTemplatesController',
			size: 'lg'
		});
	};

	$scope.createTemplate = function createTemplate () {
		TemplateService.create()
			.then(function (res) {
				$location.path('templates/' + res.template.uniqueStringID);
			});
	};

	$scope.location = $location.path();

	$scope.openHelpPageModal = function openHelpPageModal () {
		$rootScope.modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'views/partials/help-page-modal.html',
			controller: 'HelpController',
			size: 'lg'
		});
	}
}]);