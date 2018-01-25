<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMeetingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('meetings', function (Blueprint $table)
        {   
            $table->increments('id');
            $table->string('uniqueStringID')->unique();
            $table->integer('ownerID');
            $table->string('roomID');
            $table->string('minute_taker');
            $table->string('minute_taker_first_name'); 
            $table->string('minute_taker_last_name'); 
            $table->string('minute_taker_email'); 
            $table->string('type_of_project');
            $table->string('title');
            $table->string('date');
            $table->string('end_date');
            $table->string('start_time');
            $table->string('end_time');
            $table->string('place');
            $table->boolean('filed')->default(0);
            $table->string('filed_date');
            $table->text('about', 500);
            $table->boolean('started')->default(0);
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
        Schema::drop('meetings');
    }
}
