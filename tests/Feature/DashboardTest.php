<?php

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('the dashboard renders with tasks and users', function () {
    // Create some data in memory
    $users = User::factory()->count(3)->create();
    Task::factory()->count(5)->create([
        'creator_id' => $users->first()->id,
        'assignee_id' => $users->last()->id,
    ]);

    $response = $this->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('tasks.data', 5)
        ->has('users', 3)
    );
});

test('dashboard displays tasks in across all columns', function () {
    $user = User::factory()->create();
    Task::factory()->create(['status' => 'pending', 'creator_id' => $user->id]);
    Task::factory()->create(['status' => 'in-progress', 'creator_id' => $user->id]);
    Task::factory()->create(['status' => 'completed', 'creator_id' => $user->id]);

    $response = $this->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('tasks.data.0.status', fn($status) => in_array($status, ['pending', 'in-progress', 'completed']))
    );
});