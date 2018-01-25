<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
use App\Note;
use App\MeetingAttendant;
use App\MeetingAgenda;

class Meeting extends Model
{
    protected $table = 'meetings';

    protected $fillable = ['uniqueStringID', 'ownerID', 'roomID', 'minute_taker', 'minute_taker_first_name', 'minute_taker_last_name',
                         'minute_taker_email', 'type_of_project', 'title', 'date', 'start_time', 'end_time', 'place', 'filed', 'about', 'started'];

    protected $hidden = ['created_at', 'updated_at'];

    public function user()
    {
    	return $this->belongsTo('App\User', 'ownerID');
    }

    public function notes()
    {
    	return $this->hasMany('App\Note', 'meetingID', 'uniqueStringID');
    }
    
    public function attendants()
    {
    	return $this->hasMany('App\MeetingAttendant', 'meetingID', 'uniqueStringID');
    }

    public function agenda()
    {
        return $this->hasMany('App\MeetingAgenda', 'meetingID', 'uniqueStringID');
    }
}
