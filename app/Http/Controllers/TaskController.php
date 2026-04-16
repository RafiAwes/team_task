<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    private function getMockTasks()
    {
        return [
            [
                'id' => '1',
                'title' => 'Design System Implementation',
                'description' => 'Implement the Elegant Dark theme tokens in Tailwind v4.',
                'status' => 'completed',
                'priority' => 'important',
                'assignee' => ['name' => 'Alex Rivera', 'avatar' => 'AR'],
                'comments' => [
                    ['id' => 'c1', 'user' => 'Sarah Chen', 'text' => 'Looks amazing! Love the neon accents.'],
                ],
            ],
            [
                'id' => '2',
                'title' => 'Kanban Drag & Drop',
                'description' => 'Setup @dnd-kit for smooth task transitions between columns.',
                'status' => 'in-progress',
                'priority' => 'urgent',
                'assignee' => ['name' => 'Jordan Lee', 'avatar' => 'JL'],
                'comments' => [],
            ],
            [
                'id' => '3',
                'title' => 'Task Edit Modal',
                'description' => 'Create a unified modal for editing task details and comments.',
                'status' => 'pending',
                'priority' => 'normal',
                'assignee' => ['name' => 'Alex Rivera', 'avatar' => 'AR'],
                'comments' => [],
            ],
            [
                'id' => '4',
                'title' => 'Search & Filter Logic',
                'description' => 'Implement real-time search across task titles and descriptions.',
                'status' => 'pending',
                'priority' => 'important',
                'assignee' => ['name' => 'Mila Kunis', 'avatar' => 'MK'],
                'comments' => [],
            ],
        ];
    }

    public function dashboard()
    {
        return Inertia::render('dashboard', [
            'tasks' => $this->getMockTasks(),
            'users' => [
                ['name' => 'Alex Rivera', 'avatar' => 'AR'],
                ['name' => 'Jordan Lee', 'avatar' => 'JL'],
                ['name' => 'Sarah Chen', 'avatar' => 'SC'],
                ['name' => 'Mila Kunis', 'avatar' => 'MK'],
            ],
        ]);
    }

    public function myTasks()
    {
        $allTasks = $this->getMockTasks();
        // Filter for Alex Rivera (acting as current user)
        $myTasks = array_values(array_filter($allTasks, fn($t) => $t['assignee']['name'] === 'Alex Rivera'));

        return Inertia::render('my-tasks', [
            'tasks' => $myTasks,
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
