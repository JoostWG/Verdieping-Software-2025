<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

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
}
