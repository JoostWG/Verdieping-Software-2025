<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;

    protected $fillable = ['project_id', 'nr', 'title', 'description'];

    protected static function booted(): void
    {
        static::creating(function (Task $task) {
            $task->nr =
                Task::where('project_id', $task->project_id)->max('nr') + 1;
        });
    }

    /**
     * The project this task belongs to
     *
     * @return BelongsTo<Project, Task>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * The tags that are assigned to this task
     *
     * @return BelongsToMany<Tag, Task>
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }
}
