<?php

namespace App\Policies;

use App\Models\Tag;
use App\Models\Task;
use App\Models\User;

class TagPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Tag $tag): bool
    {
        return $user->can('update', $tag->project);
    }
}
