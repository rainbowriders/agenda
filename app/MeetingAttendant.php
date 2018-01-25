<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Meeting;
use App\UserContact;

class MeetingAttendant extends Model
{
    protected $table = 'meeting_attendants';

    protected $fillable = ['meetingID', 'meeting_attendant', 'first_name', 'last_name', 'email', 'field', 'invited'];
    
    protected $hidden = ['created_at', 'updated_at'];

    public function meeting()
    {
    	$this->belongsTo('App\Meeting', 'meetingID');
    }
}
