minutes.factory('MeetingAttendantServices', ['$q', '$http', 
function MeetingAttendantServices($q, $http){

	var baseUrl = 'api/meeting-atendant';	
	function destroy (id, data) {
		var defer = $q.defer();
		$http({
			method: 'DELETE',
			url: baseUrl + '/' + id + '?meetingID=' + data.meetingID
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	}


	return {
		destroy: destroy
	}
}]);