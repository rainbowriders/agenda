<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMeetingTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('meeting_templates', function (Blueprint $table) {
            $table->increments('id');
            $table->string('uniqueStringID')->unique();
            $table->integer('ownerID');
            $table->string('minute_taker');
            $table->string('minute_taker_first_name');
            $table->string('minute_taker_last_name');
            $table->string('minute_taker_email');
            $table->string('title');
            $table->string('place');
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
        Schema::drop('meeting_templates');
    }
}
