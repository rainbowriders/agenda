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
use App\Http\Controllers\Controller;
use App\Http\Controllers\Auth\AuthController;


class UserContactController extends Controller
{
	public function show(AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();
		$pattern = Input::get('pattern');

		return $contacts = UserContact::where('userID', $user->id)
		->where(function ($query) use ($pattern)
		{
			return $query->where('first_name', 'LIKE', '%'. $pattern . "%")
					->orWhere('last_name', 'LIKE', '%'. $pattern . "%")
					->orWhere('email', 'LIKE', '%'. $pattern . "%");
		})
		->get();
	}
}