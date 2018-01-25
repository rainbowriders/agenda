minutes.factory('TemplateService', ['$q', '$http',
function TemplateService ($q, $http) {

	var baseUrl = 'api/templates';

	function create() {
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
	}

	function show(uniqueStringID) {
		var defer = $q.defer();
		$http({
			method: 'GET',
			url: baseUrl + '/' + uniqueStringID
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	}

	function update (data, uniqueStringID) {
		var defer = $q.defer();
		$http({
			method: 'PUT',
			url: baseUrl + '/' + uniqueStringID,
			data: data
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	};

	function showAll(data) {
		var defer = $q.defer();
		var data = data || null;
		var url = data != null ? baseUrl + '?pattern=' + data.pattern : baseUrl;
		$http({
			method: 'GET',
			url: url
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	}

	function deleteTemplate(id) {
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
		show: show,
		update: update,
		showAll: showAll,
		deleteTemplate: deleteTemplate
	};
}]);