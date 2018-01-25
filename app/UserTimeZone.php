<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserTimeZone extends Model
{
    protected $table = 'user_time_zone';

    protected $fillable = ['meetingID', 'userID', 'name', 'offset'];

    protected $hidden = ['created_at', 'updated_at'];
}
