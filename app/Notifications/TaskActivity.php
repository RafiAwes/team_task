<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TaskActivity extends Notification
{
    use Queueable;

    private $user;
    private $taskTitle;
    private $actionType;

    /**
     * Create a new notification instance.
     */
    public function __construct($user, $taskTitle, $actionType)
    {
        $this->user = $user;
        $this->taskTitle = $taskTitle;
        $this->actionType = $actionType;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'user' => $this->user->name,
            'task' => $this->taskTitle,
            'type' => $this->actionType,
        ];
    }
}
