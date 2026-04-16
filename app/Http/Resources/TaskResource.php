<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
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
            'created_at' => $this->created_at->diffForHumans(),
            'updated_at' => $this->updated_at->diffForHumans(),
        ];
    }
}
