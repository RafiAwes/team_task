<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Resources\TaskResource;
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
        // For now, since auth is removed, we treat the first user as the creator
        $creator = User::first();
        
        $data = $request->validated();
        $data['creator_id'] = $creator->id;

        $task = $this->taskService->createTask($data);

        return redirect()->back()->with('success', 'Task created successfully.');
    }

    public function myTasks()
    {
        // Mock current user as the first user
        $user = User::first();
        $tasks = $this->taskService->getAllTasks()->where('assignee_id', $user->id);

        return Inertia::render('my-tasks', [
            'tasks' => TaskResource::collection($tasks),
        ]);
    }

    public function notifications()
    {
        return Inertia::render('notifications', [
            'notifications' => [
                ['id' => 1, 'type' => 'comment', 'user' => 'Sarah Chen', 'task' => 'Design System Implementation', 'time' => '2 hours ago'],
                ['id' => 2, 'type' => 'status', 'user' => 'Jordan Lee', 'task' => 'Kanban Drag & Drop', 'time' => '5 hours ago'],
            ],
        ]);
    }

    public function settings()
    {
        return Inertia::render('settings');
    }
}
