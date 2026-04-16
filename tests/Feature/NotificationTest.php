<?php

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

test('creating a task generates a notification', function () {
    $user = User::factory()->create();
    
    $this->post(route('tasks.store'), [
        'title' => 'New Task',
        'description' => 'Test',
        'status' => 'pending',
        'priority' => 'normal',
        'assignee_id' => $user->id,
    ]);

    $this->assertDatabaseHas('notifications', [
        'type' => 'App\Notifications\TaskActivity',
    ]);
    
    $notification = DB::table('notifications')->first();
    $data = json_decode($notification->data, true);
    
    expect($data['type'])->toBe('created');
    expect($data['task'])->toBe('New Task');
});

test('updating a task status generates a notification', function () {
    $task = Task::factory()->create(['title' => 'Update Me']);

    $this->put(route('tasks.update', $task), [
        'status' => 'completed',
    ]);

    $this->assertDatabaseHas('notifications', [
        'type' => 'App\Notifications\TaskActivity',
    ]);
    
    $notification = DB::table('notifications')->latest()->first();
    $data = json_decode($notification->data, true);
    
    expect($data['type'])->toBe('updated');
    expect($data['task'])->toBe('Update Me');
});

test('deleting a task generates a notification', function () {
    $task = Task::factory()->create(['title' => 'Delete Me']);

    $this->delete(route('tasks.destroy', $task));

    $this->assertDatabaseHas('notifications', [
        'type' => 'App\Notifications\TaskActivity',
    ]);
    
    $notification = DB::table('notifications')->latest()->first();
    $data = json_decode($notification->data, true);
    
    expect($data['type'])->toBe('deleted');
    expect($data['task'])->toBe('Delete Me');
});

test('notifications page returns seeded notifications', function () {
    $user = User::factory()->create();
    $task = Task::factory()->create(['title' => 'Sample Task']);
    
    // Trigger a notification
    $this->delete(route('tasks.destroy', $task));
    
    $response = $this->get(route('notifications'));
    
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('notifications')
        ->has('notifications', 1)
        ->where('notifications.0.task', 'Sample Task')
        ->where('notifications.0.type', 'deleted')
    );
});
