<?php

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('my tasks page shows only tasks assigned to the mock user', function () {
    // Create two users
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    
    // Create tasks assigned to user1 (the first user, our mock target)
    Task::factory()->count(3)->create([
        'assignee_id' => $user1->id,
        'creator_id' => $user2->id,
    ]);
    
    // Create a task assigned to user2 (should be hidden)
    Task::factory()->create([
        'assignee_id' => $user2->id,
        'creator_id' => $user1->id,
    ]);

    $response = $this->get(route('tasks.mine'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('my-tasks')
        ->has('tasks.data', 3) // Only the 3 assigned to user1
    );
});

test('my tasks page shows empty state when no tasks are assigned', function () {
    User::factory()->create(); // Mock user
    
    $response = $this->get(route('tasks.mine'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('tasks.data', 0)
    );
});
