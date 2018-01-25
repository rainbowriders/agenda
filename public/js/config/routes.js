minutes.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {


		$routeProvider
			.when('/', {
				templateUrl: '/views/index.html'
			})
			.when('/login', {
				templateUrl: '/views/auth/login.html'
			})
			.when('/register', {
				templateUrl: '/views/auth/register.html'
			})
			.when('/new-password', {
				templateUrl: '/views/auth/reset-password.html'
			})
			.when('/reset-password', {
				templateUrl: '/views/auth/send-reset-password-link.html'
			})
			.when('/not-found', {
				templateUrl: '/views/not-found.html'
			})
			.when('/confirm-account/:stringId', {
				templateUrl: '/views/auth/confirm-account.html'
			})
			.when('/dashboard', {
				templateUrl: '/views/dashboard.html'
			})
			.when('/meeting/:stringId', {
				templateUrl: '/views/meeting-container.html'
			})
			.when('/templates', {
				templateUrl: '/views/templates-dashboard.html'
			})
			.when('/templates/:stringId', {
				templateUrl: '/views/template.html'
			})
			.otherwise('/not-found');
	}]);