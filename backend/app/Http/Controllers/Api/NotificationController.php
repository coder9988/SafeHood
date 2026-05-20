<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->notifications()->latest()->get());
    }

    public function markRead(Request $request, \App\Models\Notification $notification)
    {
        abort_if($notification->user_id !== $request->user()->id, 403);

        $notification->update(['read' => true]);

        return response()->json(['message' => 'Notification marked as read', 'notification' => $notification]);
    }
}
