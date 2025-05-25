<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user, Project $project): bool
    {
        return $user->can('view', $project);
    }
}
