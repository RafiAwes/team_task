<?php

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('a user can create a task', function () {
    $user = User::factory()->create();
    
    $response = $this->post(route('tasks.store'), [
        'title' => 'Test Task',
        'description' => 'This is a test task.',
        'status' => 'pending',
        'priority' => 'normal',
        'assignee_id' => $user->id,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('tasks', [
        'title' => 'Test Task',
        'creator_id' => $user->id, // Controller uses User::first() for now
        'assignee_id' => $user->id,
    ]);
});

test('a task title is required', function () {
    $response = $this->post(route('tasks.store'), [
        'title' => '',
    ]);

    $response->assertSessionHasErrors('title');
});

test('updating a task works correctly', function () {
    $user = User::factory()->create();
    $task = Task::factory()->create([
        'title' => 'Old Title',
        'status' => 'pending',
    ]);

    $response = $this->put(route('tasks.update', $task), [
        'title' => 'New Title',
        'status' => 'in-progress',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'title' => 'New Title',
        'status' => 'in-progress',
    ]);
});

test('empty fields in update do not overwrite existing data', function () {
    $user = User::factory()->create();
    $task = Task::factory()->create([
        'title' => 'Original Title',
        'description' => 'Important description',
        'status' => 'pending',
    ]);

    // Send an update with empty/null values for title and description
    $response = $this->put(route('tasks.update', $task), [
        'title' => '',
        'description' => null,
        'status' => 'completed',
    ]);

    $response->assertRedirect();
    
    // Refresh and check that title and description are preserved
    $task->refresh();
    
    expect($task->title)->toBe('Original Title');
    expect($task->description)->toBe('Important description');
    expect($task->status)->toBe('completed');
});

test('drag and drop status update works', function () {
    $task = Task::factory()->create(['status' => 'pending']);

    $response = $this->put(route('tasks.update', $task), [
        'status' => 'completed',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'status' => 'completed',
    ]);
});

test('a task can be deleted', function () {
    $task = Task::factory()->create();

    $response = $this->delete(route('tasks.destroy', $task));

    $response->assertRedirect();
    $this->assertDatabaseMissing('tasks', [
        'id' => $task->id,
    ]);
});
