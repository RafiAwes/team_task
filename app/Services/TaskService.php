<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Support\Facades\DB;

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
            return Task::create($data);
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
            return $task->fresh(['assignee', 'creator']);
        });
    }

    /**
     * Delete a task.
     */
    public function deleteTask(Task $task): bool
    {
        return $task->delete();
    }
}
