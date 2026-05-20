<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Incident;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Mudit',
            'email' => 'jainmudit616@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $resident = User::create([
            'name' => 'Riya Sharma',
            'email' => 'resident@safety.test',
            'password' => Hash::make('password'),
            'role' => 'resident',
        ]);

        Incident::create([
            'user_id' => $resident->id,
            'title' => 'Street light not working',
            'description' => 'The street light near Gate 2 has been off for three nights.',
            'category' => 'Infrastructure',
            'severity' => 'Medium',
            'location' => 'Gate 2, Green Park Colony',
            'anonymous' => false,
            'status' => 'In Progress',
        ]);

        Incident::create([
            'user_id' => $resident->id,
            'title' => 'Suspicious vehicle parked overnight',
            'description' => 'A grey van has been parked near Block C since yesterday evening.',
            'category' => 'Suspicious Activity',
            'severity' => 'High',
            'location' => 'Block C Parking',
            'anonymous' => true,
            'status' => 'Reported',
        ]);

        Announcement::create([
            'user_id' => $admin->id,
            'title' => 'Community patrol meeting',
            'message' => 'Residents are invited to the clubhouse at 6 PM this Friday.',
        ]);

        Notification::create([
            'user_id' => $resident->id,
            'title' => 'Report status updated',
            'message' => 'Your street light report is now In Progress.',
        ]);
    }
}
