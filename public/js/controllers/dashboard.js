minutes.controller('DashboardController', ['$scope', '$rootScope', 'MeetingsServices', '$timeout', '$location', '$auth', 'AuthServices', '$uibModal',
	function DashboardController($scope, $rootScope, MeetingsServices, $timeout, $location, $auth, AuthServices, $uibModal){
		document.body.style.background = '#F3F4F8';
		$scope.isUserLoged = $rootScope.isUserLoged;
		$scope.filterBtns = {filed: false, own: false, attendant: false};
		$scope.searchWasDirty = false;
		if(localStorage.getItem('satellizer_token') == null && localStorage.getItem('remember_token') != null) {

			var data = {'remember_token' : localStorage.getItem('remember_token')};
			$auth.login(data)
				.then(function (res) {
					AuthServices.setUserData(res.data.user);
					loadMeetings($scope.filterBtns);
				}, function (err) {
					AuthServices.logout();
					$location.path('/login');
				});
		} else if(localStorage.getItem('satellizer_token') == null && localStorage.getItem('remember_token') == null){
			localStorage.clear();
			$rootScope.isUserLoged = false;
			$location.path('/login');
		} else {
			loadMeetings($scope.filterBtns);
		}
		$scope.loadMeetingsWithFilters = function loadMeetingsWithFilters (btn) {
			for(var i in $scope.filterBtns){
				if(i === btn){
					$scope.filterBtns[i] = !$scope.filterBtns[i];
				}else{
					$scope.filterBtns[i] = false;
				}
			}
			$scope.searchPattern = null;
			loadMeetings($scope.filterBtns);
		};
		$scope.search = function search () {
			if($scope.searchPattern !== ''){
				var temp = $scope.searchPattern;
				$timeout(function  () {
					if(temp === $scope.searchPattern){
						loadMeetings($scope.filterBtns, $scope.searchPattern);
						$scope.searchWasDirty = true;
					}
				}, 500);
			}
			if($scope.searchWasDirty && $scope.searchPattern === ''){
				$timeout(function  () {
					$scope.searchWasDirty = false;
					loadMeetings($scope.filterBtns);
				}, 500);
			}
		};

		$scope.clearSearchField = function clearSearchField () {
			$scope.searchPattern = null;
			loadMeetings($scope.filterBtns);
		};
		$scope.openMeeting = function openMeeting (id) {
			$location.path('/meeting/' + id);
		};


		function loadMeetings (filters, pattern) {
			var filters = filters;
			var pattern = pattern || null;
			MeetingsServices.showAll(filters, pattern)
				.then(function  (res) {
					$scope.meetings = res.meetings;
					for (var i = 0; i < $scope.meetings.length; i++) {
						$scope.meetings[i].title = $scope.meetings[i].title || 'Meeting title';
						$scope.meetings[i].place = $scope.meetings[i].place || 'Meeting place';
						for (var a = 0; a < $scope.meetings[i].attendants.length; a++) {
							if($scope.meetings[i].attendants[a].meeting_attendant === $scope.meetings[i].minute_taker){
								$scope.meetings[i].attendants.splice(a, 1);
								break;
							}
						}
					}
					for (var i = 0; i < $scope.meetings.length; i++) {
						if(res.timeZones[i] != null){
							var offset = res.timeZones[i].offset;
							var startTime = new Date($scope.meetings[i].start_time);
							var endTime = new Date($scope.meetings[i].end_time);
							$scope.meetings[i].start_time = new Date(startTime.setMinutes(startTime.getMinutes() + parseInt(offset)));
							$scope.meetings[i].end_time = new Date(endTime.setMinutes(endTime.getMinutes() + parseInt(offset)));
						}
					}
				}, function (err) {
					if(localStorage.getItem('remember_token') != null) {

						var data = {'remember_token': localStorage.getItem('remember_token')};
						$auth.login(data)
							.then(function (res) {
								AuthServices.setUserData(res.data.user);
								loadMeetings($scope.filterBtns);
							}, function (err) {
								AuthServices.logout();
								$location.path('/login');
							});
					} else {
						AuthServices.logout();
						$location.path('/login');
					}
				});
		}
	}]);