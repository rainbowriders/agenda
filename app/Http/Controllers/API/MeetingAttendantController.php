<?php

namespace App\Http\Controllers\API;

use Request;
use Response;
use Input;
use App\MeetingAttendant;
use App\UserContact;
use App\Meeting;
use Validator;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Auth\AuthController;

class MeetingAttendantController extends Controller
{
	public function create(AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();
		$attendantData = Input::all();
		$rules = array(
			'email' => 'required',
			'last_name' => 'required',
			'first_name' => 'required',
			'meetingID' => 'required',
			'field' => 'required'
		);
		$validator = Validator::make($attendantData, $rules);
		if($validator->fails())
		{
			return Response::json(array('error' =>$validator->messages()), 404);
		}
		$meetingID = $attendantData['meetingID'];
		$meeting = Meeting::find($meetingID);
		if($meeting)
		{
			$attendants = MeetingAttendant::where('meetingID', $meeting->id)->get();
			foreach ($attendants as $key => $value) {
				if($value->email === $attendantData['email'])
				{
					return Response::json(array('error' => 'You have already this attendant in this meeting!'), 500);
				}
			}

			$attendant = MeetingAttendant::create($attendantData);
			$userContact = UserContact::where('email', $attendant->email)
			->where('userID', $user->id)->first();

			if(!$userContact)
			{
				UserContact::create([
					'first_name' => $attendant->first_name,
					'last_name' => $attendant->last_name,
					'email' => $attendant->email,
					'userID' => $user->id
				]);
			}

			return Response::json(array('attendant' => $attendant), 200);
		}
		else
		{
			return Response::json(array('error' => 'Meeting dont found'), 404);
		}
	}

	public function delete($id, AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();
		$meeting = Meeting::with(array('attendants' => function ($query) use ($id)
		{
			$query->where('id', $id);
		}))
		->find(Input::get('meetingID'));
		if(!$meeting) {
			MeetingAttendant::destroy($id);
			return Response::json(array('success' => 'success'), 200);
		}
		if(count($meeting->attendants) > 0 && $meeting->ownerID === $user->id)
		{
			MeetingAttendant::destroy($id);
			$result = Meeting::with('attendants')->find(Input::get('meetingID'));
			return Response::json(array('meeting' => $result), 200);
		}
		else
		{
			return Response::json(array('error' => 'This meeting don\'t have this attendant!'), 404);
		}
	}
}