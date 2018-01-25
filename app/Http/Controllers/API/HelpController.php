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


class HelpController extends Controller
{
	public function sendHelpMessage()
	{
		$data = input::all();
		$rules = array(
				'name' => 'required',
				'email' => 'required',
				'subject' => 'required',
				'text' => 'required'
			);
		$validator = Validator::make($data, $rules);

		if($validator->fails())
		{
			return Response::json(array('error' =>$validator->messages()), 404); 
		}
		else 
		{
			Mail::send('emails.help-message', ['data' => $data], function ($message) use ($data)
        	{
				$message->from('agenda@rainbowriders.dk');
				$message->to('info@rainbowriders.dk', null);
				$message->subject($data['subject']);
				$message->replyTo($data['email'], $data['name']);
			});

			return Response::json(array('success' => 'Message sent successfully!'), 200);
		}

	}
}