<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Status extends Model
{
    /** @use HasFactory<\Database\Factories\StatusFactory> */
    use HasFactory;

    protected $fillable = ['name'];

    /**
     * The tasks that have this status
     *
     * @return HasMany<Task, Status>
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
