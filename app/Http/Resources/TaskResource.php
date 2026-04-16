<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'priority' => $this->priority,
            'assignee' => $this->assignee ? [
                'id' => $this->assignee->id,
                'name' => $this->assignee->name,
                'avatar' => $this->assignee->name[0], // Initials or avatar_url
                'avatar_url' => $this->assignee->avatar_url,
            ] : null,
            'creator' => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ],
            'due_date' => $this->due_date,
            'comments' => $this->comments->map(fn($c) => [
                'id' => $c->id,
                'content' => $c->content,
                'user' => $c->user->name,
                'avatar' => $c->user->name[0],
                'created_at' => $c->created_at->diffForHumans(),
            ]),
            'created_at' => $this->created_at->diffForHumans(),
            'updated_at' => $this->updated_at->diffForHumans(),
        ];
    }
}
