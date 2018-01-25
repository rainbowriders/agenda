<!DOCTYPE html>
<html ng-app="minutes">
    <head>
        <title>Rainbow Agenda</title>
        <meta charset="utf-8" /> 
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">

        <link rel="stylesheet" href="libs/bower_components/bootstrap/css/bootstrap.min.css">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="libs/bower_components/angular-bootstrap/ui-bootstrap-csp.css">
        <link rel="stylesheet" type="text/css" href="libs/bower_components/angular-ui-bootstrap-datetimepicker/datetimepicker.css">
        <link rel="stylesheet" href="libs/bower_components/font-awesome-4.5.0/css/font-awesome.min.css">

        <!--App-->
        <link rel="stylesheet" href="libs/bower_components/AngularJS-Toaster/toaster.min.css">
        <link rel="stylesheet" type="text/css" href="libs/bower_components/ng-tags-input/ng-tags-input.css">
        <link rel="stylesheet" type="text/css" href="libs/bower_components/angular-responsive-tables/release/angular-responsive-tables.min.css">
        <link rel="stylesheet" type="text/css" href="css/meeting-header.css">
        <link rel="stylesheet" type="text/css" href="css/meeting-agenda.css">
        <link rel="stylesheet" type="text/css" href="css/meeting-notes.css">
        <link rel="stylesheet" type="text/css" href="css/meeting-footer.css">
        <link rel="stylesheet" type="text/css" href="css/dashboard.css">
        <link rel="stylesheet" type="text/css" href="css/meeting-print-page.css">
        <link rel="stylesheet" type="text/css" href="css/index.css">
        <link rel="stylesheet" href="css/navbar.css">
        <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Raleway" />
        <link rel="stylesheet" type="text/css" href="css/main.css">
        <link rel="stylesheet" href="css/forms.css">

        <script>
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', 'UA-70455795-1', 'auto');
            ga('send', 'pageview');
        </script>
    </head>
    <body class="{{(location == '/' || location == '/terms' || location == '/privacy')? 'white-body': 'colored-body'}}" style="overflow-y: auto">
        <section ng-view></section>
        <toaster-container toaster-options="{'time-out': 2000, 'position-class': 'toast-top-center' }"></toaster-container>

        <script src="libs/bower_components/jquery-2.2.0.min.js"></script>
        <!--<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>-->
        <script src="libs/bower_components/bootstrap/js/bootstrap.min.js"></script>
        <script src="libs/bower_components/angular/angular.js"></script>
        <script src="libs/bower_components/angular-route/angular-route.js"></script>
        <script src="libs/bower_components/angular-resource/angular-resource.js"></script>
        <script src="libs/bower_components/satellizer/satellizer.min.js"></script>
        <script src="libs/bower_components/angular-extend-promises/angular-extend-promises.min.js"></script>
        <script src="libs/bower_components/AngularJS-Toaster/toaster.min.js"></script>
        <script src="libs/bower_components/angular-bootstrap/ui-bootstrap.min.js"></script>
        <script src="libs/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
        <script src="libs/bower_components/angular-ui-bootstrap-datetimepicker/datetimepicker.js"></script>
        <script src="libs/bower_components/ng-tags-input/ng-tags-input.js"></script>
        <script src="libs/bower_components/angular-sanitize/angular-sanitize.js"></script>
        <script src="libs/bower_components/angular-responsive-tables/release/angular-responsive-tables.min.js"></script>
        <script src="libs/bower_components/angular-elastic/elastic.js"></script>
        <script src="libs/bower_components/scrollspy.js"></script>
        <!-- App scripts -->
      
        <script src="js/app.js"></script>
        <!-- App config scripts -->
        <script src="js/config/routes.js"></script>
        <script src="js/config/auth.js"></script>
        <!-- App controllers scripts -->
        <script src="js/controllers/auth/login.js"></script>
        <script src="js/controllers/auth/send-confirmation-code.js"></script>
        <script src="js/controllers/auth/confirm-account.js"></script>
        <script src="js/controllers/auth/send-reset-password-link.js"></script>
        <script src="js/controllers/auth/reset-password.js"></script>
        <script src="js/controllers/auth/register.js"></script>
        <script src="js/controllers/auth/google-auth.js"></script>
        <script src="js/controllers/auth/linked-auth.js"></script>
        <script src="js/controllers/auth/facebook-auth.js"></script>
        <script src="js/controllers/navbar.js"></script>
        <script src="js/controllers/dashboard.js"></script>
        <script src="js/controllers/index.js"></script>
        <script src="js/controllers/help.js"></script>
        <script src="js/controllers/meetings/meeting.js"></script>
        <script src="js/controllers/template.js"></script>
        <script src="js/controllers/templates-dashboard.js"></script>
        <script src="js/controllers/import-templates.js"></script>
        <!-- App services scripts -->
        <script src="js/services/auth.js"></script>
        <script src="js/services/meetings.js"></script>
        <script src="js/services/meeting-attendant.js"></script>
        <script src="js/services/meeting-room.js"></script>
        <script src="js/services/type.js"></script>
        <script src="js/services/note.js"></script>
        <script src="js/services/help.js"></script>
        <script src="js/services/user-contacts.js"></script>
        <script src="js/services/meeting-agenda.js"></script>
        <script src="js/services/timezones.js"></script>
        <script src="js/services/anchorSmoothScroll.js"></script>
        <script src="js/services/template.js"></script>
        <!-- App directives scripts -->
        <!-- App filters scripts -->
        <!-- App theme and helpfull scripts -->
    </body>
</html>