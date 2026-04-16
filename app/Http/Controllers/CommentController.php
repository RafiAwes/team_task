<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskActivity;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, Task $task)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $user = User::first();
        
        if (!$user) {
            return redirect()->back()->with('error', 'User not found.');
        }

        $comment = $task->comments()->create([
            'user_id' => $user->id,
            'content' => $request->input('content'),
        ]);

        $user->notify(new TaskActivity($user, $task->title, 'commented'));

        return redirect()->back()->with('success', 'Comment added.');
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();
        return redirect()->back()->with('success', 'Comment deleted.');
    }
}
