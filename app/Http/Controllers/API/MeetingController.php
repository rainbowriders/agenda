<?php	

namespace App\Http\Controllers\API;

use App\MeetingAgenda;
use JWTAuth;
use Response;
use Request;    
use Input;
use Mail;
use Validator;
use DateTime;
use App\UserContact;
use App\Meeting;
use App\MeetingAttendant;
use App\MeetingTemplate;
use App\Note;
use App\Type;
use App\User;
use App\UserTimeZone;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Auth\AuthController;

class MeetingController extends Controller
{
	protected function create(AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();

		if($user->unsavedID)
		{
			$meeting = Meeting::create([
				'ownerID' => $user->id,
				'uniqueStringID' => $this->generateUniqueString('uniqueStringID')
			]);

			return Response::json(array('meeting' => $meeting), 200);
		}
		else
		{
			$meeting = Meeting::create([
				'ownerID' => $user->id,
				'uniqueStringID' => $this->generateUniqueString('uniqueStringID'),
				'minute_taker_first_name' => $user->first_name,
				'minute_taker_last_name' => $user->last_name,
				'minute_taker_email' => $user->email,
				'minute_taker' => $user->first_name . ' ' . $user->last_name,
			]);

			MeetingAttendant::create([
				'meetingID' => $meeting->uniqueStringID,
				'meeting_attendant' => $user->first_name . ' ' . $user->last_name,
				'first_name' => $user->first_name,
				'last_name' => $user->last_name,
				'email' => $user->email,
				'field' => 1,
			]);

			return Response::json(array('meeting' => $meeting), 200);
		}
	}

	protected function show(AuthController $auth, $uniqueStringID)
	{	
		$user = $auth->getAuthenticatedUser();
		$meeting = Meeting::where('uniqueStringID', $uniqueStringID)
		->with('user')
		->with(array('agenda' => function ($query)
		{
			$query->orderBy('number');
			$query->with(array('note' => function ($query)
			{
				$query->with('owner');
				$query->with('type');
			}));
		}))
		->with('attendants')
		->get();
		$userTimeZone = UserTimeZone::where('userID', $user->id)->where('meetingID', $uniqueStringID)
						->first();

		if(!$userTimeZone)
		{
			$userTimeZone = array();
		}
		return Response::json(array('meeting' => $meeting, 'userTimeZone' => $userTimeZone), 200);
	}

	protected function showAll(AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();
		// return meetings for unsaved account
		if(strlen($user->unsavedID) > 1)
		{
			if(Input::get('pattern'))
			{
				$meetings = Meeting::where('ownerID', $user->id)->with('attendants')->get();
				$meetings = $this->getMeetingsFilteredBySearchPattern($meetings, Input::get('pattern'));
			}
			else
			{
				if(Input::get('filed') === '1')
				{
					$meetings = Meeting::where('ownerID', $user->id)->where('filed', 1)->with('attendants')->get();
				}
				else
				{
					$meetings = Meeting::where('ownerID', $user->id)->with('attendants')->get();
				}
			}
			$timeZones = $this->getUserTimeZone($user->id, $meetings);
			return Response::json(array('meetings' => $meetings, 'timeZones' => $timeZones), 200);
		}

		//return meetings from loged user
		if(Input::get('pattern'))
		{
			$meetingsIDs = $this->getAllMeetingsIDs($user);
			$meetings = $this->getAllMeetings($meetingsIDs);
			$meetings = $this->getMeetingsFilteredBySearchPattern($meetings, Input::get('pattern'));
		}
		else
		{
			if(Input::get('show') === 'all'){
				if(Input::get('filed') === '1')
				{
					$meetingsIDs = $this->getAllMeetingsIDs($user);
					$meetings = $this->getFiledMeetingsOnly($meetingsIDs);
				}
				else
				{
					$meetingsIDs = $this->getAllMeetingsIDs($user);
					$meetings = $this->getAllMeetings($meetingsIDs);
				}
			}
			if(Input::get('show') === 'own')
			{
				if(Input::get('filed') === '1'){
					$meetings = $this->getOwnMeetings($user, true);
				}
				else
				{
					$meetings = $this->getOwnMeetings($user, false);
				}
			}
			if(Input::get('show') === 'attendant')
			{
				if(Input::get('filed') === '1')
				{
					$meetingsIDs = $this->getAttendantsMeetingsIds($user);
					$meetings = $this->getFiledMeetingsOnly($meetingsIDs); 
				}
				else
				{
					$meetingsIDs = $this->getAttendantsMeetingsIds($user);
					$meetings = $this->getAllMeetings($meetingsIDs);
				}
			}
		}
		$timeZones = $this->getUserTimeZone($user->id, $meetings);
		return Response::json(array('meetings' => $meetings, 'timeZones' => $timeZones), 200);
	}

	protected function update ($uniqueStringID, AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();
		$meeting = Meeting::where('uniqueStringID', $uniqueStringID)->first();
		$data = Input::all();

		foreach ($data as $key => $value) {
			if($key === 'attendant')
			{
				$validator = Validator::make($value, [
					'email' => 'email'
				]);
				if($validator->fails())
				{
					continue;
				}
				//check if meeting have attendant with same data
				$attendant = MeetingAttendant::where('meetingID', $meeting->uniqueStringID)
									->where('email', $value['email'])
									->first();
				//if meeting has attendant return msg
				if($attendant)
				{
					return Response::json(array('error' => $meeting->title . ' already have this attendant!'), 404);
				}
				else
				{
					//check if user has contact with same email 
					$contact = UserContact::where('userID', $user->id)
								->where('email', $value['email'])->first();
					//if contact does not exist - created it
					if(!$contact)
					{
						UserContact::create([
							'userID' => $user->id,
							'first_name' => $value['first_name'],
							'last_name' => $value['last_name'],
							'email' => $value['email']
						]);
					}
					//create meeting's new attendant
					MeetingAttendant::create([
						'meetingID' => $meeting->uniqueStringID,
						'meeting_attendant' => $value['meeting_attendant'],
						'first_name' => $value['first_name'],
						'last_name' => $value['last_name'],
						'email' => $value['email'],
						'field' => $value['field']
					]);
				}
			}
			else
			{
				//save new data for meeting
				$meeting->$key = $value;
				$meeting->save();
			}
		}

		$result = Meeting::where('uniqueStringID', $uniqueStringID)
			->with('user')
			->with(array('agenda' => function ($query)
			{
				$query->orderBy('number');
				$query->with(array('note' => function ($query)
				{
					$query->with('owner');
					$query->with('type');
				}));
			}))
			->with('attendants')
			->get();
		return Response::json(array('meeting' => $result), 200);
	}

	protected function delete($uniqueStringID, AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();
		$meeting = Meeting::where('uniqueStringID', $uniqueStringID)
		->with('attendants')
		->with(array('notes' => function ($query)
		{
			$query->with('owner');
			$query->with('type');
		}))->first();
		//return error msg if meeting dosn't exist
		if(!$meeting)
		{
			return Response::json(array('error' => 'Meeting does\'t exist!'), 500);
		}
		//check if user is meeting owner and delete meeting and all meeting's attendants and notes
		if($meeting->ownerID === $user->id)
		{
			foreach ($meeting->attendants as $attendant) {
				$attendant->delete();
			}
			foreach ($meeting->notes as $note) {
				$note->delete();
			}
			$meeting->delete();
			return Response::json(array('success' =>   $meeting->title . 'Meeting successfully deleted!'), 200);
		}
		else
		{	
			//return error if user is not meeting owner
			return Response::json(array('error' => 'You don\'t have permission to delete this meeting !'));
		}
	}

	public function createFromTemplate(AuthController $auth) {
		$user = $auth->getAuthenticatedUser();
		$uniqueStringID = Input::get('uniqueStringID');
		$template = MeetingTemplate::where('uniqueStringID', $uniqueStringID)->with('agenda')->with('attendants')->get();
		$template = $template[0];

		$meeting = Meeting::create([
			'ownerID' => $user->id,
			'uniqueStringID' => $this->generateUniqueString('uniqueStringID'),
			'minute_taker_first_name' => $template->minute_taker_first_name,
			'minute_taker_last_name' => $template->minute_taker_last_name,
			'minute_taker_email' => $template->minute_taker_email,
			'minute_taker' => $template->minute_taker,
			'place' => $template->place,
			'title' => $template->title,
		]);

		foreach ($template->agenda as $agenda) {
			MeetingAgenda::create([
				'meetingID' => $meeting->uniqueStringID,
				'number' => $agenda->number,
				'text' => $agenda->text,
				'duration' => 0,
				'end_time' => 0,
				'start_time' => 0,
			]);
		}

		foreach ($template->attendants as $attendant) {
			MeetingAttendant::create([
				'meetingID' => $meeting->uniqueStringID,
				'first_name' => $attendant->first_name,
				'last_name' => $attendant->last_name,
				'email' => $attendant->email,
				'meeting_attendant' => $attendant->meeting_attendant,
				'field' => 1,
				'invited' => 0,
			]);
		}

		return Response::json(array('meeting' => $meeting), 200);

	}

	public function sendEmails (AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();
		$meeting = Meeting::where('uniqueStringID', Input::get('uniqueStringID'))
		->with('user')
		->with(array('agenda' => function ($query)
		{
			$query->orderBy('number');
			$query->with(array('note' => function ($query)
			{
				$query->with('owner');
				$query->with('type');
			}));
		}))
		->with('attendants')
		->first();

		$noteColors = array(
				'To Do' => 'blue', 
				'Idea' => 'green',
				'Decision' => 'red',
				'Info' => 'gray',
				'Done' => 'blue',
				'Agenda' => 'brown',
				'Question' => 'orange'
			);
		$subject = 'Notes from meeting: ';
		if(!$meeting->title)
		{
			$meeting->title = 'Meeting title';
		}
		if($meeting->title)
		{
			$subject = $subject . $meeting->title . ', ';
		}
		if($meeting->date)
		{	
			$date = date("d.m.Y",strtotime($meeting->date));
			$subject = $subject . $date . ', ';
		}
		else 
		{
			$date = '';
		}
		$timeOffset = UserTimeZone::where('userID', $user->id)->where('meetingID',  Input::get('uniqueStringID'))->first();
		if($meeting->start_time)
		{
			$start_time = date('H:i', (strtotime($meeting->start_time) + 10800 + (intval($timeOffset->offset) * 60)));
//			$subject = $subject . $start_time . '-';
			$subject = $subject . $start_time;
		}
//		if($meeting->end_time)
//		{
//			$end_time = date('H:i', (strtotime($meeting->end_time) + 10800 + (intval($timeOffset->offset) * 60)));
//			$subject = $subject . $end_time . ', ';
//		}
		$subject = rtrim($subject, ", ");
		if(strlen($subject) === 0)
		{
			$subject = $subject . date("d.m.y");
		}
		foreach ($meeting->attendants as $attendant) {
			$attMails = array();
			foreach ($meeting->attendants as $att) {
				if($att->email == $attendant->email)
				{
					continue;
				}
				else
				{
					array_push($attMails, $att->email);
				}
			}
			Mail::send('emails.meeting', 
				['meeting' => $meeting, 'noteColors' => $noteColors, 'subject' => $subject, 'attendant' => $attendant, 'date' => $date, 'attMails' => $attMails], 
				function ($message) use ($meeting, $noteColors, $subject, $attendant, $attMails)
        	{
				$message->from('agenda@rainbowriders.dk', $name = 'Rainbow Agenda');
				$message->to($attendant->email, $attendant->first_name . ' ' . $attendant->last_name);
				$message->subject($subject);
				$message->replyTo($attMails);
        	});
		}

	}

	public function sendInvities(AuthController $auth)
	{
		$user = $auth->getAuthenticatedUser();
		$meeting = Meeting::where('uniqueStringID', Input::get('uniqueStringID'))
		->with('attendants')
		->first();

		$uniqueStringID = $meeting->uniqueStringID;
		if(!$meeting->title)
		{
			$meeting->title = 'Meeting title';
		}
		$subject = 'Agenda: ' . $meeting->title . ', ';
		if($meeting->date)
		{
			$date = date("d.m.Y",strtotime($meeting->date));
			$subject = $subject . $date . ', ';
		}
		$timeOffset = UserTimeZone::where('userID', $user->id)->where('meetingID', $uniqueStringID)->first();

		if($meeting->start_time)
		{
			$start_time = date('H:i', (strtotime($meeting->start_time) + 10800 + (intval($timeOffset->offset) * 60)));
//			$subject = $subject . $start_time . '-';
			$subject = $subject . $start_time;
		}
//		if($meeting->end_time)
//		{
//			$end_time = date('H:i', (strtotime($meeting->end_time) + 10800 + (intval($timeOffset->offset) * 60)));
//			$subject = $subject . $end_time . ', ';
//		}
		$subject = rtrim($subject, ", ");

		foreach ($meeting->attendants as $attendant) {

			if((integer)$attendant->invited === 0)
			{


				Mail::send('emails.meeting-room-invate', ['meeting' => $meeting, 'attendant' => $attendant,
														'uniqueStringID' => $meeting->uniqueStringID, '$subject' => $subject],
				function ($message) use ($meeting, $attendant, $uniqueStringID, $subject)
				{
					$message->from('agenda@rainbowriders.dk', $name = 'Rainbow Agenda');
					$message->to($attendant->email, $attendant->first_name . ' ' . $attendant->last_name);
					$message->subject($subject);
				});
				$attendant->invited = 1;
				$attendant->save();
			}
		}
		return Response::json(array('success' => 'Invitations sent successfully!'), 200);
	}

	//ruturns all meetings IDs where user is taker or user is attendant
	protected function getAllMeetingsIDs($user)
	{
		$attendants = MeetingAttendant::where('email', $user->email)->where('invited', 1)->get();
		$ownMeetings = Meeting::where('ownerID', $user->id)->get();
		$meetingsIDs = array();
		foreach ($attendants as $attendant) {
			array_push($meetingsIDs, $attendant['meetingID']);
		}
		foreach ($ownMeetings as $meeting) {
			array_push($meetingsIDs, $meeting['uniqueStringID']);
		}
		return $meetingsIDs;
	}
	//returns only own meetings
	protected function getOwnMeetings($user, $filed)
	{	
		//returns all own meetings
		if($filed === false)
		{
			return Meeting::orderBy('created_at')
					->where('ownerID', $user->id)
					->with('attendants')
					->get();
		}
		//returns only filed own meetings
		return Meeting::orderBy('created_at')
				->where('ownerID', $user->id)
				->where('filed', 1)
				->with('attendants')
				->get();
	}
	
	//returns meetings where they are filed only
	protected function getFiledMeetingsOnly($meetingsIDs)
	{
		return Meeting::orderBy('created_at')
				->whereIn('uniqueStringID', $meetingsIDs)
				->where('filed', 1)
				->with('attendants')		
				->get();
	}
	//ruturns all meetings where user is taker or user is attendant
	protected function getAllMeetings($meetingsIDs)
	{
		return Meeting::orderBy('created_at')
				->whereIn('uniqueStringID', $meetingsIDs)
				->with('attendants')
				->with(array('agenda' => function ($query)
				{
					$query->with('note');
				}))
				->get();
	}
	//return meetings ids where user is attendant only
	protected function getAttendantsMeetingsIds($user)
	{
		$attendants = MeetingAttendant::where('email', $user->email)
		->where('invited', 1)
		->get();
		$result = array();

		foreach ($attendants as $attendant) {
			array_push($result, $attendant['meetingID']);
		}

		return $result;
	}
	//returns meeting who contains search pattern
	protected function getMeetingsFilteredBySearchPattern($meetings, $searchPattern)
	{
		$result = array();
		$searchPattern = strtolower($searchPattern);
		foreach ($meetings as $meeting) {
			$target = strtolower($meeting['title']);
			if($this->searchIntarget($target, $searchPattern))
			{
				array_push($result, $meeting);
				continue;
			}
			$target = strtolower($meeting['minute_taker_email']);
			if($this->searchIntarget($target, $searchPattern))
			{
				array_push($result, $meeting);
				continue;
			}
			$target = strtolower($meeting['minute_taker_first_name']);
			if($this->searchIntarget($target, $searchPattern))
			{
				array_push($result, $meeting);
				continue;
			}
			$target = strtolower($meeting['minute_taker_last_name']);
			if($this->searchIntarget($target, $searchPattern))
			{
				array_push($result, $meeting);
				continue;
			}
			$foundInAttendant = false;
			if(count($meeting['attendants']) > 0)
			{
				foreach ($meeting['attendants'] as $attendant) {
					$target = strtolower($attendant['email']);
					if($this->searchIntarget($target, $searchPattern))
					{
						$foundInAttendant = true;
						continue;
					}
					$target = strtolower($attendant['last_name']);
					if($this->searchIntarget($target, $searchPattern))
					{
						$foundInAttendant = true;
						continue;
					}
					$target = strtolower($attendant['first_name']);
					if($this->searchIntarget($target, $searchPattern))
					{
						$foundInAttendant = true;
						continue;
					}
				}
			}
			if($foundInAttendant)
			{
				array_push($result, $meeting);
				continue;
			}
			$target = strtolower($meeting['place']);
			if($this->searchIntarget($target, $searchPattern))
			{
				array_push($result, $meeting);
				continue;
			}
			$target = date("d.m.Y",strtotime($meeting['date']));
			if($this->searchIntarget($target, $searchPattern))
			{
				array_push($result, $meeting);
				continue;
			}
			if(count($meeting['agenda']) > 0) {
				foreach ($meeting['agenda'] as $agenda) {
					$target = strtolower($agenda['text']);
					if($this->searchIntarget($target, $searchPattern)) {
						array_push($result, $meeting);
						break;
					}
					$isInNote = false;
					if(count($agenda['note']) > 0) {
						foreach ($agenda['note'] as $note) {
							$target = strtolower($note['body']);
							if($this->searchIntarget($target, $searchPattern)) {
								$isInNote = true;
								break;
							}
						}
					}
					if($isInNote == true) {
						array_push($result, $meeting);
						break;
					}

				}
			}
		}
		return $result;
	}
	//helper for getMeetingsFilteredBySearchPattern function
	protected function searchIntarget($target, $searchPattern)
	{
		if(strpos($target, $searchPattern) !== false)
		{
			return true;
		}
		return false;
	}
	//generate unique string for meeting string id
	protected function generateUniqueString($col)
    {
        $string = str_random(12) . time() . str_random(12);
        $meeting = Meeting::where($col, $string)->first();
        if($meeting)
        {
            $this->generateUniqueString($col);
        }
        return $string;
    }

    protected function getUserTimeZone($id, $meetings)
    {
    	$result = array();
    	foreach ($meetings as $meeting) {
    		$userTimeZone = UserTimeZone::where('userID', $id)->where('meetingID', $meeting->uniqueStringID)
						->first();
			if($userTimeZone)
			{
				array_push($result, $userTimeZone);
			}
			else 
			{
				array_push($result, null);
			}
    	}

    	return $result;

    }
}