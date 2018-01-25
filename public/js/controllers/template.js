minutes.controller('TemplateController',
['$scope',
'$location',
'$rootScope',
'$uibModal',
'$timeout',
'TemplateService',
'MeetingAgendaServices',
'UserContactsServices',
'MeetingsServices',
'MeetingAttendantServices',
'$auth',
'AuthServices',
function TemplateController (
    $scope,
    $location,
    $rootScope,
    $uibModal,
    $timeout,
    TemplateService,
    MeetingAgendaServices,
    UserContactsServices,
    MeetingsServices,
    MeetingAttendantServices,
    $auth,
    AuthServices) {

    var uniqueStringID = $location.path().substring(11, $location.path().length);

    if(localStorage.getItem('satellizer_token') == null && localStorage.getItem('remember_token') != null) {

        var data = {'remember_token' : localStorage.getItem('remember_token')};
        $auth.login(data)
            .then(function (res) {
                AuthServices.setUserData(res.data.user);
                load();
            }, function (err) {
                AuthServices.logout();
                $location.path('/login');
            });
    } else if(localStorage.getItem('satellizer_token') == null && localStorage.getItem('remember_token') == null){
        localStorage.clear();
        $rootScope.isUserLoged = false;
        $location.path('/login');
    } else {
        load();
    }

    $scope.agendaInEditMode = [];

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
                meetingID: uniqueStringID
            };
            MeetingAgendaServices.create(data)
                .then(function  (res) {
                    self.newAgendaItem = null;
                    $scope.template.agenda = res;
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
            for (var i = 0; i < $scope.template.agenda.length; i++) {
                if($scope.template.agenda[i].id === item){
                    for (var a = i+1; a < $scope.template.agenda.length; a++) {
                        $scope.template.agenda[a].number -= 1;
                        var data = {number: $scope.template.agenda[a].number}
                        MeetingAgendaServices.update(data, $scope.template.agenda[a].id)
                            .then(function  (res) {
                            });
                    };
                    $scope.template.agenda.splice(i, 1);
                    break;
                }
            };
        });
    };

    $scope.updateTemplateTitle = function updateTemplateTitle () {
        var data = {title: $scope.template.title};
        TemplateService.update(data, uniqueStringID)
            .then(function  (res) {
                return;
            });
    };

    $scope.updateTemplatePlace = function updateTemplatePlace () {
        var data = {place: $scope.template.place};
        $scope.typing = false;
        TemplateService.update(data, uniqueStringID)
            .then(function  (res) {
                return;
            });
    };

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

    $scope.updateAttendants = function updateAttendants () {
        for (var i = 0; i < $scope.attendants.length; i++) {
            if($scope.attendants[i].id){
                continue;
            }else{
                var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
                var email = {email: $scope.attendants[i].meeting_attendant};
                if(!regexEmail.test(email.email)) {
                    $scope.attendants.splice(i, 1);
                    continue;
                }
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
                        TemplateService.update(data, uniqueStringID)
                            .then(function  (res) {
                                $scope.template.attendants = res.template.attendants;
                                $scope.attendants = $scope.template.attendants;
                            });
                    });
            }
        };

        for (var i = 0; i < $scope.template.attendants.length; i++) {
            var existAttendant = false;

            for (var a = 0; a < $scope.attendants.length; a++) {
                if($scope.attendants[a].id){
                    if($scope.attendants[a].id === $scope.template.attendants[i].id){
                        existAttendant = true;
                        break;
                    }
                }
            };
            if(existAttendant === false){
                if($scope.template.attendants[i].email == $scope.template.minute_taker_email) {
                    $scope.attendants.unshift($scope.template.attendants[i]);
                    continue;
                }
                var data = {meetingID: uniqueStringID};
                MeetingAttendantServices.destroy($scope.template.attendants[i].id, data)
                    .then(function  (res) {
                        $scope.template.attendants = res.template.attendants;
                        $scope.attendants = $scope.template.attendants;
                    });
            }
        };
    };

    $scope.updateMinutetaker = function updateMinutetaker () {
        if($scope.template.minute_taker === ''){
            return;
        }
        var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        var data = {email: $scope.template.minute_taker};
        if(!regexEmail.test($scope.template.minute_taker)){
            return;
        }

        MeetingsServices.findUser(data)
            .then(function  (res) {
                data = {};
                if(res.notFound){
                    data.minute_taker_first_name = '';
                    data.minute_taker_last_name = '';
                    if($scope.template.minute_taker.substring(0, 1) != '<') {
                        data.minute_taker_email = $scope.template.minute_taker;
                        data.minute_taker = '<' + $scope.template.minute_taker + '>';
                    } else {
                        data.minute_taker = $scope.template.minute_taker;
                        data.minute_taker_email = $scope.template.minute_taker.replace('<', '');
                        data.minute_taker_email = data.minute_taker_email.replace('>', '');
                    }

                }else{
                    data.minute_taker_first_name = res.user.first_name;
                    data.minute_taker_last_name = res.user.last_name;
                    data.minute_taker_email = res.user.email;
                    data.minute_taker = res.user.first_name + ' ' + res.user.last_name;
                }

                $scope.template.minute_taker = data.minute_taker;
                $scope.template.minute_taker_first_name = data.minute_taker_first_name;
                $scope.template.minute_taker_last_name = data.minute_taker_last_name;
                $scope.template.minute_taker_email = data.minute_taker_email;

                TemplateService.update(data, uniqueStringID)
                    .then(function  (res) {
                    });

                var minutetakerLikeAtendant = false;
                for (var i = 0; i < $scope.template.attendants.length; i++) {
                    if($scope.template.attendants[i].meeting_attendant === $scope.template.minute_taker){
                        minutetakerLikeAtendant = true;
                        break;
                    }
                }
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
                    };
                    $scope.attendants.push(att.attendant);
                    TemplateService.update(att, uniqueStringID)
                        .then(function  (res) {
                            $scope.template = res.template;
                        });
                };
            });
    };

    $scope.deleteTemplate = function deleteTemplate() {
        $rootScope.modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'views/partials/delete-confirmation-modal.html',
            controller: 'DeleteConfirmController',
            size: 'md',
            resolve: {
                items: function  () {
                    return {
                        type: 'template',
                        item: $scope.template
                    }
                }
            }
        });
        $rootScope.modalInstance.result.then(function () {
            $location.path('/templates');
        });
    };

    function load() {
        TemplateService.show(uniqueStringID)
            .then(function (res) {
                $scope.template = res.template[0];
                $scope.attendants = [];
                for (var i = 0; i < $scope.template.attendants.length; i++) {
                    $scope.attendants.push($scope.template.attendants[i]);
                }
            }, function (err) {
                if(localStorage.getItem('remember_token') != null) {

                    var data = {'remember_token': localStorage.getItem('remember_token')};
                    $auth.login(data)
                        .then(function (res) {
                            AuthServices.setUserData(res.data.user);
                            load();
                        }, function (err) {
                            AuthServices.logout();
                            $location.path('/login');
                        });
                } else {
                    AuthServices.logout();
                    $location.path('/login');
                }
            })
    }
    
}]);
