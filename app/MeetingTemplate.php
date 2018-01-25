<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\MeetingAttendant;
use App\MeetingAgenda;

class MeetingTemplate extends Model
{

    protected $table = 'meeting_templates';

    protected $fillable = ['uniqueStringID', 'ownerID', 'minute_taker', 'minute_taker_first_name', 'minute_taker_last_name',
        'minute_taker_email', 'title',  'place'];

    protected $hidden = ['created_at', 'updated_at'];


    public function attendants()
    {
        return $this->hasMany('App\MeetingAttendant', 'meetingID', 'uniqueStringID');
    }

    public function agenda()
    {
        return $this->hasMany('App\MeetingAgenda', 'meetingID', 'uniqueStringID');
    }
}
