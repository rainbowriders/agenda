minutes.factory('NoteServices', ['$q', '$http' , 
function NoteServices($q, $http){
	var baseUrl = 'api/note'

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

	function update (data, id) {
		var defer = $q.defer();
		$http({
			method: 'PUT',
			url: baseUrl + '/' + id,
			data:data
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	};

	function deleteNote (id) {
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
	}
	return {
		create: create,
		update: update,
		deleteNote: deleteNote
	}
}]);