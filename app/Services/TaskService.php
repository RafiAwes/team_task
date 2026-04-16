<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskActivity;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class TaskService
{
    /**
     * Get all tasks with their relationships.
     */
    public function getAllTasks()
    {
        return Task::with(['assignee', 'creator'])->latest()->get();
    }

    /**
     * Create a new task.
     */
    public function createTask(array $data): Task
    {
        return DB::transaction(function () use ($data) {
            $task = Task::create($data);
            
            // Notify system of creation
            $user = User::find($data['creator_id']) ?? User::first();
            if ($user) {
                $user->notify(new TaskActivity($user, $task->title, 'created'));
            }

            return $task;
        });
    }

    /**
     * Update an existing task.
     */
    public function updateTask(Task $task, array $data): Task
    {
        return DB::transaction(function () use ($task, $data) {
            // Remove null or empty string values as per user request to "keep previous data"
            $filteredData = array_filter($data, function ($value) {
                return $value !== null && $value !== '';
            });

            $task->update($filteredData);
            
            // Notify system of update
            $user = User::first(); // Mock actor
            if ($user) {
                $user->notify(new TaskActivity($user, $task->title, 'updated'));
            }

            return $task->fresh(['assignee', 'creator']);
        });
    }

    /**
     * Delete a task.
     */
    public function deleteTask(Task $task): bool
    {
        // Notify system before deletion
        $user = User::first(); // Mock actor
        if ($user) {
            $user->notify(new TaskActivity($user, $task->title, 'deleted'));
        }

        return $task->delete();
    }
}
