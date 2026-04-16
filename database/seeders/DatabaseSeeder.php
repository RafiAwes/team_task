<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Demo Admin',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'status' => 'active',
        ]);

        User::factory(10)->create();
        $users = User::all();

        // Seed Tasks for EACH user
        foreach ($users as $user) {
            // 3 Pending
            \App\Models\Task::factory(3)->pending()->create([
                'creator_id' => $admin->id,
                'assignee_id' => $user->id,
            ]);

            // 3 In Progress
            \App\Models\Task::factory(3)->inProgress()->create([
                'creator_id' => $admin->id,
                'assignee_id' => $user->id,
            ]);

            // 2 Completed
            \App\Models\Task::factory(2)->completed()->create([
                'creator_id' => $admin->id,
                'assignee_id' => $user->id,
            ]);
        }
    }
}
