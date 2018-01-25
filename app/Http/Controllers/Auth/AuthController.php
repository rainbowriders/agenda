<?php

namespace App\Http\Controllers\Auth;

use App\User;
use Validator;
use Auth;
use Mail;
use Hash;
use JWTAuth;
use Response;
use Request;
use Input;
use App\Http\Controllers\Controller;
use App\Meeting;
use App\MeetingAttendant;
use DateTime;
use Carbon\Carbon;
use App\Activity;

class AuthController extends Controller
{
    public function getAuthenticatedUser()
    {
        try {

            if (!$user = JWTAuth::parseToken()->toUser()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['token_absent'], $e->getStatusCode());
        }


        if($user->last_login != null) {
            $last_login = Carbon::parse($user->last_login);
            $now = Carbon::now();
            if($now->diffInDays($last_login) != 0) {
                $user->last_login = new DateTime();
                $user->save();
            }
        } else {
            $user->last_login = new DateTime();
            $user->save();
        }

        return $user;
    }

    protected function create()
    {
        $data = Input::all();
        $rules = array(
                'email' => 'required|unique:users,email|max:100',
                'first_name' => 'required|max:50',
                'last_name' => 'required|max:50',
                'password' => 'required|min:6'
                // 'repeatPassword' => 'same:password'
                );
        $validator = \Validator::make($data, $rules);
        if($validator->fails())
        {
            return Response::json(array('error' =>$validator->messages()), 404);
        }

        $confirmationToken = $this->generateUniqueString('confirmation_token');

        $user =  User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'confirmation_token' => $confirmationToken
        ]);
        Mail::send('emails.account-confirmation', ['user' => $user], function ($message) use ($user)
        {
           $message->from('agenda@rainbowriders.dk', $name = 'Rainbow Agenda');
           $message->to($user->email, $user->first_name . ' ' . $user->last_name);
           $message->subject('Account confirmation code');
        });
        $isAddedInMeetings = Meeting::where('minute_taker_email', $data['email'])->get();
        $isAttendant = MeetingAttendant::where('email', $data['email'])->get();
        if($isAddedInMeetings)
        {
            foreach ($isAddedInMeetings as $m) {
                $m->minute_taker = $user->first_name . ' ' . $user->last_name;
                $m->minute_taker_email = $user->email;
                $m->minute_taker_first_name = $user->first_name;
                $m->minute_taker_last_name = $user->last_name;
                $m->save();
            }
        }
        if($isAttendant)
        {
            foreach ($isAttendant as $att) {
                $att->meeting_attendant = $user->first_name . ' ' . $user->last_name;
                $att->email = $user->email;
                $att->first_name = $user->first_name;
                $att->last_name = $user->last_name;
                $att->save();
            }
        }
        return Response::json(array('success' => 'Account created successfully! Please confirm your email address to proceed!'), 200);
    }

    protected function logIn()
    {
        if(Input::get('remember_token'))
        {
            $user = User::where('remember_token', Input::get('remember_token'))->first();

            if(!$user)
            {
                return Response::json(array('error' => 'Invalid remember token!'), 404);
            }
            $redirectTo = $this->redirectAfterLogin($user);
            $user->last_login = new DateTime();
            $user->save();
 	    Activity::create(['user_id' => $user->id]);

            return Response::json(array('success' => 'Wellcome '.$user->first_name . ' '.$user->last_name ,
                'token' => JWTAuth::fromUser($user), 'user' => $user, 'redirectTo' => $redirectTo), 200);
        }
        //login with registered user
        $email = Input::get('email');
        $user = User::where('email', $email)->first();

        if(!$user)
        {
            return Response::json(array('error' => 'Invalid email adress!'), 404);
        }

        if(Hash::check(Input::get('password'), $user['password']))
        {
            if((int)$user->confirmed === 0)
            {
                return Response::json(array('error' => 'Please check your email address and confirm your account!'), 404);
            }
            $redirectTo = $this->redirectAfterLogin($user);
            if(Input::get('rememberMe'))
            {
                $user->remember_token = $this->generateUniqueString('remember_token');
                $user->save();
            }
            else
            {
                $user->remember_token = null;
                $user->save();
            }
            $user->last_login = new DateTime();
            $user->save();

	    Activity::create(['user_id' => $user->id]);

            return Response::json(array('success' => 'Welcome '.$user->first_name . ' '.$user->last_name ,
                'token' => JWTAuth::fromUser($user), 'user' => $user, 'redirectTo' => $redirectTo), 200);
        }
        else
        {
            return Response::json(array('error' => 'Invalid Password'), 404);
        }
    }

    // protected function createUnsavedAccount()
    // {
    //     $user = User::create([
    //         'unsavedID' => $this->generateUniqueString('unsavedID'),
    //         'email' => $this->generateUniqueString('email')
    //     ]);
    //     return Response::json(array('user' => $user, 'token' => JWTAuth::fromUser($user)), 200);
    // }

    protected function generateUniqueString($col)
    {
        $string = str_random(12) . time() . str_random(12);
        $user = User::where($col, $string)->first();
        if($user)
        {
            $this->generateUniqueString($col);
        }
        return $string;
    }

    // protected function loginWithUnsavedAccount($unsavedID)
    // {
    //     $user = User::where('unsavedID', $unsavedID)->first();

    //     if(!$user)
    //     {
    //         return $this->createUnsavedAccount();
    //     }

    //     $redirectTo = $this->redirectUnsavedAccount($user);
    //     return Response::json(array('user' => $user, 'token' => JWTAuth::fromUser($user), 'redirectTo' => $redirectTo), 200);
    // }

    protected function redirectAfterLogin($user)
    {
        $meeting = Meeting::where('ownerID', $user->id)->first();
        if($meeting)
        {
            return 'dashboard';
        }

        $isAttendant = MeetingAttendant::where('email', $user->email)->first();
        if($isAttendant)
        {
            return 'dashboard';
        }

        return 'new-meeting';
    }
    // protected function redirectUnsavedAccount($user)
    // {
    //     $meeting = Meeting::where('ownerID', $user->id)->first();
    //     if($meeting)
    //     {
    //         return 'dashboard';
    //     }
    //     return 'new-meeting';
    // }
}
