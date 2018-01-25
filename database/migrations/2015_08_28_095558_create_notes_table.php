<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notes', function(Blueprint $table)
        {
            $table->increments('id');
            $table->string('topic');
            $table->text('body', 500);
            $table->string('due');
            $table->integer('ownerID');
            $table->string('meetingID');
            $table->integer('agendaID');
            $table->integer('typeID');
            $table->string('ownerNames');
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
        Schema::drop('notes');
    }
}
