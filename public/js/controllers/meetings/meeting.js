minutes.controller('MeetingController', 
['$scope',
'$rootScope', 
'MeetingsServices',
'$location',
'MeetingAttendantServices',
'UserContactsServices',
'MeetingAgendaServices',
'$uibModal',
'TypeServices',
'NoteServices',
'$window',
'toaster',
'$interval',
'$sce',
'$timeout',
'TimezonesServices',
'$document',
'$auth',
'AuthServices',
function MeetingController(
$scope,
$rootScope,
MeetingsServices,
$location,
MeetingAttendantServices,
UserContactsServices,
MeetingAgendaServices,
$uibModal,
TypeServices,
NoteServices,
$window,
toaster,
$interval,
$sce,
$timeout,
TimezonesServices,
$document,
$auth,
AuthServices
){
	// userContacts();
	$scope.resolution = screen.width;
	$scope.showDatePicker = false;
	$scope.showEndDatePicker = false;
	$scope.showEndTimePicker = false;
	$scope.showStartTimePicker = false;
	$scope.requiredAgendaText = 'successAgendaText';
	$scope.agendaForDeleteId = null;
	$scope.userIsMinuteTaker = false;
	$scope.userIsOwner = false;
	$scope.isCurrUserInAttList = false;
	$scope.agendaInEditMode = [];
	$scope.timeZones = TimezonesServices.get();
	$scope.showTimeZoneDD = false;
	var date = new Date();

	$rootScope.$on( "$routeChangeStart", function() {
		$scope.typing = true;
	});

	if(localStorage.getItem('satellizer_token') == null && localStorage.getItem('remember_token') != null) {

		var data = {'remember_token' : localStorage.getItem('remember_token')};
		$auth.login(data)
			.then(function (res) {
				AuthServices.setUserData(res.data.user);
				loadMeeting();
			}, function (err) {
				AuthServices.logout();
				$location.path('/login');
			});
	} else if(localStorage.getItem('satellizer_token') == null && localStorage.getItem('remember_token') == null){
		localStorage.clear();
		$rootScope.isUserLoged = false;
		$location.path('/login');
	} else {
		loadMeeting();
	}

	$scope.hidePickers = function hidePickers (event) {
		if(event.originalEvent.toElement.id != 'start_time_dropdown_input'
			&& $scope.showStartTimePicker == true) {
			$scope.showStartTimePicker = false;
		}
		if((event.originalEvent.toElement.id != 'time-zone-dropdown-btn' && event.originalEvent.toElement.id != 'time-zone-dropdown-link' )
			&& $scope.showTimeZoneDD == true) {
			$scope.showTimeZoneDD = false;
		}
		if(event.originalEvent.toElement.id != 'end_time_dropdown_input'
		&& $scope.showEndTimePicker == true) {
			$scope.showEndTimePicker = false;
		}
		if(event.originalEvent.toElement.id != 'show-start-date-picker'
			&& $scope.showDatePicker == true) {
			$scope.showDatePicker = false;
		}
		if(event.originalEvent.toElement.id != 'show-end-date-picker'
			&& $scope.showEndDatePicker == true) {
			$scope.showEndDatePicker = false;
		}
		return false;
	};
	$scope.refresh = function refresh (time) {
    	$interval(function  () {
    //  	if(($scope.meeting.started == 1) && $scope.userIsMinuteTaker){
 			// $interval.cancel(refresh);
 			// return;
    //  	}
     	if($scope.typing === true){
 			$interval.cancel(refresh);
 			return;
     	}else{
     		loadMeeting();
     	}
		},time)
    };

    $scope.refresh(5000);
    $scope.stopInterval = function stopInterval () {
    	$scope.typing = true;
  	};

	$scope.updateMeetingTitle = function updateMeetingTitle () {
		var data = {title: $scope.meeting.title};
		$scope.typing = false;
		MeetingsServices.update(data, $scope.meetingId)
			.then(function  (res) {
				return;
			});
	};
	$scope.setDate = function setDate () {
		$scope.showDatePicker = !$scope.showDatePicker;
		var data = {date: $scope.meeting.date};
		if(new Date($scope.meeting.end_date) < new Date($scope.meeting.date)) {
			$scope.meeting.end_date = $scope.meeting.date;
			data.end_date = $scope.meeting.end_date;
		}
		$scope.typing = false;
		MeetingsServices.update(data, $scope.meetingId)
			.then(function  (res) {
				return;
			});
	};
	$scope.showCalendar = function showCalendar () {
		if(!$scope.userIsMinuteTaker && !$scope.userIsOwner){
			return;
		}
		$scope.typing = true;
		$scope.showDatePicker = !$scope.showDatePicker;
	};
	$scope.setEndDate = function setEndDate () {
		$scope.showEndDatePicker = !$scope.showEndDatePicker;
		if(new Date($scope.meeting.end_date) < new Date($scope.meeting.date)) {
			$scope.meeting.end_date = $scope.meeting.date;
		}
		var data = {end_date: $scope.meeting.end_date};
		$scope.typing = false;
		MeetingsServices.update(data, $scope.meetingId)
			.then(function  (res) {
				return;
			});
	};
	$scope.showEndDateCalendar = function showEndDateCalendar () {
		if(!$scope.userIsMinuteTaker){
			return;
		}
		$scope.typing = true;
		$scope.showEndDatePicker = !$scope.showEndDatePicker;
	};


	$scope.hstep = 1;
  	$scope.mstep = 1;

	$scope.options = {
		hstep: [1, 2, 3],
		mstep: [1, 5, 10, 15, 25, 30]
	};

  	$scope.ismeridian = false;
 	$scope.showEndPicker = function showEndPicker () {
 		if(!$scope.userIsMinuteTaker && !$scope.userIsOwner){
			return;
		}
		$scope.typing = true;
 		$scope.showEndTimePicker = !$scope.showEndTimePicker;
 	};
 	$scope.showStartPicker = function showStartPicker () {
 		if(!$scope.userIsMinuteTaker && !$scope.userIsOwner){
			return;
		}
		$scope.typing = true;
 		$scope.showStartTimePicker = !$scope.showStartTimePicker;
 	};
 	$scope.setStartTime = function setStartTime (hour) {
		if(typeof hour == 'string'){
			var regex = /[\d]{2}[:][\d]{2}/;
			var regex2 = /[\d]{1}[:][\d]{2}/;
			if(regex.test(hour) || regex2.test(hour)){
				var match = regex.exec(hour);
				if(!match) {
					match = regex2.exec(hour);
				}
				var timeArray = match[0].split(":");
				$scope.meeting.start_time = new Date($scope.meeting.start_time.setHours(parseInt(timeArray[0])));
				$scope.meeting.start_time = new Date($scope.meeting.start_time.setMinutes(parseInt(timeArray[1])));
			} else {
				$scope.start_time_to_string = timeToStringForInputs($scope.meeting.start_time);
				return;
			}
		} else {
			$scope.meeting.start_time = hour;
		}
		$scope.start_time_to_string = timeToStringForInputs($scope.meeting.start_time);
 		$scope.showStartTimePicker = false;
		var data = {};
		if(new Date($scope.meeting.end_time).getHours() != 0) {
			if((new Date($scope.meeting.end_time).getHours() < new Date($scope.meeting.start_time).getHours())
				|| ((new Date($scope.meeting.end_time).getHours() == new Date($scope.meeting.start_time).getHours()) &&
				(new Date($scope.meeting.end_time).getMinutes() < new Date($scope.meeting.start_time).getMinutes()))){
				toaster.pop({type: 'error', body: 'The end time cannot be earlier than the start time.', showCloseButton: true});
				$scope.meeting.end_time = $scope.meeting.start_time;
				var end_time = setTimeNoOffset($scope.meeting.end_time, $scope.userTimeZone.offset);
				data.end_time = end_time;
				$scope.end_time_to_string = timeToStringForInputs($scope.meeting.start_time);
			}
		}

 		var startTime = setTimeNoOffset($scope.meeting.start_time, $scope.userTimeZone.offset);
 		data.start_time = startTime;
 		// setAgendaTimeDuration();
 		MeetingsServices.update(data, $scope.meetingId)	
 			.then(function  (res) {
 				$scope.typing = false;
            });
 	};
 	$scope.cancelChangeStartTime = function cancelChangeStartTime () {
 		$scope.meeting.start_time = $scope.oldStartTime;
 		$scope.showStartTimePicker = !$scope.showStartTimePicker;
 		$scope.typing = false;
 	};
 	$scope.cancelChangeEndTime = function cancelChangeEndTime () {
 		$scope.meeting.end_time = $scope.oldEndTime;
 		$scope.showEndTimePicker = !$scope.showEndTimePicker;
 		$scope.typing = false;
 	};
 	$scope.setEndTime = function setEndTime (hour) {
		if(typeof hour == 'string'){
			var regex = /[\d]{2}[:][\d]{2}/;
			var regex2 = /[\d]{1}[:][\d]{2}/;
			if(regex.test(hour) || regex2.test(hour)){
				var match = regex.exec(hour);
				if(!match) {
					match = regex2.exec(hour);
				}
				var timeArray = match[0].split(":");
				$scope.meeting.end_time = new Date($scope.meeting.end_time.setHours(parseInt(timeArray[0])));
				$scope.meeting.end_time = new Date($scope.meeting.end_time.setMinutes(parseInt(timeArray[1])));
			} else {
				$scope.end_time_to_string = timeToStringForInputs($scope.meeting.end_time);
				return;
			}
		} else {
			$scope.meeting.end_time = hour;
		}

 		$scope.showEndTimePicker = false;

		if(new Date($scope.meeting.end_time).getHours() != 0) {
			if((new Date($scope.meeting.end_time).getHours() < new Date($scope.meeting.start_time).getHours())
				|| ((new Date($scope.meeting.end_time).getHours() == new Date($scope.meeting.start_time).getHours()) &&
				(new Date($scope.meeting.end_time).getMinutes() < new Date($scope.meeting.start_time).getMinutes()))){
				$scope.meeting.end_time = $scope.meeting.start_time;
				$scope.end_time_to_string = $scope.meeting.end_time;
				toaster.pop({type: 'error', body: 'The end time cannot be earlier than the start time.', showCloseButton: true});
			}
		}

        $scope.end_time_to_string = timeToStringForInputs($scope.meeting.end_time);
 		var endTime = setTimeNoOffset($scope.meeting.end_time, $scope.userTimeZone.offset);
 		var data = {end_time: endTime};
 		MeetingsServices.update(data, $scope.meetingId)
 			.then(function  (res) {
 				$scope.typing = false;
 			});
 	};
	$scope.start_time_drop_down_values = function start_time_drop_down_values(){
		var data = [];
		var start_point = new Date();
		var hours = 0;
		var minutes = 0;
		var counter = 0;
		start_point.setHours(0);
		start_point.setMinutes(0);
		start_point.setSeconds(0);
		while (hours < 24){
			if(minutes == 0) {
				minutes = 30;
			} else {
				hours += 1;
				minutes = 0;
			}
			data[counter] = new Date(start_point.setHours(hours));
			data[counter] = new Date(start_point.setMinutes(minutes));
			counter ++;
		}
		$scope.start_time_drop_down_hour_values = data;
	};
	$scope.start_time_drop_down_values();

	$scope.end_time_drop_down_values = function end_time_drop_down_values() {
		var start_point = new Date($scope.meeting.start_time);
		var hours = start_point.getHours();
		var minutes = start_point.getMinutes();
		var counter = 0;
		var data = [];
		while (hours < 24) {
			if(minutes == 0) {
				minutes = 30;
			} else {
				hours += 1;
				minutes = 0;
			}
			data[counter] = {};
			data[counter].time = new Date(start_point.setHours(hours));
			data[counter].time = new Date(start_point.setMinutes(minutes));
			if(counter == 0) {
				data[counter].viewHour = '30 min';
			}else if(counter ==1 ){
				data[counter].viewHour = '1 hour';
			} else {
				if(minutes == 30) {
					data[counter].viewHour = ((counter + 1) * 0.5).toString() + ' hrs';
				} else {
					data[counter].viewHour = ((counter + 1) * 0.5).toString() + ' hrs';
				}
			}
			counter ++;
		}
		$scope.end_time_drop_down_hour_values = data;
	};
 	$scope.showTimeZonePicker = function showTimeZonePicker () {
 		$scope.showTimeZoneDD = !$scope.showTimeZoneDD;	
 	};
 	$scope.changeTimeZone = function changeTimeZone (timeZone) {
		$scope.chosenTimeZone = timeZone;
		var data = {name: timeZone.name, offset: timeZone.offset};
		TimezonesServices.update(data, $scope.userTimeZone.id)
			.then(function  (res) {
				loadMeeting();
			});
 	};
	$scope.updateMeetingPlace = function updateMeetingPlace () {
		var data = {place: $scope.meeting.place};
 		$scope.typing = false;
		MeetingsServices.update(data, $scope.meetingId)
			.then(function  (res) {
				return;
			});
	};
	$scope.updateMinutetaker = function updateMinutetaker () {
		if($scope.meeting.minute_taker === ''){
			return;
		}
		var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		var data = {email: $scope.meeting.minute_taker};
		if(!regexEmail.test($scope.meeting.minute_taker)){
			return;
		}
		MeetingsServices.findUser(data)
			.then(function  (res) {
				data = {};
				if(res.notFound){
					data.minute_taker_first_name = '';
					data.minute_taker_last_name = '';
					if($scope.meeting.minute_taker.substring(0, 1) != '<') {
						data.minute_taker_email = $scope.meeting.minute_taker;
						data.minute_taker = '<' + $scope.meeting.minute_taker + '>';
					} else {
						data.minute_taker = $scope.meeting.minute_taker;
						data.minute_taker_email = $scope.meeting.minute_taker.replace('<', '');
						data.minute_taker_email = data.minute_taker_email.replace('>', '');
					}
				}else{
					data.minute_taker_first_name = res.user.first_name;
					data.minute_taker_last_name = res.user.last_name;
					data.minute_taker_email = res.user.email;
					data.minute_taker = res.user.first_name + ' ' + res.user.last_name;
				}

				$scope.meeting.minute_taker = data.minute_taker;
				$scope.meeting.minute_taker_first_name = data.minute_taker_first_name;
				$scope.meeting.minute_taker_last_name = data.minute_taker_last_name;
				$scope.meeting.minute_taker_email = data.minute_taker_email;

				MeetingsServices.update(data, $scope.meetingId)
					.then(function  (res) {
					});
				$scope.typing = false;
				var minutetakerLikeAtendant = false;
				for (var i = 0; i < $scope.meeting.attendants.length; i++) {
					if($scope.meeting.attendants[i].meeting_attendant === $scope.meeting.minute_taker){
						minutetakerLikeAtendant = true;
						break;
					}
				};
				if(minutetakerLikeAtendant === false){
					var att = {
						attendant: 
						{
	    					email: data.minute_taker_email,
							first_name: data.minute_taker_first_name,
							last_name: data.minute_taker_last_name,
							field: 1,
							meeting_attendant: data.minute_taker
						}
					}
					$scope.attendants.push(att.attendant);
					MeetingsServices.update(att, $scope.meetingId)
						.then(function  (res) {

						});
				};
			});
	};
	$scope.updateAttendants = function updateAttendants () {
		$scope.typing = false;
		for (var i = 0; i < $scope.attendants.length; i++) {
			if($scope.attendants[i].id){
				continue;
			}else{
				var email = {email: $scope.attendants[i].meeting_attendant};
				MeetingsServices.findUser(email)
					.then(function  (res) {
						var data = {attendant: {}};
						if(res.notFound){
							data.attendant.email = res.email;
							data.attendant.first_name = '';
							data.attendant.last_name = '';
							data.attendant.meeting_attendant = '<' + res.email + '>';
							data.attendant.field = 1;
						}else {
							data.attendant.email = res.user.email;
							data.attendant.first_name = res.user.first_name;
							data.attendant.last_name = res.user.last_name;
							data.attendant.meeting_attendant = res.user.first_name + ' ' + res.user.last_name;
							data.attendant.field = 1;
						}
						MeetingsServices.update(data, $scope.meetingId)
							.then(function  (res) {
								$scope.meeting.attendants = res.meeting.attendants;
								$scope.attendants = $scope.meeting.attendants;
							});
					});
			}
		};
		for (var i = 0; i < $scope.meeting.attendants.length; i++) {
			var existAttendant = false;

			for (var a = 0; a < $scope.attendants.length; a++) {
				if($scope.attendants[a].id){
					if($scope.attendants[a].id === $scope.meeting.attendants[i].id){
						existAttendant = true;
						break;
					}
				}
			};
			if(existAttendant === false){
				var data = {meetingID: $scope.meeting.id};
    			MeetingAttendantServices.destroy($scope.meeting.attendants[i].id, data)
    				.then(function  (res) {
						$scope.meeting.attendants = res.meeting.attendants;
						$scope.attendants = $scope.meeting.attendants;
    				});
			}
		};
	};

	//meeting agenda action
	$scope.newAgendaItem = '';
	$scope.createNewMeetingAgendaItem = function createNewMeetingAgendaItem (event, val) {
		var self = this;
		if(event.which === 13){
 			$scope.typing = false;
			if(val === '' || val === null){
				$scope.requiredAgendaText = 'requireAgendaText';
				return;
			}else {
				$scope.requiredAgendaText = 'successAgendaText';
			}
			var data = {
				text: val,
				meetingID: $scope.meetingId
			};
			MeetingAgendaServices.create(data)
				.then(function  (res) {
					self.newAgendaItem = null;
					$scope.meeting.agenda = res;
					setDefaultColorTypeForNotesDD();
					return
				});
		}
		
	};
	$scope.editAgenda = function editAgenda (agenda) {
		$scope.agendaInEditMode[agenda.id] = true;
		$timeout(function  () {
			document.getElementById('agenda-in-edit-mode-' + agenda.id).focus();
		}, 500);
	};
	$scope.updateMeetingAgenda = function updateMeetingAgenda (agenda) {
		var data = {
			text: agenda.text,
			number: agenda.number
		};
		$scope.agendaInEditMode[agenda.id] = false;
 		$scope.typing = false;
		MeetingAgendaServices.update(data, agenda.id)
			.then(function  (res) {
				return;
			});
	};
	$scope.deleteMeetingAgenda = function deleteMeetingAgenda (item) {
		$rootScope.modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'views/partials/delete-confirmation-modal.html',
			controller: 'DeleteConfirmController',
			size: 'md',
			resolve: {
				items: function  () {
					return {
						type: 'agenda',
						item: item
					}
				}
			}
		});	
		$rootScope.modalInstance.result.then(function  (item) {
			for (var i = 0; i < $scope.meeting.agenda.length; i++) {
				if($scope.meeting.agenda[i].id === item){
					for (var a = i+1; a < $scope.meeting.agenda.length; a++) {
						$scope.meeting.agenda[a].number -= 1;
						var data = {number: $scope.meeting.agenda[a].number}
						MeetingAgendaServices.update(data, $scope.meeting.agenda[a].id)
							.then(function  (res) {
							});
					};
					$scope.meeting.agenda.splice(i, 1);
					setAgendaTimeDuration();
					break;
				}
			};
		});
	};
	$scope.timeIntervalForAgenda = [
		5, 10, 15, 20, 25, 30, 40, 50, 60, 75,  90, 105, 120
	];
	$scope.setTimeIntervalForAgenda = function setTimeIntervalForAgenda (agenda, val) {
		var data = {duration: val};
		MeetingAgendaServices.update(data, agenda.id)
			.then(function  (res) {
				for (var i = 0; i < $scope.meeting.agenda.length; i++) {
					if($scope.meeting.agenda[i].id === agenda.id){
						$scope.meeting.agenda[i].duration = val;
						setAgendaTimeDuration();
						break;
					}
				};
			});
	}

	//notes actions
	TypeServices.show()
		.then(function  (res) {
			$scope.types = res.types;
			$scope.newType = res.types[0];
		});

	$scope.getTypeDropDownColor = function getTypeDropDownColor (title) {
		var colors = {
			'To Do':'blue',
			'Idea': 'green',
			'Decision': 'red',
			'Info': 'gray',
			'Done': 'blue',
			'Agenda': 'brown',
			'Question': 'orange'
		}
		return colors[title];
	};

	$scope.addNewAgendaNoteItem = function addNewAgendaNoteItem (event, agenda, index) {
		if(event.which === 13){
			$scope.typing = false;
			if(typeof($scope.newAgendaNoteItem[agenda.id].ownerNames) == 'object'){
				$scope.newAgendaNoteItem[agenda.id].ownerNames = $scope.newAgendaNoteItem[agenda.id].ownerNames.meeting_attendant;
			}
			if($scope.newAgendaNoteItem[agenda.id].body === '' ||
					$scope.newAgendaNoteItem[agenda.id].body === undefined){
				$scope.newAgendaNoteItem[agenda.id].bodyRequired = 'background-color: rgba(249, 184, 184, 0.5);';
				return;
			}
			$scope.newAgendaNoteItem[agenda.id].bodyRequired = '';
			var data = {};
			data.uniqueStringID = $scope.meetingId;
			data.agendaID = agenda.id;
			data.body = $scope.newAgendaNoteItem[agenda.id].body;
			data.ownerNames = $scope.newAgendaNoteItem[agenda.id].ownerNames || '';
			for (var i = 0; i < $scope.types.length; i++) {
				if($scope.types[i].title === $scope.newAgendaNoteItem[agenda.id].title){
					data.typeID = $scope.types[i].id;
					break;
				}
			};
			NoteServices.create(data)
				.then(function  (res) {
					$scope.meeting.agenda[index].note.push(res.note);
				});
			$scope.newAgendaNoteItem[agenda.id] = {title: $scope.newAgendaNoteItem[agenda.id].title}
			$scope.typing = true;
			document.getElementById('new-note-text' + agenda.id).focus();
		}
	};
	$scope.addNewAgendaItemAfterTabPress = function addNewAgendaItemAfterTabPress (agenda, index) {
			if($scope.newAgendaNoteItem[agenda.id].body === '' ||
				$scope.newAgendaNoteItem[agenda.id].body === undefined){
				return;
			}
			if(typeof($scope.newAgendaNoteItem[agenda.id].ownerNames) == 'object'){
				$scope.newAgendaNoteItem[agenda.id].ownerNames = $scope.newAgendaNoteItem[agenda.id].ownerNames.meeting_attendant;
			}
			$scope.typing = false;
			var data = {};
			data.uniqueStringID = $scope.meetingId;
			data.agendaID = agenda.id;
			data.body = $scope.newAgendaNoteItem[agenda.id].body;
			data.ownerNames = $scope.newAgendaNoteItem[agenda.id].ownerNames || '';
			for (var i = 0; i < $scope.types.length; i++) {
				if($scope.types[i].title === $scope.newAgendaNoteItem[agenda.id].title){
					data.typeID = $scope.types[i].id;
					break;
				}
			};
			NoteServices.create(data)
				.then(function  (res) {
					$scope.meeting.agenda[index].note.push(res.note);
				});
			$scope.newAgendaNoteItem[agenda.id] = {title: 'To Do'};
			$scope.typing = true;
	};
	$scope.deleteNote = function deleteNote (item, agenda) {
		$rootScope.modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'views/partials/delete-confirmation-modal.html',
			controller: 'DeleteConfirmController',
			size: 'md',
			resolve: {
				items: function  () {
					return {
						type: 'note',
						item: item,
						agendaId: agenda.id
					}
				}
			}
		});	
		$rootScope.modalInstance.result.then(function  (data) {
			for (var i = 0; i < $scope.meeting.agenda.length; i++) {
				if($scope.meeting.agenda[i].id === data.agendaId){
					for (var a = 0; a < $scope.meeting.agenda[i].note.length; a++) {
						if($scope.meeting.agenda[i].note[a].id === data.noteId){
							$scope.meeting.agenda[i].note.splice(a, 1);
							break;
						}
					};
					break;
				}
			};
		});
	};
	$scope.updateNoteType = function updateNoteType (title, id) {
		$scope.typing = false;
		for (var i = 0; i < $scope.types.length; i++) {
			if(title === $scope.types[i].title){
				var data = {};
				data.typeID = $scope.types[i].id;
				updateNote(data, id);
				break;
			}
		};
	};
	$scope.updateNoteBody = function updateNoteBody (body, id) {
		$scope.typing = false;
		var data = {body: body};
		updateNote(data, id);
	};
	$scope.updateNoteOwnerNames = function updateNoteOwnerNames (ownerNames, id) {
		$scope.typing = false;
		if(typeof(ownerNames) == 'object'){
			ownerNames = ownerNames.meeting_attendant;
		}
		var data = {ownerNames: ownerNames};
		updateNote(data, id);
	}


	function updateNote (data, id) {
		NoteServices.update(data, id)
			.then(function  (res) {
				return;
			});
	}
	//Meeting buttons actions
	
	$scope.deleteMeeting = function deleteMeeting () {
		$rootScope.modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'views/partials/delete-confirmation-modal.html',
			controller: 'DeleteConfirmController',
			size: 'md',
			resolve: {
				items: function  () {
					return {
						type: 'meeting',
						item: $scope.meeting
					}
				}
			}
		});
		$rootScope.modalInstance.result.then(function () {
			$location.path('/dashboard');
		});
	};
	$scope.startMeeting = function startMeeting () {
		var data = {started: 1};
		MeetingsServices.update(data, $scope.meetingId)
			.then(function  (res) {
				$scope.meeting.started = 1;
				toaster.pop({type: 'success', body: 'Meeting started successfully!', showCloseButton: true});
			});
	};
	$scope.print = function print () {
    	window.print();
	};
	$scope.fileTheMeeting = function fileTheMeeting () {
		var data = {uniqueStringID: $scope.meetingId};
		MeetingsServices.sendEmail(data)
  			.then(function  (res) {
    			toaster.pop({type: 'success', body: 'Meeting details sent successfully! ', showCloseButton: true});
    			return;
  			});
	};
	$scope.sendInvities = function sendInvities () {
		var data = {uniqueStringID: $scope.meetingId};
		MeetingsServices.sendInvities(data)
			.then(function  (res) {
				toaster.pop({type: 'success', body: res.success, showCloseButton: true});
				return;
			});
	};
	//load meeting data
	function loadMeeting () {
		$scope.meetingId = $location.path().substring(9, $location.path().length);
		MeetingsServices.show($scope.meetingId)
			.then(function  (res) {
				if(res.meeting.length == 0){
					$location.path('/dashboard');
					return;
				}

				$scope.meeting = res.meeting[0];
				if(!$scope.meeting.date){
					$scope.meeting.date = new Date();
					$scope.setDate();
					$scope.showDatePicker = false;
				}
				if(!$scope.meeting.end_date) {
					$scope.meeting.end_date = $scope.meeting.date;
				}
				if($scope.meeting.started == 0){
					var data = {started: 1};
					MeetingsServices.update(data, $scope.meetingId)
						.then(function  (res) {
						});
					$scope.meeting.started = 1;
				}
				if(!$scope.meeting.minute_taker || $scope.meeting.minute_taker === '<undefined>'){
					var data = {
						minute_taker_email: localStorage.user_email,
						minute_taker_first_name: localStorage.user_first_name,
						minute_taker_last_name: localStorage.user_last_name,
						minute_taker: localStorage.user_first_name + ' ' + localStorage.user_last_name 
					};
					$scope.meeting.minute_taker_email = data.minute_taker_email;
					$scope.meeting.minute_taker_first_name = data.minute_taker_first_name;
					$scope.meeting.minute_taker_last_name = data.minute_taker_last_name;
					$scope.meeting.minute_taker = data.minute_taker;
					MeetingsServices.update(data, $scope.meetingId)
						.then(function  (res) {

						});
				}

				$scope.attendants = [];
				for (var i = 0; i < $scope.meeting.attendants.length; i++) {
					$scope.attendants.push($scope.meeting.attendants[i]);
				}
				var isMinutetakerAtt = false;
				for (var i = 0; i < $scope.attendants.length; i++) {
					if($scope.meeting.attendants[i].meeting_attendant === $scope.meeting.minute_taker){
						isMinutetakerAtt = true;
						break;
					}
				}
				if(isMinutetakerAtt === false){
					var att = {
						attendant:
						{
	    					email: $scope.meeting.minute_taker_email,
							first_name: $scope.meeting.minute_taker_first_name,
							last_name: $scope.meeting.minute_taker_last_name,
							field: 1,
							meeting_attendant: $scope.meeting.minute_taker
						}
					};
					MeetingsServices.update(att, $scope.meetingId)
						.then(function  (res) {
							$scope.meeting.attendants = res.meeting.attendants;
							$scope.attendants = $scope.meeting.attendants;
						});
				}
				setDefaultColorTypeForNotesDD();
				for (var i = $scope.meeting.attendants.length - 1; i >= 0; i--) {
					if(localStorage.user_email === $scope.meeting.attendants[i].email){
						$scope.isCurrUserInAttList = true;
						break;
					}
				}
				if(localStorage.userID == $scope.meeting.user.id){
					$scope.isCurrUserInAttList = true;
				}

				if($scope.isCurrUserInAttList === false){
					$location.path('/dashboard');
				}
				if(localStorage.user_email === $scope.meeting.minute_taker_email){
					$scope.userIsMinuteTaker = true;
				}
				if(localStorage.userID === $scope.meeting.user.id){
					$scope.userIsOwner = true;
				}
				if(res.userTimeZone.id){
					$scope.chosenTimeZone = {name: res.userTimeZone.name, offset: res.userTimeZone.offset};
					$scope.userTimeZone = res.userTimeZone;
					if($scope.meeting.start_time){
						var time = new Date($scope.meeting.start_time);
						$scope.meeting.start_time = new Date(time.setMinutes(time.getMinutes() + parseInt($scope.chosenTimeZone.offset)));
						$scope.oldStartTime = $scope.meeting.start_time;
					}
					else {
						var time = new Date();
						time = setTimeNoOffset(time);
						$scope.meeting.start_time = new Date(time.setMinutes(time.getMinutes() + parseInt($scope.chosenTimeZone.offset)));
						$scope.oldStartTime = $scope.meeting.start_time;
						$scope.setStartTime($scope.meeting.start_time);
					}
					if($scope.meeting.end_time){
						var time = new Date($scope.meeting.end_time);
						$scope.meeting.end_time = new Date(time.setMinutes(time.getMinutes() + parseInt($scope.chosenTimeZone.offset)));
						$scope.oldEndTime = $scope.meeting.end_time;
					}else {
						var time = new Date();
						time = setTimeNoOffset(time);
						$scope.meeting.end_time = new Date(time.setMinutes(time.getMinutes() + parseInt($scope.chosenTimeZone.offset)));
						$scope.oldEndTime = $scope.meeting.end_time;
						$scope.setEndTime($scope.meeting.end_time);
					}
				}else{
					var data = {meetingID: $scope.meeting.uniqueStringID, name: $scope.timeZones[6].name, offset: $scope.timeZones[6].offset };
					$scope.userTimeZone = {name: $scope.timeZones[6].name, offset: $scope.timeZones[6].offset};
					TimezonesServices.create(data)
						.then(function  (res) {
							// $scope.userTimeZone = res;
						});
					$scope.chosenTimeZone = $scope.timeZones[6];
					if($scope.meeting.start_time){
						var time = new Date($scope.meeting.start_time);
						time = setTimeNoOffset(time);
						$scope.meeting.start_time = new Date(time.setMinutes(time.getMinutes() + parseInt($scope.chosenTimeZone.offset)));
						$scope.oldStartTime = $scope.meeting.start_time;
					}
					else {
						var time = new Date();
						time = setTimeNoOffset(time);
						$scope.meeting.start_time = new Date(time.setMinutes(time.getMinutes() + parseInt($scope.chosenTimeZone.offset)));
						$scope.oldStartTime = $scope.meeting.start_time;
						$scope.setStartTime($scope.meeting.start_time);
					}
					if($scope.meeting.end_time) {
						var time = new Date($scope.meeting.end_time);
						$scope.meeting.end_time = new Date(time.setMinutes(time.getMinutes() + parseInt($scope.chosenTimeZone.offset)));
						$scope.oldEndTime = $scope.meeting.end_time;
					}else{
						var time = new Date();
						time = setTimeNoOffset(time);
						$scope.meeting.end_time = new Date(time.setMinutes(time.getMinutes() + parseInt($scope.chosenTimeZone.offset)));
						$scope.oldEndTime = $scope.meeting.end_time;
						$scope.setEndTime($scope.meeting.end_time);
					}
				}
				$scope.start_time_to_string = timeToStringForInputs($scope.meeting.start_time);
				$scope.end_time_to_string = timeToStringForInputs($scope.meeting.end_time);
			}, function (err) {
				if(localStorage.getItem('remember_token') != null) {

					var data = {'remember_token': localStorage.getItem('remember_token')};
					$auth.login(data)
						.then(function (res) {
							AuthServices.setUserData(res.data.user);
							loadMeeting();
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
	$scope.loadUserContacts = function loadUserContacts (q) {
		UserContactsServices.show(q)
			.then(function  (res) {
				$scope.contacts = [];
				for (var i = 0; i < res.length; i++) {
					var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
					if(regexEmail.test(res[i].email)){
						$scope.contacts.push(res[i].email);
					}
				};
			});
		return $scope.contacts;		
	};

	function setAgendaTimeDuration () {
		var lastTime = new Date($scope.meeting.start_time).getTime();
		for (var i = 0; i < $scope.meeting.agenda.length; i++) {
			if($scope.meeting.agenda[i].duration > 0){

				$scope.meeting.agenda[i].start_time = null;
				$scope.meeting.agenda[i].end_time = null;
				$scope.meeting.agenda[i].start_time = lastTime;
				$scope.meeting.agenda[i].end_time = lastTime + ($scope.meeting.agenda[i].duration * 60 * 1000);
				lastTime = lastTime + ($scope.meeting.agenda[i].duration * 60 * 1000);
				var data = {
					start_time: $scope.meeting.agenda[i].start_time,
					end_time: $scope.meeting.agenda[i].end_time
				};
				MeetingAgendaServices.update(data, $scope.meeting.agenda[i].id)
					.then(function  (res) {
					});
			}
		}
	}
	function setDefaultColorTypeForNotesDD () {
		$scope.newAgendaNoteItem = [];
		for (var i = 0; i < $scope.meeting.agenda.length; i++) {
			$scope.newAgendaNoteItem[$scope.meeting.agenda[i].id] = {title: 'To Do'};
		}
	}

	$scope.getBackgroundColorPPNotes = function getBackgroundColorPPNotes (index) {
		if(index % 2 == 1){
			return 'backgrounded_notes';
		}
	};
	function calculatetimeOffset () {
		var date  = new Date().getTimezoneOffset();
		return date - (date*2);
	}

	function setTimeNoOffset (time, offset) {
		var time = new Date(time);
		var offset = offset || calculatetimeOffset();
		time = time.setMinutes(time.getMinutes() - offset);
		return new Date(time);
	}
	function timeToStringForInputs(time) {
		var new_time = time.toString();
		return new_time.substring(16, 21);
	}

}]);

minutes.controller('DeleteConfirmController', ['$scope', '$rootScope', 'items', 'MeetingAgendaServices', 'NoteServices', 'MeetingsServices', 'TemplateService',
function DeleteConfirmController($scope, $rootScope, items, MeetingAgendaServices, NoteServices, MeetingsServices, TemplateService){
	
	if(items.type === 'agenda'){
		$scope.title = 'Please confirm';
		$scope.body = 'Are you sure you want to delete this agenda item?';
		$scope.ok = function ok () {
			MeetingAgendaServices.deleteAgenda(items.item.id)
				.then(function  (res) {
					$rootScope.modalInstance.close(items.item.id);
				});
		};
	}
	if(items.type === 'note'){
		$scope.title = 'Please confirm';
		$scope.body = 'Are you sure you want to delete this note item?';
		$scope.ok = function ok () {
			NoteServices.deleteNote(items.item.id)
				.then(function  (res) {
					var data = {agendaId: items.agendaId, noteId: items.item.id};
					$rootScope.modalInstance.close(data);
				});
		}
	}
	$scope.cancel = function cancel () {
		$rootScope.modalInstance.dismiss('cancel');
	};
	if(items.type === 'meeting'){
		$scope.title = 'Please confirm';
		if(items.item.title){
			var title = '<strong>' + items.item.title + '</strong>';
		}else{
			var title = 'this'; 
		}
		$scope.body = 'Are you sure you want to delete ' + title + ' meeting?';
		$scope.ok = function ok () {
			MeetingsServices.deleteMeeting(items.item.uniqueStringID)
				.then(function  (res) {
					$rootScope.modalInstance.close();
				});
		} 
	}

	if(items.type === 'template'){
		$scope.title = 'Please confirm';
		if(items.item.title){
			var title = '<strong>' + items.item.title + '</strong>';
		}else{
			var title = 'this';
		}
		$scope.body = 'Are you sure you want to delete ' + title + ' template?';
		$scope.ok = function ok () {
			TemplateService.deleteTemplate(items.item.uniqueStringID)
				.then(function  (res) {
					$rootScope.modalInstance.close();
				});
		}
	}
}]);


angular.module('minutes').directive('focus',
	function($timeout) {
		return {
			scope : {
				trigger : '@focus'
			},
			link : function(scope, element) {
				 angular.element(document).ready(function () {
					scope.$watch('trigger', function(value) {
						if (value === "true") {
							$timeout(function() {
								element[0].focus();
							},2000);
						}
					});
				});
			}
		};
	}
);