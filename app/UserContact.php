<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserContact extends Model
{
    protected $table = 'user_contact';

    protected $fillable = ['first_name', 'last_name', 'email', 'userID'];

    protected $hidden = ['created_at', 'updated_at'];

    public function user()
    {
    	$this->belongsTo('App\User', 'userID');
    }
}
