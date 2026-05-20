<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use App\Models\User;
use Illuminate\Http\Request;

class IncidentController extends Controller
{
    private function protectAnonymous($incidents)
    {
        return $incidents->through(function (Incident $incident) {
            if ($incident->anonymous) {
                $incident->setRelation('user', null);
            }

            return $incident;
        });
    }

    public function index(Request $request)
    {
        $query = Incident::with(['user:id,name', 'comments.user:id,name'])->latest();

        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';

            $query->where(function ($query) use ($search) {
                $query->where('title', 'ilike', $search)
                    ->orWhere('location', 'ilike', $search)
                    ->orWhere('category', 'ilike', $search);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($this->protectAnonymous($query->paginate(10)));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:150',
            'description' => 'required|string',
            'category' => 'required|string|max:80',
            'severity' => 'required|in:Low,Medium,High',
            'location' => 'required|string|max:150',
            'image' => 'nullable|image|max:2048',
            'anonymous' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('incidents', 'public');
        }

        $incident = $request->user()->incidents()->create($data + ['status' => 'Reported']);

        User::where('role', 'admin')->each(function (User $admin) use ($incident) {
            $admin->notifications()->create([
                'title' => 'New incident report',
                'message' => "{$incident->title} was reported at {$incident->location}.",
                'action_url' => '/app/admin',
            ]);
        });

        return response()->json(['message' => 'Incident reported', 'incident' => $incident], 201);
    }

    public function show(Incident $incident)
    {
        $incident->load(['user:id,name', 'comments.user:id,name']);

        if ($incident->anonymous) {
            $incident->setRelation('user', null);
        }

        return response()->json($incident);
    }

    public function update(Request $request, Incident $incident)
    {
        abort_if($incident->user_id !== $request->user()->id && $request->user()->role !== 'admin', 403);

        $data = $request->validate([
            'title' => 'sometimes|string|max:150',
            'description' => 'sometimes|string',
            'category' => 'sometimes|string|max:80',
            'severity' => 'sometimes|in:Low,Medium,High',
            'location' => 'sometimes|string|max:150',
            'anonymous' => 'sometimes|boolean',
        ]);

        $incident->update($data);
        return response()->json(['message' => 'Incident updated', 'incident' => $incident]);
    }

    public function destroy(Request $request, Incident $incident)
    {
        abort_if($incident->user_id !== $request->user()->id && $request->user()->role !== 'admin', 403);
        $incident->delete();
        return response()->json(['message' => 'Incident deleted']);
    }

    public function mine(Request $request)
    {
        return response()->json($request->user()->incidents()->with('comments.user:id,name')->latest()->get());
    }
}
