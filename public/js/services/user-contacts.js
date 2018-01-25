minutes.factory('UserContactsServices', ['$q', '$http' , 
function UserContactsServices($q, $http){

	function show (pattern) {
		var defer = $q.defer();
		$http({
			method: 'GET',
			url: 'api/user-contacts?pattern=' + pattern
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	}

	return {
		show: show
	}
}]);