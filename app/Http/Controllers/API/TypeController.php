<?php

namespace App\Http\Controllers\API;

use JWTAuth;
use Response;
use Request;
use Input;
use App\Type;
use App\Http\Controllers\Controller;




class TypeController extends Controller
{
	public function showAll()
	{

		$types = Type::all();

		if(count($types) > 0)
		{
			return Response::json(array('types' => $types), 200);
		}
		else
		{
			return Response::json(array('Server error, please try again later!'), 500);
		}
	}
}