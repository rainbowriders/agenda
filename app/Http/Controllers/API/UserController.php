<?php	

namespace App\Http\Controllers\API;

use JWTAuth;
use Response;
use Request;    
use Validator;
use Input;
use Mail;
use App\UserContact;
use App\Meeting;
use App\MeetingAttendant;
use App\Note;
use App\Type;
use App\User;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Auth\AuthController;


class UserController extends Controller
{
	public function findUser(AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();
		$isUser = User::where('email', Input::get('email'))->first();
		if($isUser)
		{
			return Response::json(array('user' => $isUser), 200);
		}
		else
		{
			return Response::json(array('notFound' => 'notFound', 'email' => Input::get('email')), 200);
		}
	}
}