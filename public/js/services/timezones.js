minutes.factory('TimezonesServices',['$http', '$q', 
function TimezonesServices($http, $q){
	var baseUrl = 'api/user-time-zone';
	function get () {
		var zones = [
		  {"name": "(GMT+00:00) Casablanca", "offset": 0},
		  {"name": "(GMT+00:00) Coordinated Universal Time", "offset": 0},
		  {"name": "(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London", "offset": 0},
		  {"name": "(GMT+00:00) Monrovia, Reykjavik", "offset": 0},
		  {"name": "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna", "offset": 60},
		  {"name": "(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague", "offset": 60},
		  {"name": "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris", "offset": 60},
		  {"name": "(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb", "offset": 60},
		  {"name": "(GMT+01:00) West Central Africa", "offset": 60},
		  {"name": "(GMT+02:00) Amman", "offset": 120},
		  {"name": "(GMT+02:00) Athens, Bucharest, Istanbul", "offset": 120},
		  {"name": "(GMT+02:00) Beirut", "offset": 120},
		  {"name": "(GMT+02:00) Cairo", "offset": 120},
		  {"name": "(GMT+02:00) Damascus", "offset": 120},
		  {"name": "(GMT+02:00) Harare, Pretoria", "offset": 120},
		  {"name": "(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius", "offset": 120},
		  {"name": "(GMT+02:00) Jerusalem", "offset": 120},
		  {"name": "(GMT+02:00) Minsk", "offset": 120},
		  {"name": "(GMT+02:00) Windhoek", "offset": 120},
		  {"name": "(GMT+03:00) Baghdad", "offset": 180},
		  {"name": "(GMT+03:00) Kuwait, Riyadh", "offset": 180},
		  {"name": "(GMT+03:00) Moscow, St. Petersburg, Volgograd", "offset": 180},
		  {"name": "(GMT+03:00) Nairobi", "offset": 180},
		  {"name": "(GMT+03:30) Tehran", "offset": 210},
		  {"name": "(GMT+04:00) Abu Dhabi, Muscat", "offset": 240},
		  {"name": "(GMT+04:00) Baku", "offset": 240},
		  {"name": "(GMT+04:00) Port Louis", "offset": 240},
		  {"name": "(GMT+04:00) Tbilisi", "offset": 240},
		  {"name": "(GMT+04:00) Yerevan", "offset": 240},
		  {"name": "(GMT+04:30) Kabul", "offset": 270},
		  {"name": "(GMT+05:00) Ekaterinburg", "offset": 300},
		  {"name": "(GMT+05:00) Islamabad, Karachi", "offset": 300},
		  {"name": "(GMT+05:00) Tashkent", "offset": 300},
		  {"name": "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi", "offset": 330},
		  {"name": "(GMT+05:30) Sri Jayawardenepura", "offset": 330},
		  {"name": "(GMT+05:45) Kathmandu", "offset": 345},
		  {"name": "(GMT+06:00) Astana", "offset": 360},
		  {"name": "(GMT+06:00) Dhaka", "offset": 360},
		  {"name": "(GMT+06:00) Novosibirsk", "offset": 360},
		  {"name": "(GMT+06:30) Yangon (Rangoon)", "offset": 390},
		  {"name": "(GMT+07:00) Bangkok, Hanoi, Jakarta", "offset": 420},
		  {"name": "(GMT+07:00) Krasnoyarsk", "offset": 420},
		  {"name": "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi", "offset": 480},
		  {"name": "(GMT+08:00) Irkutsk", "offset": 480},
		  {"name": "(GMT+08:00) Kuala Lumpur, Singapore", "offset": 480},
		  {"name": "(GMT+08:00) Perth", "offset": 480},
		  {"name": "(GMT+08:00) Taipei", "offset": 480},
		  {"name": "(GMT+08:00) Ulaanbaatar", "offset": 480},
		  {"name": "(GMT+09:00) Osaka, Sapporo, Tokyo", "offset": 540},
		  {"name": "(GMT+09:00) Seoul", "offset": 540},
		  {"name": "(GMT+09:00) Yakutsk", "offset": 540},
		  {"name": "(GMT+09:30) Adelaide", "offset": 570},
		  {"name": "(GMT+09:30) Darwin", "offset": 570},
		  {"name": "(GMT+10:00) Brisbane", "offset": 600},
		  {"name": "(GMT+10:00) Canberra, Melbourne, Sydney", "offset": 600},
		  {"name": "(GMT+10:00) Guam, Port Moresby", "offset": 600},
		  {"name": "(GMT+10:00) Hobart", "offset": 600},
		  {"name": "(GMT+10:00) Vladivostok", "offset": 600},
		  {"name": "(GMT+11:00) Magadan, Solomon Is., New Caledonia", "offset": 660},
		  {"name": "(GMT+12:00) Auckland, Wellington", "offset": 720},
		  {"name": "(GMT+12:00) Coordinated Universal Time+12", "offset": 720},
		  {"name": "(GMT+12:00) Fiji", "offset": 720},
		  {"name": "(GMT+12:00) Petropavlovsk-Kamchatsky - Old", "offset": 720},
		  {"name": "(GMT+13:00) Nuku'alofa", "offset": 780},
		  {"name": "(GMT-01:00) Azores", "offset": -60},
		  {"name": "(GMT-01:00) Cape Verde Is.", "offset": -60},
		  {"name": "(GMT-02:00) Coordinated Universal Time-02", "offset": -120},
		  {"name": "(GMT-02:00) Mid-Atlantic", "offset": -120},
		  {"name": "(GMT-03:00) Brasilia", "offset": -180},
		  {"name": "(GMT-03:00) Buenos Aires", "offset": -180},
		  {"name": "(GMT-03:00) Cayenne, Fortaleza", "offset": -180},
		  {"name": "(GMT-03:00) Greenland", "offset": -180},
		  {"name": "(GMT-03:00) Montevideo", "offset": -180},
		  {"name": "(GMT-03:30) Newfoundland", "offset": -210},
		  {"name": "(GMT-04:00) Asuncion", "offset": -240},
		  {"name": "(GMT-04:00) Atlantic Time (Canada)", "offset": -240},
		  {"name": "(GMT-04:00) Cuiaba", "offset": -240},
		  {"name": "(GMT-04:00) Georgetown, La Paz, Manaus, San Juan", "offset": -240},
		  {"name": "(GMT-04:00) Santiago", "offset": -240},
		  {"name": "(GMT-04:30) Caracas", "offset": -270},
		  {"name": "(GMT-05:00) Bogota, Lima, Quito", "offset": -300},
		  {"name": "(GMT-05:00) Eastern Time (US & Canada)", "offset": -300},
		  {"name": "(GMT-05:00) Indiana (East)", "offset": -300},
		  {"name": "(GMT-06:00) Central America", "offset": -360},
		  {"name": "(GMT-06:00) Central Time (US & Canada)", "offset": -360},
		  {"name": "(GMT-06:00) Guadalajara, Mexico City, Monterrey", "offset": -360},
		  {"name": "(GMT-06:00) Saskatchewan", "offset": -360},
		  {"name": "(GMT-07:00) Arizona", "offset": -420},
		  {"name": "(GMT-07:00) Chihuahua, La Paz, Mazatlan", "offset": -420},
		  {"name": "(GMT-07:00) Mountain Time (US & Canada)", "offset": -420},
		  {"name": "(GMT-08:00) Baja California", "offset": -480},
		  {"name": "(GMT-08:00) Pacific Time (US & Canada)", "offset": -480},
		  {"name": "(GMT-09:00) Alaska", "offset": -540},
		  {"name": "(GMT-10:00) Hawaii", "offset": -600},
		  {"name": "(GMT-11:00) Coordinated Universal Time-11", "offset": -660},
		  {"name": "(GMT-11:00) Samoa", "offset": -660},
		  {"name": "(GMT-12:00) International Date Line West", "offset": -720}
		]

		return zones;
	};

	function create (data) {
		var defer = $q.defer();
		$http({
			method: 'POST',
			url: baseUrl,
			data: data
		}).success(function (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;
	};

	function update (data,id) {
		var defer = $q.defer();
		$http({
			method: 'PUT',
			url: baseUrl + '/' + id,
			data: data
		}).success(function  (res) {
			defer.resolve(res);
		}).error(function  (err) {
			defer.reject(err);
		});

		return defer.promise;	
	};

	return {
		get: get,
		create: create,
		update: update
	}
}])