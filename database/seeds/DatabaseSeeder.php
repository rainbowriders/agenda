<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // DB::table('users')->insert([
        //     'first_name' => 'Biser',
        //     'last_name' => 'Yordanov',
        //     'email' => 'biser@rainbowriders.dk',
        //     'password' => Hash::make('123456'),
        //     'confirmed' => 1
        // ]);

        // DB::table('users')->insert([
        //     'unsavedID' => str_random(12) . time() . str_random(12),
        //     'email' => 'adssdafasfsfasfs'
        // ]);
        // DB::table('users')->insert([
        //     'first_name' => 'As',
        //     'last_name' => 'Assov',
        //     'email' => 'test@test.com',
        //     'password' => Hash::make('123456'),
        //     'confirmed' => 1
        // ]);

        // DB::table('meetings')->insert([
        //     'uniqueStringID' => '96InwTlpwHaZ1442224saddaswafsa922xYZ5401tEl0G',
        //     'ownerID' => 3,
        //     'title' => 'test',
        //     'minute_taker_last_name' => 'As',
        //     'minute_taker_last_name' => 'Assov',
        //     'minute_taker_email' => 'test@test.com',
        //     'date' => 'Monday, September 13, 2015 2:33 am',
        //     'place' => 'Sofia',
        //     'filed' => 1,
        //     'about' => 'Some text'
        // ]);

        // DB::table('meetings')->insert([
        //     'uniqueStringID' => 'InwTlpwHaZ14422asafas24922xYZ5401tEl0G',
        //     'ownerID' => 3,
        //     'title' => 'test',
        //     'minute_taker_last_name' => 'As',
        //     'minute_taker_last_name' => 'Assov',
        //     'minute_taker_email' => 'test@test.com',
        //     'date' => 'Monday, September 13, 2015 2:33 am',
        //     'place' => 'Sofia',
        //     'filed' => 1,
        //     'about' => 'Some text'
        // ]);

        // DB::table('meetings')->insert([
        //     'uniqueStringID' => '78asf9afs789sfa7897fsa',
        //     'ownerID' => 3,
        //     'title' => 'test',
        //     'minute_taker_last_name' => 'As',
        //     'minute_taker_last_name' => 'Assov',
        //     'minute_taker_email' => 'test@test.com',
        //     'date' => 'Monday, September 13, 2015 2:33 am',
        //     'place' => 'Sofia',
        //     'filed' => 1,
        //     'about' => 'Some text'
        // ]);

        // DB::table('meetings')->insert([
        //     'uniqueStringID' => '89fsafas89saf8f9asfsafsafsa',
        //     'ownerID' => 2,
        //     'title' => 'test',
        //     'date' => 'Monday, September 13, 2015 2:33 am',
        //     'place' => 'Sofia',
        //     'filed' => 1,
        //     'about' => 'Some text'
        // ]);

        // DB::table('meetings')->insert([
        //     'uniqueStringID' => '7687asfsfa67afs678asf67fsa67asf',
        //     'ownerID' => 2,
        //     'title' => 'test',
        //     'date' => 'Monday, September 13, 2015 2:33 am',
        //     'place' => 'Sofia',
        //     'filed' => 1,
        //     'about' => 'Some text'
        // ]);

        DB::table('types')->insert([
            'title' => 'To Do'
        ]);
        DB::table('types')->insert([
            'title' => 'Idea'
        ]);
        DB::table('types')->insert([
            'title' => 'Decision'
        ]);
        DB::table('types')->insert([
            'title' => 'Info'
        ]);
        DB::table('types')->insert([
            'title' => 'Done'
        ]);
        DB::table('types')->insert([
            'title' => 'Agenda'
        ]);

        // DB::table('meeting_attendants')->insert([
        //     'meetingID' => '96InwTlpwHaZ1442224saddaswafsa922xYZ5401tEl0G',
        //     'first_name' => 'pesho',
        //     'last_name' => 'petrov',
        //     'email' => 'pesho@abv.bg',
        //     'field' => 1
        // ]);
        
        // DB::table('meeting_attendants')->insert([
        //     'meetingID' => '96InwTlpwHaZ1442224saddaswafsa922xYZ5401tEl0G',
        //     'first_name' => 'pesho1',
        //     'last_name' => 'petrov',
        //     'email' => 'pesho@abv.bg',
        //     'field' => 1
        // ]);

        // DB::table('meeting_attendants')->insert([
        //     'meetingID' => '96InwTlpwHaZ1442224saddaswafsa922xYZ5401tEl0G',
        //     'first_name' => 'pesho2',
        //     'last_name' => 'petrov',
        //     'email' => 'pesho@abv.bg',
        //     'field' => 1
        // ]);

        // DB::table('meeting_attendants')->insert([
        //     'meetingID' => '89fsafas89saf8f9asfsafsafsa',
        //     'first_name' => 'pesho1',
        //     'last_name' => 'petrov',
        //     'email' => 'pesho@abv.bg',
        //     'field' => 1
        // ]);

        // DB::table('meeting_attendants')->insert([
        //     'meetingID' => '89fsafas89saf8f9asfsafsafsa',
        //     'first_name' => 'pesho2',
        //     'last_name' => 'petrov',
        //     'email' => 'pesho@abv.bg',
        //     'field' => 1
        // ]);

        // DB::table('notes')->insert([
        //     'meetingID' => '89fsafas89saf8f9asfsafsafsa',
        //     'topic' => '1.1',
        //     'body' => 'Some text',
        //     'due' => '2015-08-19',
        //     'ownerID' => 2,
        //     'typeID' => 2
        // ]);
        // DB::table('notes')->insert([
        //     'meetingID' => '96InwTlpwHaZ1442224saddaswafsa922xYZ5401tEl0G',
        //     'topic' => '1.1',
        //     'body' => 'Some text',
        //     'due' => '2015-08-19',
        //     'ownerID' => 3,
        //     'typeID' => 1
        // ]);
        // DB::table('notes')->insert([
        //     'meetingID' => '96InwTlpwHaZ1442224saddaswafsa922xYZ5401tEl0G',
        //     'topic' => '1.1',
        //     'body' => 'Some text',
        //     'due' => '2015-08-19',
        //     'ownerID' => 3,
        //     'typeID' => 4
        // ]);
        // DB::table('notes')->insert([
        //     'meetingID' => '89fsafas89saf8f9asfsafsafsa',
        //     'topic' => '1.1',
        //     'body' => 'Some text',
        //     'due' => '2015-08-19',
        //     'ownerID' => 2,
        //     'typeID' => 2
        // ]);
        // DB::table('notes')->insert([
        //     'meetingID' => '96InwTlpwHaZ1442224saddaswafsa922xYZ5401tEl0G',
        //     'topic' => '1.1',
        //     'body' => 'Some text',
        //     'due' => '2015-08-19',
        //     'ownerID' => 3,
        //     'typeID' => 3
        // ]);
        // DB::table('notes')->insert([
        //     'meetingID' => '89fsafas89saf8f9asfsafsafsa',
        //     'topic' => '1.1',
        //     'body' => 'Some text',
        //     'due' => '2015-08-19',
        //     'ownerID' => 2,
        //     'typeID' => 1
        // ]);
    }
}
