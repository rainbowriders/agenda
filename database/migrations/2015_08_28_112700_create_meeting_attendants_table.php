<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMeetingAttendantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('meeting_attendants', function(Blueprint $table)
        {
            $table->increments('id');
            $table->string('meetingID');
            $table->string('meeting_attendant');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->integer('field');
            $table->boolean('invited')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('meeting_attendants');
    }
}
