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
use App\MeetingAgenda;

class MeetingAgendaController extends Controller
{
	public function create(AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();
		$data = Input::all();
		$agendas = MeetingAgenda::where('meetingID', $data['meetingID'])->get();
		$data['number'] = count($agendas) + 1;
		$agenda = MeetingAgenda::create($data);

		$result = MeetingAgenda::where('meetingID', $data['meetingID'])->with('note')->get();
		return $result;
	}

	public function update($id, AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();
		$data = Input::all();
		$agenda = MeetingAgenda::find($id);
		if($agenda)
		{
			foreach ($data as $key => $value) {
				$agenda->$key = $value;
				$agenda->save();
			}
		}
		return $agenda;
	}

	public function delete($id, AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();
		$agenda = MeetingAgenda::with('note')->find($id);
		if(!$agenda)
		{
			return Response::json(array('error' => 'Agenda does not exist!'), 500);
		}
		foreach ($agenda->note as $note) {
			$note->delete();
		}

		$agenda->delete();
		return Response::json(array('success' => 'Agenda deleted successfully!'), 200);
	}
}