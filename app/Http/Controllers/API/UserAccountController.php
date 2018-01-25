<?php
namespace App\Http\Controllers\API;

use App\User;
use App\PasswordReset;
use Validator;
use Auth;
use Mail;
use Hash;
use JWTAuth;
use Response;
use Request;    
use Input;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;

class UserAccountController extends Controller
{

	protected function sendResetPassLink()
    {
        $email = Input::get('email');
        $user = User::where('email', $email)->first();
        if(!$user)
        {
            return Response::json(array('error' => 'Invalid email address!'), 404);
        }
        $reset_password_link = $this->generateUniqueString('reset_password_link');
        $user->reset_password_link = $reset_password_link;
        $user->save();

        Mail::send('emails.password-reset', ['user' => $user, 'reset_password_link' => $reset_password_link], 
            function ($message) use ($user, $reset_password_link)
        {
            $message->from('agenda@rainbowriders.dk', $name = 'Rainbow Agenda');
            $message->to($user->email, $user->first_name . ' ' . $user->last_name);
            $message->subject('Password reset link');
        });

        return Response::json(array('success' => 'We sent you an e-mail with link to reset your password. Please check your e-mail.'), 200);

    }
   
    protected function resetPassword()
    {
        $token = Input::get('token');
        $user = User::where('reset_password_link', $token)->first();
        $check_token = Input::get('check_token');

        if($check_token) {
            if(!$user)
            {
                return Response::json(array('error' => ' This link has already been used.'), 404);
            } else {
                return Response::json(array('success' => 'true'), 200);
            }
        }
        else
        {
            if(!$user)
            {
                return Response::json(array('error' => ' This link has already been used.'), 404);
            }
            $rules = array(
                'password' => 'required|min:6',
                'repeatPassword' => 'required|same:password'
            );
            $data = array(
                'password' => Input::get('password'),
                'repeatPassword' => Input::get('repeatPassword')
            );
            $validator = Validator::make($data, $rules);
            if($validator->fails())
            {
                return Response::json(array('error' => $validator->messages()), 404);
            }
            $user->password = Hash::make($data['password']);
            $user->reset_password_link = '';
            $user->save();

            return Response::json(array('success' => 'Your password was changed successfully.'), 200);
        }

    }
    
    protected function resendAccountConfirmationCode()
    {
        $user = User::where('email', Input::get('email'))->first();
        if(!$user)
        {
           return Response::json(array('error' => 'Invalid email address!'), 404);
        }
        if((int)$user->confirmed === 1)
        {
            return Response::json(array('error' => 'Account is already confirmed!'), 404);
        }
        $user->confirmation_token = $this->generateUniqueString('confirmation_token');
        $user->save();
        
        Mail::send('emails.account-confirmation', ['user' => $user], function ($message) use ($user)
        {
           $message->from('agenda@rainbowriders.dk', $name = 'Rainbow Agenda');
           $message->to($user->email, $user->first_name . ' ' . $user->last_name);
           $message->subject('Account confirmation code');
        });

        return Response::json(array('success' => 'Confirmation link send successfully! Please check your email address!'), 200);
    }

    protected function acctivateAccount()
    {
        $user = User::where('confirmation_token', Input::get('token'))->first();
        if(!$user)
        {
            return Response::json(array('error' => 'Invalid account!'), 404);
        }
        if((int)$user->confirmed === 1 )
        {
            return Response::json(array('error' => 'Account is already verified!'), 404);
        }
        $user->confirmed = 1;
        $user->save();

        return Response::json(array('success' => 'Successfully activated account! Please login to proceed!'), 200);
    }

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
}


