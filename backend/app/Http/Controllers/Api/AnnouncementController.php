<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\User;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index()
    {
        return response()->json(Announcement::with('user:id,name')->latest()->get());
    }

    public function store(Request $request)
    {
        abort_if($request->user()->role !== 'admin', 403, 'Admin only');

        $data = $request->validate([
            'title' => 'required|string|max:120',
            'message' => 'required|string',
        ]);

        $announcement = $request->user()->announcements()->create($data);

        User::where('role', 'resident')->each(function (User $user) use ($announcement) {
            $user->notifications()->create([
                'title' => 'New announcement',
                'message' => $announcement->title,
                'action_url' => '/app/feed',
            ]);
        });

        return response()->json($announcement, 201);
    }
}
