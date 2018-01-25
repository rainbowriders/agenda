minutes.controller('ImportTemplatesController', ['$scope', 'TemplateService', '$location', '$rootScope', 'MeetingsServices', 'MeetingAgendaServices',
function ImportTemplatesController($scope, TemplateService, $location, $rootScope, MeetingsServices, MeetingAgendaServices) {

    TemplateService.showAll().
        then(function (res) {
            $scope.templates = res.templates;
            $scope.chooseId = null;
        });

    $scope.isTemplateChoosen = true;
    var meeting  = null;
    $scope.setTemplate = function setTemplate(template) {
        $scope.chooseId = template;
        $scope.isTemplateChoosen = true;
    };
    
    $scope.createFromScratch = function createFromScratch() {
        MeetingsServices.create()
            .then(function (res) {
                $rootScope.modalInstance.close();
                $location.path('meeting/' + res.meeting.uniqueStringID);
            })

    };

    $scope.cancel = function cancel() {
        $rootScope.modalInstance.close();
    };

    $scope.createTemplate = function createTemplate () {
        TemplateService.create()
            .then(function (res) {
                $location.path('templates/' + res.template.uniqueStringID);
                $rootScope.modalInstance.close();
            });
    };

    $scope.createFromTemplate = function createFromTemplate() {
        if($scope.chooseId == null) {
            $scope.isTemplateChoosen = false;
            return;
        }
        MeetingsServices.createFromTemplate({uniqueStringID: $scope.chooseId})
            .then(function (res) {
                $rootScope.modalInstance.close();
                $location.path('meeting/' + res.meeting.uniqueStringID);
            })

    };


}]);