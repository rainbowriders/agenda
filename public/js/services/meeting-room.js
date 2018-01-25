minutes.factory('MeetingRoomServices', ['$q', '$http' , 
function MeetingsServices($q, $http){
	var baseUrl = 'api/meeting-room';
	function create (data) {
		var defer = $q.defer();
		$http({
			method: 'POST',
			url: baseUrl,
			data: data
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	};

	function show (id) {
		var defer = $q.defer();
		$http({
			method: 'GET',
			url: baseUrl + '/' + id
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	}

	function setOpen (data) {
		var defer = $q.defer();
		$http({
			method: 'PUT',
			url: baseUrl + '/' + data.uniqueStringID,
			data: data
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	}
	return {
		create: create,
		show: show,
		setOpen: setOpen
	}
}]);