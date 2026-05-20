<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Incident $incident)
    {
        $data = $request->validate(['message' => 'required|string|max:500']);
        $comment = $incident->comments()->create($data + ['user_id' => $request->user()->id]);

        if ($incident->user_id !== $request->user()->id) {
            $incident->user->notifications()->create([
                'title' => 'New comment on your report',
                'message' => "{$request->user()->name} commented on \"{$incident->title}\".",
                'action_url' => '/app/feed',
            ]);
        }

        return response()->json($comment->load('user:id,name'), 201);
    }
}
