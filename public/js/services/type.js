minutes.factory('TypeServices', ['$q', '$http' , 
function TypeServices($q, $http){
	var baseUrl = 'api/types'
	function show () {
		var defer = $q.defer();
		$http({
			method: 'GET',
			url: baseUrl
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	}

	return {
		show:show
	};
}]);