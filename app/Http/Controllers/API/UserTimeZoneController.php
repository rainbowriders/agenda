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
use App\UserTimeZone;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Auth\AuthController;


class UserTimeZoneController extends Controller
{
	public function create(AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();
		$data = Input::all();
		$isExist = UserTimeZone::where('meetingID', $data['meetingID'])
					->where('userID', $user->id)->first();

		if($isExist)
		{
			return;
		}
		$userTimeZone = UserTimeZone::create([
				'meetingID' => $data['meetingID'],
				'userID' => $user->id,
				'name' => $data['name'],
				'offset' => $data['offset']		
			]);

		return $userTimeZone;
	}

	public function update(AuthController $auth, $id)
	{
		$user = $auth->getAuthenticatedUser();
		$userTimeZone = UserTimeZone::find($id);
		if($userTimeZone)
		{
			$userTimeZone->name = Input::get('name');
			$userTimeZone->offset = Input::get('offset');
			$userTimeZone->save();
			return $userTimeZone;
		}
		else 
		{
			return;
		}
	}
}