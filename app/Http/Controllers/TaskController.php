<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TaskController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id' => ['required', 'integer'],
            'title' => ['required', 'max:255'],
            'description' => ['required', 'max:4294967295'],
        ]);

        $project = $request->user()->projects()->findOrFail($data['project_id']);

        $task = $project->tasks()->create($data);

        return $task;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        Gate::authorize('update', [$task]);

        $data = $request->validate([
            'title' => ['required', 'max:255'],
            'description' => ['required', 'max:4294967295'],
        ]);

        $task->update($data);

        return $task;
    }
}
