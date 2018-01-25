minutes.factory('MeetingsServices', ['$q',  '$http', '$rootScope',
function MeetingsServices($q, $http, $rootScope){
	
	var baseUrl = 'api/meeting';

	function showAll (filters, pattern) {
		var pattern = pattern || null;
		var filters = filters;
		var defer = $q.defer();
		$http({
			method: 'GET',
			url: generateUrl(filters, pattern)
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err)
		});

		return defer.promise;
	};

	function show (meetingId) {
		var defer = $q.defer();
		$http({
			method: 'GET',
			url: baseUrl + '/' + meetingId
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;	
	};

	function create () {
		var defer = $q.defer();
		$http({
			method: 'POST',
			url: baseUrl
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;	
	};

	function generateUrl (filters, pattern) {
		if($rootScope.isUserLoged === false){
			if(filters.filed === true){
				return baseUrl + '?' + 'filed=1';
			}
			if(pattern !== null){
				return baseUrl + '?' + 'pattern=' + pattern;
			}
			return baseUrl;
		}else{
			var filed = (filters.filed === true ? '&filed=1': '');
			if(filters.own === true){
				return baseUrl + '?show=own' + filed;	
			}
			if(filters.attendant === true){
				return baseUrl + '?show=attendant' + filed;
			}
			if(pattern !== null){
				return baseUrl + '?pattern=' + pattern;
			}
			return baseUrl + '?show=all' + filed;
		}
	};

	function update (data, meetingId) {
		var defer = $q.defer();
		$http({
			method: 'PUT',
			url: baseUrl + '/' + meetingId,
			data: data
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	};

	function deleteMeeting (id) {
		var defer = $q.defer();
		$http({
			method: 'DELETE',
			url: baseUrl + '/' + id
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	};

	function sendEmail (data) {
		var defer = $q.defer();
		$http({
			method: 'POST',
			url: baseUrl + '/send-emails',
			data: data
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});


		return defer.promise;
	};

	function sendInvities (data) {
		var defer = $q.defer();
		$http({
			method: 'POST',
			url: baseUrl + '/send-invities',
			data: data
		}).success(function (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	};

	function findUser (data) {
		var defer = $q.defer();
		$http({
			method: 'POST',
			url: 'api/user',
			data: data
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;	
	};

	function createFromTemplate(data) {
		var defer = $q.defer();
		$http({
			method: 'POST',
			url: baseUrl + '/create-from-template',
			data: data
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	}

	return {
		showAll: showAll,
		create: create,
		show: show,
		update: update,
		deleteMeeting: deleteMeeting,
		sendEmail: sendEmail,
		sendInvities: sendInvities,
		findUser: findUser,
		createFromTemplate: createFromTemplate
	};
}]);