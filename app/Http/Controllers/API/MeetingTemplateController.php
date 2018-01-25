<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;

use App\Http\Requests;
use Response;
use Input;
use App\Http\Controllers\Controller;
use JWTAuth;
use App\Http\Controllers\Auth\AuthController;
use App\MeetingTemplate;
use App\MeetingAttendant;
use App\UserContact;
use Validator;

class MeetingTemplateController extends Controller
{

    protected $user;

    public function __construct (AuthController $auth) {
        $this->user = $auth->getAuthenticatedUser();
    }

    public function showAll (Request $request) {

        $templates = MeetingTemplate::where('ownerID', $this->user->id)
            ->with('attendants')
            ->get();

        $pattern = Input::get('pattern');

        if($pattern) {
            $templates = $this->search($templates, $pattern);
        }

        return Response::json(array('templates' => $templates), 200);
    }



    public function show ($id) {

        $uniqueStringID = $id;

        $template = MeetingTemplate::where('uniqueStringID', $uniqueStringID)->with('attendants')->with('agenda')->get();

        return Response::json(array('template' => $template), 200);

    }

    public function create () {

        $template = new MeetingTemplate();

        $template->uniqueStringID = $this->generateUniqueStringID();
        $template->ownerID = $this->user->id;
        $template->minute_taker = $this->user->first_name . ' ' . $this->user->last_name;
        $template->minute_taker_first_name = $this->user->first_name;
        $template->minute_taker_last_name = $this->user->last_name;
        $template->minute_taker_email = $this->user->email;

        $template->save();

        $attendant = new MeetingAttendant();
        $attendant->meetingID = $template->uniqueStringID;
        $attendant->meeting_attendant = $template->minute_taker;
        $attendant->first_name = $this->user->first_name;
        $attendant->last_name = $this->user->last_name;
        $attendant->email = $this->user->email;

        $attendant->save();


        return Response::json(array('template' => $template), 200);

    }

    public function update ($uniqueStringID, AuthController $auth)
    {
        $user = $auth->getAuthenticatedUser();
        $template = MeetingTemplate::where('uniqueStringID', $uniqueStringID)->first();
        $data = Input::all();

        foreach ($data as $key => $value) {
            if($key === 'attendant')
            {
                $validator = Validator::make($value, [
                    'email' => 'email'
                ]);
//                if($validator->fails())
//                {
//                    continue;
//                }
                //check if meeting have attendant with same data
                $attendant = MeetingAttendant::where('meetingID', $template->uniqueStringID)
                    ->where('email', $value['email'])
                    ->first();
                //if meeting has attendant return msg
                if($attendant)
                {
                    return Response::json(array('error' => $template->title . ' already have this attendant!'), 404);
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
                        'meetingID' => $template->uniqueStringID,
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
                $template->$key = $value;
                $template->save();
            }
        }
        $result = MeetingTemplate::with('attendants')
            ->with('agenda')
            ->find($template->id);
        return Response::json(array('template' => $result), 200);
    }

    public function destroy($uniqueStringID) {

        $template = MeetingTemplate::where('uniqueStringID', $uniqueStringID)
            ->with('attendants')
            ->first();
        //return error msg if meeting dosn't exist
        if(!$template)
        {
            return Response::json(array('error' => 'Template does\'t exist!'), 500);
        }
        //check if user is meeting owner and delete meeting and all meeting's attendants and notes
        if($template->ownerID === $this->user->id)
        {
            foreach ($template->attendants as $attendant) {
                $attendant->delete();
            }

            $template->delete();
            return Response::json(array('success' =>   $template->title . ' template successfully deleted!'), 200);
        }
        else
        {
            //return error if user is not meeting owner
            return Response::json(array('error' => 'You don\'t have permission to delete this template !'));
        }
    }

    private function generateUniqueStringID() {
        $string = str_random(12) . time() . str_random(12);
        $template = MeetingTemplate::where('uniqueStringID', $string)->first();
        if($template) {
            return $this->generateUniqueStringID();
        }

        return $string;
    }

    private function search($templates, $pattern) {

        $pattern = strtolower($pattern);
        $result = array();
        foreach ($templates as $template) {
            $target = strtolower($template['title']);
            if($this->searchIntarget($target, $pattern))
            {
                array_push($result, $template);
                continue;
            }

            $target = strtolower($template['place']);
            if($this->searchIntarget($target, $pattern))
            {
                array_push($result, $template);
                continue;
            }
            $foundInAttendant = false;
            if(count($template['attendants']) > 0)
            {
                foreach ($template['attendants'] as $attendant) {
                    $target = strtolower($attendant['email']);
                    if($this->searchIntarget($target, $pattern))
                    {
                        $foundInAttendant = true;
                        continue;
                    }
                    $target = strtolower($attendant['last_name']);
                    if($this->searchIntarget($target, $pattern))
                    {
                        $foundInAttendant = true;
                        continue;
                    }
                    $target = strtolower($attendant['first_name']);
                    if($this->searchIntarget($target, $pattern))
                    {
                        $foundInAttendant = true;
                        continue;
                    }
                }
            }
            if($foundInAttendant)
            {
                array_push($result, $template);
                continue;
            }
            if(count($template['agenda']) > 0) {
                foreach ($template['agenda'] as $agenda) {
                    $target = strtolower($agenda['text']);
                    if($this->searchIntarget($target, $pattern)) {
                        array_push($result, $template);
                        break;
                    }
                }
            }
        }

        return $result;
    }

    protected function searchIntarget($target, $searchPattern)
    {
        if(strpos($target, $searchPattern) !== false)
        {
            return true;
        }
        return false;
    }
}
