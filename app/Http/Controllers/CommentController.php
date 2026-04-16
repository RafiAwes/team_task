<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskActivity;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Store a newly created comment in storage.
     */
    public function store(Request $request, Task $task)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        // Mock current user
        $user = User::first();
        
        if (!$user) {
            return redirect()->back()->with('error', 'User not found.');
        }

        $comment = $task->comments()->create([
            'user_id' => $user->id,
            'content' => $request->input('content'),
        ]);

        // Notify system of the comment
        $user->notify(new TaskActivity($user, $task->title, 'commented'));

        return redirect()->back()->with('success', 'Comment added.');
    }

    /**
     * Remove the specified comment from storage.
     */
    public function destroy(Comment $comment)
    {
        $comment->delete();
        return redirect()->back()->with('success', 'Comment deleted.');
    }
}
