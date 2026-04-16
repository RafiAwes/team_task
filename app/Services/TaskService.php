<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskActivity;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class TaskService
{
    public function getAllTasks()
    {
        return Task::with(['assignee', 'creator', 'comments.user'])->latest()->get();
    }

    public function createTask(array $data): Task
    {
        return DB::transaction(function () use ($data) {
            $task = Task::create($data);
            
            $user = User::find($data['creator_id']) ?? User::first();
            if ($user) {
                $user->notify(new TaskActivity($user, $task->title, 'created'));
            }

            return $task;
        });
    }

    public function updateTask(Task $task, array $data): Task
    {
        return DB::transaction(function () use ($task, $data) {
            $filteredData = array_filter($data, function ($value) {
                return $value !== null && $value !== '';
            });

            $task->update($filteredData);
            
            $user = User::first(); 
            if ($user) {
                $user->notify(new TaskActivity($user, $task->title, 'updated'));
            }

            return $task->fresh(['assignee', 'creator', 'comments.user']);
        });
    }

    public function deleteTask(Task $task): bool
    {
        $user = User::first(); 
        if ($user) {
            $user->notify(new TaskActivity($user, $task->title, 'deleted'));
        }

        return $task->delete();
    }
}
