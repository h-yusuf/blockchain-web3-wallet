<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

Route::post('/web3-login', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'address' => 'required|string',
        'signature' => 'required|string',
        'message' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['error' => 'Invalid data'], 422);
    }

    $address = $request->address;
    $signature = $request->signature;
    $message = $request->message;

    try {
        // Verifikasi signature
        $recoveredAddress = \kornrunner\Keccak::verifyMessage($message, $signature);

        if (strtolower($recoveredAddress) !== strtolower($address)) {
            return response()->json(['error' => 'Signature verification failed!'], 401);
        }

        // Jika lolos verifikasi, login sukses
        return response()->json(['message' => 'Login Success!', 'address' => $address]);
    } catch (\Exception $e) {
        Log::error('Web3 Login Error: '.$e->getMessage());
        return response()->json(['error' => 'Internal server error'], 500);
    }
});
