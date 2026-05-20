<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    private function adminOnly(Request $request): void
    {
        abort_if($request->user()->role !== 'admin', 403, 'Admin only');
    }

    public function stats(Request $request)
    {
        $this->adminOnly($request);

        return response()->json([
            'total_incidents' => Incident::count(),
            'total_users' => User::count(),
            'pending_reports' => Incident::where('status', 'Reported')->count(),
        ]);
    }

    public function incidents(Request $request)
    {
        $this->adminOnly($request);
        return response()->json(Incident::with('user:id,name,email')->latest()->get());
    }

    public function updateStatus(Request $request, Incident $incident)
    {
        $this->adminOnly($request);
        $data = $request->validate(['status' => 'required|in:Reported,In Progress,Resolved']);
        $incident->update($data);
        $incident->user->notifications()->create([
            'title' => 'Report status updated',
            'message' => "Your report \"{$incident->title}\" is now {$incident->status}.",
            'action_url' => '/app/my-reports',
        ]);

        return response()->json(['message' => 'Status updated', 'incident' => $incident]);
    }
}
