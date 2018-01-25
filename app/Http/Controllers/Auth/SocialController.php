<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Google_Client;
use Google_Service_Plus_Person;
use Google_Service_Plus;
use Socialite;
use App\User;
use JWTAuth;
use Response;
use GuzzleHttp;
use App\Activity;

class SocialController extends Controller
{
   public function google(Request $request)
   {
       $data = $request->all();
       $client = new Google_Client();
       $client->setApplicationName('Agenda');
       $client->setClientId('988813382835-erltut93r959akiirvr87lackh1ij0vl.apps.googleusercontent.com');
       $client->setClientSecret('JKW0qnO67SnYIgY17B103Dli');
       $client->setRedirectUri('http://app.agenda.rainbowriders.dk');
       $client->setScopes(array(
           'https://www.googleapis.com/auth/plus.me',
           'https://www.googleapis.com/auth/userinfo.email',
           'https://www.googleapis.com/auth/userinfo.profile',
       ));
       $client->authenticate($data['code']);

       $plus = new Google_Service_Plus($client);
       $userInfo = $this->getGoogleUserInfo($plus->people->get('me'));

       if($userInfo) {
           $user = User::where('email', $userInfo['email'])->first();
           if($user) {
               $token = JWTAuth::fromUser($user);
           } else {
               $newUser = $this->createUserFromSocials($userInfo['email'], $userInfo['first_name'], $userInfo['last_name']);

               $user = User::find($newUser->id);

               $token = JWTAuth::fromUser($user);
           }
	   Activity::create(['user_id' => $user->id]);

           return Response::json(array('success' => 'Welcome '.$user->first_name . ' '.$user->last_name ,
               'token' => JWTAuth::fromUser($user), 'user' => $user), 200);
       }

       return false;
   }

    public function linked(Request $request) {

        $code = $request->get('code');
        $clientId = '86xrsa4qe417x1';
        $clientSecret = '7urL8iiCmWLBzTzM';
        $redirectUri = 'http://app.agenda.rainbowriders.dk';

        $client = new GuzzleHttp\Client();

        $url = 'https://www.linkedin.com/uas/oauth2/accessToken?grant_type=authorization_code&code=' . $code . '&redirect_uri=' . $redirectUri . '&client_id=' . $clientId . '&client_secret=' . $clientSecret;

        $request = $client->request('POST', $url);

        $response = json_decode($request->getBody(), true);

        $linkedUser = Socialite::driver('linkedin')->userFromToken($response['access_token']);

        if($linkedUser) {
            $user = User::where('email', $linkedUser->getEmail())->first();
            if($user) {
                $token = JWTAuth::fromUser($user);
            } else {
                $userNames = explode(' ', $linkedUser->getName());
                $newUser = $this->createUserFromSocials($linkedUser->getEmail(), $userNames[0], $userNames[1]);


                $user = User::find($newUser->id);

                $token = JWTAuth::fromUser($user);
            }

           Activity::create(['user_id' => $user->id]);
            return Response::json(array('success' => 'Welcome '.$user->first_name . ' '.$user->last_name ,
                'token' => JWTAuth::fromUser($user), 'user' => $user), 200);
        }

        return false;
    }

   public function facebook(Request $request)
   {
       $token = $request->get('token');

       $fbUser = Socialite::driver('facebook')->userFromToken($token);

       if($fbUser) {
           $user = User::where('email', $fbUser->getEmail())->first();
           if($user) {
               $token = JWTAuth::fromUser($user);

           } else {
               $userNames = explode(' ', $fbUser->getName());
               $newUser = $this->createUserFromSocials($fbUser->getEmail(), $userNames[0], $userNames[1]);


               $user = User::find($newUser->id);

               $token = JWTAuth::fromUser($user);
           }

	   Activity::create(['user_id' => $user->id]);

           return Response::json(array('success' => 'Welcome '.$user->first_name . ' '.$user->last_name ,
               'token' => JWTAuth::fromUser($user), 'user' => $user), 200);

       }

       return false;
   }

    private function createUserFromSocials($email, $first_name, $last_name) {

        $newUser = new User;
        $newUser->email = $email;
        $newUser->first_name = $first_name;
        $newUser->last_name = $last_name;
        $newUser->confirmed = 1;
        $newUser->save();

        return $newUser;

    }

    private function getGoogleUserInfo(Google_Service_Plus_Person $gPerson) {
        return array(
            'first_name' => $gPerson->getName()->givenName,
            'last_name' => $gPerson->getName()->familyName,
            'email' => $gPerson->getEmails()[0]->getValue(),
        );
    }
}
