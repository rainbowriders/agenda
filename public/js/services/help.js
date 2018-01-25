minutes.factory('HelpServices', ['$q', '$http' , 
function HelpServices($q, $http){

	var baseUrl = 'api/help'

	function sendMessage (data) {
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
	}

	return {
		sendMessage: sendMessage
	};
}])