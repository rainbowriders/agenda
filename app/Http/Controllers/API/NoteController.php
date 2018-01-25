<?php

namespace App\Http\Controllers\API;

use Response;
use Request;
use Input;
use JWTAuth;
use App\Type;
use App\Note;
use App\Meeting;
use App\NoteOwner;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Auth\AuthController;

class NoteController extends Controller
{
	protected function create(AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();
		$meeting = Meeting::where('uniqueStringID', Input::get('uniqueStringID'))->first();
		//check if meeting dont exist return error msg
		if(!$meeting)
		{
			return Response::json(array('error' => 'Meeting not found!'), 500);
		}
		else
		{
			$note = Note::create([
				'ownerID' => $user->id,
				'meetingID' => $meeting->uniqueStringID,
				'agendaID' => Input::get('agendaID'),
				'body' => Input::get('body'),
				'ownerNames' => Input::get('ownerNames'),
				'typeID' => Input::get('typeID')
			]);
			$result = Note::with('owner')->with('type')->find($note->id);
			return Response::json(array('note' => $result), 200);
		}
		// //get all data about note's meeting 
		// $result = Meeting::with('attendants')->with('user')
		// ->with(array('notes' => function ($query)
		// {
		// 	$query->with('owner');
		// 	$query->with('type');
		// }))
		// ->find($meeting->id);

		// return Response::json(array('note' => $note), 200);
	}

	protected function update($id, AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();
		// $meeting = Meeting::where('uniqueStringID', Input::get('uniqueStringID'))->first();
		$note = Note::find($id);
		//return error msg if meeting dont exist
		// if(!$meeting)
		// {
		// 	return Response::json(array('error' => 'Invalid meeting data!'), 404);
		// }
		//return error message if meeting is not parent for note
		// if($meeting->uniqueStringID !== $note->meetingID)
		// {
		// 	return Response::json(array('error' => 'Invalid meeting data!'), 404);
		// }
		//return error if user is not note owner or meeting owner
		// if($meeting->ownerID !== $user->id || $note->ownerID !== $user->id)
		// {
		// 	return Response::json(array('error' => 'User have not permission to change this note!'), 404);
		// }
		$data = Input::all();
		foreach ($data as $key => $value) {
			//do nothing if input is uniqueStringID for meeting data
			if($key === 'uniqueStringID')
			{
				continue;
			}
			$note->$key = $value;
			$note->save();
		}
		return Response::json(array('success' => 'Successfully update a note!'), 200);
		//get all data about note's meeting 
		// $result = Meeting::with('attendants')->with('user')
		// 	->with(array('notes' => function ($query)
		// 	{
		// 		$query->with('owner');
		// 		$query->with('type');
		// 	}))
		// 	->find($meeting->id);

		// return Response::json(array('meeting' => $result), 200);
	}

	protected function delete($id, AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();
		$note = Note::find($id);

		if(!$note)
		{
			return Response::json(array('error' => 'Note not found!'), 500);
		}


			$note->delete();
			return Response::json(array('success' => 'Note deleted successfully!'), 200);
			//get all data about note's meeting 
				// $result = Meeting::where('uniqueStringID', Input::get('uniqueStringID'))->with('attendants')->with('user')
				// ->with(array('notes' => function ($query)
				// {
				// 	$query->with('owner');
				// 	$query->with('type');
				// }))
				// ->get();

			// return Response::json(array('success' => 'Note deleted successfully!', 'meeting' => $result), 200);
		// }
		// else
		// {
		// 	//returns error msg if user is not note owner and not meeting owner
		// 	return Response::json(array('error' => 'no permission to delete this note!'), 404);
		// }
	}
}