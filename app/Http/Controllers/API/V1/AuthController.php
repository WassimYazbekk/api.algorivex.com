<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\LoginRequest;
use App\Http\Requests\API\V1\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * @return Response
     */
    public function login(LoginRequest $request): Response{
        $credentials = $request->validated();

        /** @var \App\Models\User $user */
        if(!Auth::attempt($credentials)){
            return response([
                'error'=>'Wrong password or email address.'
            ],422);
        }
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user'=>$user,
            'token'=>$token
        ]);
    }

    /**
     * @return Response
     */
    public function register(RegisterRequest $request): Response{
        $data = $request->validated();

        /** @var \App\Models\User $user */
        $user = User::create([
            'name'=>$data['name'],
            'email'=>$data['email'],
            'password'=>bcrypt($data['password'])
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user'=>$user,
            'token'=>$token
        ]);

    }

    /**
     * @return JsonResponse
     */
    public function show(Request $request): JsonResponse{
        $user = $request->user();

        return response()->json($user);

    }

    /**
     * @return Response
     */
    public function logout(Request $request): Response{
        $user = $request->user();

        $user->currentAccessToken()->delete();

        return response('', 204);

    }
}
