<?php
Blade::setContentTags('<%', '%>'); // for variables and all things Blade
Blade::setEscapedContentTags('<%%', '%%>');
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
Route::post('auth/register', 'Auth\AuthController@create');
Route::post('auth/login', 'Auth\AuthController@logIn');
Route::post('auth/google', 'Auth\SocialController@google');
Route::post('auth/facebook', 'Auth\SocialController@facebook');
Route::post('auth/linkedin', 'Auth\SocialController@linked');
//create unsaved account
Route::post('auth/unsaved-account', 'Auth\AuthController@createUnsavedAccount');

Route::group(array('prefix' => 'api'), function() {
	//reset password 
	Route::post('reset-password-link', 'API\UserAccountController@sendResetPassLink');
	Route::post('reset-password', 'API\UserAccountController@resetPassword');
	//confirm account
	Route::post('resend-confirmation-link', 'API\UserAccountController@resendAccountConfirmationCode');
	Route::post('activate-account', 'API\UserAccountController@acctivateAccount');
	//meetings action
	Route::post('meeting', 'API\MeetingController@create');
	Route::get('meeting/{uniqueStringID}', 'API\MeetingController@show');
	Route::get('meeting', 'API\MeetingController@showAll');
	Route::put('meeting/{uniqueStringID}', 'API\MeetingController@update');
	Route::delete('meeting/{uniqueStringID}', 'API\MeetingController@delete');
	Route::post('meeting/send-emails', 'API\MeetingController@sendEmails');
	Route::post('meeting/send-invities', 'API\MeetingController@sendInvities');
	Route::post('meeting/create-from-template', 'API\MeetingController@createFromTemplate');
	//get all types 
	Route::get('types', 'API\TypeController@showAll');
	//notes action
	Route::post('note', 'API\NoteController@create');
	Route::put('note/{id}', 'API\NoteController@update');
	Route::delete('note/{id}', 'API\NoteController@delete');
	//delete meeting attendant
	Route::delete('meeting-atendant/{id}', 'API\MeetingAttendantController@delete');
	//help actions
	Route::post('help', 'API\HelpController@sendHelpMessage');
	//show user contacts
	Route::get('user-contacts', 'API\UserContactController@show');
	//Meeting agenda actions
	Route::post('meeting-agenda', 'API\MeetingAgendaController@create');
	Route::put('meeting-agenda/{id}', 'API\MeetingAgendaController@update');
	Route::delete('meeting-agenda/{id}', 'API\MeetingAgendaController@delete');
	Route::post('user', 'API\UserController@findUser');
	//time zones for users and meetings
	Route::post('user-time-zone', 'API\UserTimeZoneController@create');
	Route::put('user-time-zone/{id}', 'API\UserTimeZoneController@update');
	//Meeting templates
	Route::get('/templates', 'API\MeetingTemplateController@showAll');
	Route::post('/templates', 'API\MeetingTemplateController@create');
	Route::get('/templates/{id}', 'API\MeetingTemplateController@show');
	Route::put('templates/{uniqueStringID}', 'API\MeetingTemplateController@update');
	Route::delete('templates/{uniqueStringID}', 'API\MeetingTemplateController@destroy');
});

Route::get("/", function() {
    return view('index');
});

//Route::get('/', function () {
//    return view('land-page');
//});
Route::get("{any}", function() {
    return redirect("/");
});

