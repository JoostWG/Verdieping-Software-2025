<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
    ];

    public function getRouteKeyName(): string
    {
        return 'name'; // TODO: Get this to work. Perhaps a slug like I did in my F1 app would be good
    }

    /**
     * The user that owns this project
     *
     * @return BelongsTo<User, Project>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The tasks that belong to this project
     *
     * @return HasMany<Task, Project>
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
