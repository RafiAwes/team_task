<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Models\User;
use App\Services\TaskService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    protected $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function dashboard()
    {
        $tasks = $this->taskService->getAllTasks();
        $users = User::all(['id', 'name', 'avatar_url']);

        return Inertia::render('dashboard', [
            'tasks' => TaskResource::collection($tasks),
            'users' => $users->map(fn($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'avatar' => $u->name[0],
                'avatar_url' => $u->avatar_url,
            ]),
        ]);
    }

    public function store(StoreTaskRequest $request)
    {
        $creator = User::first();
        
        if (!$creator) {
            return redirect()->back()->with('error', 'No users found in database. Please seed the database.');
        }

        $data = $request->validated();
        $data['creator_id'] = $creator->id;

        $task = $this->taskService->createTask($data);

        return redirect()->back()->with('success', 'Task created successfully.');
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $this->taskService->updateTask($task, $request->validated());

        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $this->taskService->deleteTask($task);

        return redirect()->back()->with('success', 'Task deleted successfully.');
    }

    public function myTasks()
    {
        $user = User::first();
        
        if (!$user) {
            return Inertia::render('my-tasks', [
                'tasks' => ['data' => []],
                'users' => [],
            ]);
        }

        $tasks = $this->taskService->getAllTasks()->where('assignee_id', $user->id);
        $users = User::all(['id', 'name', 'avatar_url']);

        return Inertia::render('my-tasks', [
            'tasks' => TaskResource::collection($tasks),
            'users' => $users->map(fn($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'avatar' => $u->name[0],
                'avatar_url' => $u->avatar_url,
            ]),
        ]);
    }

    public function notifications()
    {
        $notifications = \Illuminate\Support\Facades\DB::table('notifications')
            ->latest()
            ->limit(20)
            ->get()
            ->map(function ($n) {
                $data = json_decode($n->data, true);
                return [
                    'id' => $n->id,
                    'type' => $data['type'] ?? 'update',
                    'user' => $data['user'] ?? 'System',
                    'task' => $data['task'] ?? 'Task',
                    'time' => \Carbon\Carbon::parse($n->created_at)->diffForHumans(),
                ];
            });

        return Inertia::render('notifications', [
            'notifications' => $notifications,
        ]);
    }

    public function settings()
    {
        return Inertia::render('settings');
    }
}
