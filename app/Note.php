<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
use App\Meeting;
use App\Type;
use App\NoteOwner;

class Note extends Model
{
    protected $table = 'notes';

    protected $fillable = ['topic', 'body', 'due', 'ownerID', 'meetingID', 'agendaID', 'typeID', 'ownerNames'];

    protected $hidden = ['created_at', 'updated_at'];

    public function owner()
    {
    	return $this->hasOne('App\User', 'id', 'ownerID');
    }

    public function meeting()
    {
    	return $this->belongsTo('App\Meeting', 'meetingID');
    }

    public function type()
    {
    	return $this->hasOne('App\Type', 'id', 'typeID');
    }

}
