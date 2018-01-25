<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Meeting;
use App\Note;

class MeetingAgenda extends Model
{
    protected $table = 'meeting_agenda';

    protected $fillable = ['meetingID', 'number', 'text', 'duration', 'start_time', 'end_time', 'created_at', 'updated_at'];
    

    public function note()
    {
    	return $this->hasMany('App\Note', 'agendaID');
    }
}
