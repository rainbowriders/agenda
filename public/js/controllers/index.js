minutes.controller('IndexPageController', 
['$scope',
'$rootScope',
'$auth',
'$location',
'$timeout',
'AuthServices',
'anchorSmoothScroll',
'toaster',
'HelpServices',
function IndexPageController(
$scope,
$rootScope,
$auth, 
$location,
$timeout,
AuthServices,
anchorSmoothScroll,
toaster,
HelpServices){


	$scope.start = function start () {
		if(!$rootScope.isUserLoged){
			$scope.startLoginUser();
		}else {
			$location.path('/dashboard');
		}
	};
	$scope.goHome = function goHome(evt) {
		anchorSmoothScroll.scrollTo('home-slide');
	};
	$scope.goAbout = function goAbout() {
		anchorSmoothScroll.scrollTo('about-slide');
	};
	$scope.goFeatures = function goFeatures () {
		anchorSmoothScroll.scrollTo('features-slide');
	};
	$scope.goContact = function goContact () {
		anchorSmoothScroll.scrollTo('contact-form');
	};


	//Login form
	$scope.startLoginUser = function startLoginUser () {
		if($rootScope.isUserLoged) {
			$location.path('/dashboard');
		} else {
			$location.path('/login');
		}
	};
	$scope.loginRememberMe = false;
	$scope.loginPasswordError = false;
	$scope.loginEmailError = false;
	$scope.loginErrors = false;

	$scope.login = function login () {
		localStorage.clear();
		$scope.loginPasswordError = false;
		$scope.loginEmailError = false;
		$scope.loginErrors = false;
		$scope.loginEmailErrorText = '';
		var user = {
			email: $scope.loginEmail,
			password: $scope.loginPassword
		};
		if($scope.loginRememberMe === true){
			user.rememberMe = true;
		}
		//check all inputs are exists
		$scope.loginErrors = false;
		if(!$scope.loginEmail || $scope.loginEmail == 'undefined'){
			$scope.loginEmailErrorText = 'Please enter your email address!';
			$scope.loginErrors = true;
			$scope.loginEmailError = true;
		}
		if(!$scope.loginPassword || $scope.loginPassword == 'undefined'){
			$scope.loginPasswordErrorText = 'Please enter your password!';
			$scope.loginErrors = true;
			$scope.loginPasswordError = true;
		}
		if($scope.loginErrors == true){
			return;
		}
		//check if email is in valid format
		var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		if(!regexEmail.test(user.email)){
			$scope.loginEmailErrorText = 'Please enter a valid email address!';
			$scope.loginEmailError = true;
			return;
		}
		$scope.loginPasswordError = false;
		$scope.loginEmailError = false;

		$auth.login(user)
			.then(function (res) {
				AuthServices.setUserData(res.data.user);
				$('.modal-backdrop').remove();
				if($rootScope.lastAttachedUrl &&
					$rootScope.lastAttachedUrl != '/login'){
					$location.path($rootScope.lastAttachedUrl);
				}else{
					$location.path('/dashboard');
				}
				toaster.pop({type: 'success', body: res.data.success, showCloseButton: true});
			}, function (err) {
				if(err.data.error === 'Please check your email address and confirm your account!'){
					toaster.pop({type: 'error', body: err.data.error, showCloseButton: true});
					return;
				}
				if(err.data.error == 'Invalid email adress!'){
					$scope.loginEmailErrorText = 'Invalid email address!';
					$scope.loginEmailError = true;
					$scope.loginErrors = true;
				} else {
					$scope.loginPasswordErrorText = 'Invalid Password!';
					$scope.loginErrors = true;
					$scope.loginPasswordError = true;
				}
			});
	};
	// End Login Form

	//Register Form
	$scope.startRegisterUser = function startRegsiterUser () {

		$scope.registerFirstNameError = false;
		$scope.registerLastNameError = false;
		$scope.registerPasswordError = false;
		$scope.registerEmailError = false;
		$scope.registerEmail = '';
		$scope.registerFirstName = '';
		$scope.registerLastName = '';
		$scope.registerPassword = '';

		$scope.resetInput('registerFirstNameLabel', 'registerFirstNameInput');
		$scope.resetInput('registerLastNameLabel', 'registerLastNameInput');
		$scope.resetInput('registerPasswordLabel', 'registerPasswordInput');
		$scope.resetInput('registerEmailLabel', 'registerEmailInput');
		$('#registerModal').modal('toggle');
	};

	$scope.register = function register () {
		localStorage.clear();
		var registerUser = {
			email: $scope.registerEmail,
			first_name: $scope.registerFirstName,
			last_name: $scope.registerLastName,
			password: $scope.registerPassword
		};
		$scope.registerErrors = false;
		if(!$scope.registerEmail || $scope.registerEmail == 'undefined'){
			$scope.registerEmailError = true;
			$scope.registerEmailErrorText = 'Please enter your email address!';
			$scope.registerErrors = true;
		}
		if(!$scope.registerFirstName || $scope.registerFirstName == 'undefined') {
			$scope.registerFirstNameError = true;
			$scope.registerFirstNameErrorText = 'Please enter your first name!';
			$scope.registerErrors = true;
		}
		if(!$scope.registerLastName || $scope.registerLastName == 'undefined') {
			$scope.registerLastNameError = true;
			$scope.registerLastNameErrorText = 'Please enter your last name!';
			$scope.registerErrors = true;
		}
		if(!$scope.registerPassword || $scope.registerPassword == 'undefined') {
			$scope.registerPasswordError = true;
			$scope.registerPasswordErrorText = 'Please enter your password!';
			$scope.registerErrors = true;
		}
		if($scope.registerPassword.length < 6 ) {
			$scope.registerPasswordError = true;
			$scope.registerPasswordErrorText = 'Password must contain at least 6 characters!';
			$scope.registerErrors = true;
		}
		if($scope.registerPassword.length > 30 ) {
			$scope.registerPasswordError = true;
			$scope.registerPasswordErrorText = 'Password must contain a maximum of 30 characters!';
			$scope.registerErrors = true;
		}
		//check if email is in valid format
		var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		if(!regexEmail.test(registerUser.email)){
			$scope.registerEmailErrorText = 'Please enter a valid email address!';
			$scope.registerEmailError = true;
			$scope.registerErrors = true;
		}
		if($scope.registerErrors == true) {
			return ;
		}
		$scope.registerFirstNameError = false;
		$scope.registerLastNameError = false;
		$scope.registerPasswordError = false;
		$scope.registerEmailError = false;

		AuthServices.register(registerUser)
			.then(function  (res) {
				$('#registerModal').modal('toggle');
				$('#loginModal').modal('toggle');
				toaster.pop({type: 'success', body: res.success, showCloseButton: true});
			}, function  (err) {
				$scope.registerEmailErrorText = 'The email has already been taken!';
				$scope.registerEmailError = true;
				$scope.registerErrors = true;
			});
	};
	//End Register Form

	//Send reset password email form

	$scope.openResetPasswordForm = function openResetPasswordForm() {

		$('#loginModal').modal('toggle');
		$('#resetPasswordModal').modal('toggle');
		$scope.resetErrors = false;
		$scope.resetEmailError = false;
		$scope.resetEmailErrorText = '';
	};

	$scope.resetErrors = false;
	$scope.resetEmailError = false;
	$scope.resetEmailErrorText = '';

	$scope.sendResetEmail = function sendResetEmail () {
		var data = {email: $scope.resetEmail};
		var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		if(!regexEmail.test($scope.resetEmail)){
			$scope.resetEmailErrorText = 'Please enter a valid email address!';
			$scope.resetEmailError = true;
			$scope.resetErrors = true;
			return;
		}
		$scope.resetErrors = false;
		$scope.resetEmailError = false;
		$scope.resetEmailErrorText = '';

		AuthServices.sendResetPasswordLink(data)
			.then(function  (res) {
				toaster.pop({type: 'success', body: res.success, showCloseButton: true});
				$location.path('/');
				$scope.resetEmail = '';
			}, function  (err) {
				$scope.resetErrors = true;
				$scope.resetEmailError = true;
				$scope.resetEmailErrorText = 'Invalid email address!';
			});
	};
	//End send reset password email form

	//Set new password
	$scope.checkForResetToken = function () {
		if($location.search()['reset-password-token']){

			var checkTokenData = {
				token: $location.search()['reset-password-token'],
				check_token: true
			};
			AuthServices.resetPassword(checkTokenData)
				.then(function (res) {
					$('#newPasswordModal').modal('toggle');
				}, function (err) {
					toaster.pop({type: 'error', body: err.error, showCloseButton: true});
					$location.url($location.path());
					$location.path('/reset-password');
				})
		}
	};

	$scope.newPasswordErrors = false;
	$scope.newPasswordError = false;
	$scope.confirmNewPasswordError = false;
	$scope.resetPassword = function resetPassword () {
		var data = {
			password: $scope.newPassword,
			repeatPassword: $scope.repeatNewPassword,
			token: $location.search()['reset-password-token']
		};
		if(data.password == 'undefined' || !data.password) {
			$scope.newPasswordError = true;
			$scope.newPasswordErrors = true;
			$scope.newPasswordErrorText = 'Please enter your new password!';
		}
		if(data.repeatPassword == 'undefined' || !data.repeatPassword) {
			$scope.confirmNewPasswordError = true;
			$scope.newPasswordErrors = true;
			$scope.confirmNewPasswordErrorText = 'Please confirm your new password!';
		}
		if(data.password.length < 6) {
			$scope.newPasswordError = true;
			$scope.newPasswordErrors = true;
			$scope.newPasswordErrorText = 'Password must contain at least 6 characters!'
		}
		if(data.password.length > 30 ) {
			$scope.newPasswordError = true;
			$scope.newPasswordErrors = true;
			$scope.newPasswordErrorText = 'Password must contain a maximum of 30 characters!';
		}
		if(data.password != data.repeatPassword) {
			$scope.confirmNewPasswordError = true;
			$scope.newPasswordErrors = true;
			$scope.confirmNewPasswordErrorText = 'Password does not match!';
		}
		if($scope.newPasswordErrors == true) {
			return;
		}
		AuthServices.resetPassword(data)
			.then(function  (res) {
				$scope.startLoginUser();
				toaster.pop({type: 'success', body: res.success, showCloseButton: true});
			}, function  (err) {
				toaster.pop({type: 'error', body: err.error, showCloseButton: true});
			});
	};
	//End Set new password

	//Contact form

	$scope.contactUs = function contactUs () {
		var data = {
			name: $scope.contactFormName,
			email: $scope.contactFormEmail,
			subject: $scope.contactFormSubject,
			text: $scope.contactFormMessage
		};

		if((data.name == 'undefined' || !data.name)
			|| (data.email == 'undefined' || !data.email)
			|| (data.subject == 'undefined' || !data.subject)
			|| (data.text == 'undefined' || !data.text)) {
			toaster.pop({type: 'error', body: 'The information in all fields are required, please fill all!', showCloseButton: true});
			return;
		}
		var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		if(!regexEmail.test(data.email)){
			toaster.pop({type: 'error', body: 'Please enter a valid email address!', showCloseButton: true});
			return;
		}

		HelpServices.sendMessage(data)
			.then(function  (res) {
				$scope.contactFormName = '';
				$scope.contactFormEmail = '';
				$scope.contactFormSubject = '';
				$scope.contactFormMessage = '';
				toaster.pop({type: 'success', body: res.success, showCloseButton: true});
			});
	}

	$('#home-slide').on('scrollSpy:enter', function() {
		setActiveNavElement($(this).attr('id'));
	});
	//$('#home-slide').on('scrollSpy:exit', function() {
	//	console.log('exit:', $(this).attr('id'));
	//});
	$('#home-slide').scrollSpy();


	$('#about-slide').on('scrollSpy:enter', function() {
		setActiveNavElement($(this).attr('id'));
	});
	//$('#about-slide').on('scrollSpy:exit', function() {
	//	console.log('exit:', $(this).attr('id'));
	//});
	$('#about-slide').scrollSpy();


	$('#features-slide').on('scrollSpy:enter', function() {
		setActiveNavElement($(this).attr('id'));
	});
	//$('#features-slide').on('scrollSpy:exit', function() {
	//	console.log('exit:', $(this).attr('id'));
	//});
	$('#features-slide').scrollSpy();


	$('#contact-form').on('scrollSpy:enter', function() {
		setActiveNavElement($(this).attr('id'));
	});
	//$('#contact-form').on('scrollSpy:exit', function() {
	//	console.log('exit:', $(this).attr('id'));
	//});
	$('#contact-form').scrollSpy();

	function setActiveNavElement(elId) {
		var slides = ['home-slide', 'about-slide', 'features-slide', 'contact-form'];
		var liElements = ['home-slide-link', 'about-slide-link', 'features-slide-link', 'contact-form-link'];
		for(var i in slides) {
			if(slides[i] == elId) {
				$('#' + liElements[i]).addClass('active-btn-nav ');
			} else {
				$('#' + liElements[i]).removeClass('active-btn-nav ');
			}
		}
	}

	$scope.animateInputs = function (labelId) {
		var labelFontSize = parseInt($('#' + labelId).css('font-size'));
		var labelMarginTop = parseInt($('#' + labelId).css('margin-top'));
		if(labelFontSize == 12) {
			return;
		}
		$('#' + labelId).css('font-size', '12px');
		$('#' + labelId).css('margin-top', '10px');

	};
	$scope.resetInput = function (labelId, inputId) {
		if($('#' + inputId).val().length > 0) {
			return;
		}
		$('#' + labelId).css('font-size', '16px');
		$('#' + labelId).css('margin-top', '18px');
	};

	$scope.goInsideInput =  function goInsideInput (labelId, inputId) {
		$('#' + inputId).focus();
		$scope.animateInputs(labelId);
	};


	$scope.$on('$routeChangeSuccess', function () {
		$('#loginModal').modal('hide');
		$('#registerModal').modal('hide');
		$('#resetPasswordModal').modal('hide');
		$('#newPasswordModal').modal('hide');

		if($location.path() == '/login') {
			$location.url($location.path());
			if($rootScope.isUserLoged) {
				$location.path('/dashboard');
			} else {
				$('#loginModal').modal('toggle');

				var isChromium = window.chrome,
					isOpera = window.navigator.userAgent.indexOf("OPR") > -1 || window.navigator.userAgent.indexOf("Opera") > -1;
				//if(isChromium !== null && isOpera == true) {
					$timeout(function () {
						if($('#loginEmailInput').val().length > 0) {
							$scope.animateInputs('loginEmailLabel');
						}
						if($('#loginPasswordInput').val().length > 0) {
							$scope.animateInputs('loginPasswordLabel');
						}
					}, 1200);
				//} else {
				//	$timeout(function () {
				//		if($('#loginEmailInput').val().length > 0) {
				//			$scope.animateInputs('loginEmailLabel');
				//		}
				//		if($('#loginPasswordInput').val().length > 0) {
				//			$scope.animateInputs('loginPasswordLabel');
				//		}
				//	}, 200);
				//}

			}
		}

		if($location.path() == '/register') {
			$location.url($location.path());
			$('#registerModal').modal('toggle');
		}

		if($location.path() == '/reset-password') {
			$location.url($location.path());
			$('#resetPasswordModal').modal('toggle');
		}

		if($location.path() == '/new-password') {
			$scope.checkForResetToken();
		}

		if($location.path() == '/'){
			$location.url($location.path());
			$('.modal-backdrop').remove();
		}
	});

	$('#loginModal').on('hidden.bs.modal', function () {
		window.location = '#/';
	});
	$('#registerModal').on('hidden.bs.modal', function () {
		window.location = '#/';
	});
	$('#resetPasswordModal').on('hidden.bs.modal', function () {
		window.location = '#/';
	});
	$('#newPasswordModal').on('hidden.bs.modal', function () {
		window.location = '#/';
	})
}]);