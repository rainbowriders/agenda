<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use App\Meeting;
use App\Note;
use App\UserContact;
use App\Activity;


class User extends Model implements AuthenticatableContract, CanResetPasswordContract
{
    use Authenticatable, CanResetPassword;

    protected $table = 'users';

    protected $fillable = ['first_name', 'last_name', 'email', 'password', 'unsavedID', 'reset_password_link', 'confirmation_token', 'confirmed', 'remember_token', 'last_login'];

    protected $hidden = ['password', 'updated_at', 'created_at', 'reset_password_link', 'confirmation_token', 'confirmed'];

}
