<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', [Project::class]);

        return Inertia::render('projects/index', [
            'projects' => Auth::user()->projects,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', [Project::class]);

        $data = $request->validate([
            'name' => ['required', 'max:255', Rule::unique('projects', 'name')->where('user_id', Auth::id())],
        ], [
            'unique' => 'Je hebt al een project met die naam.',
        ]);

        $project = Auth::user()
            ->projects()
            ->create($data);

        $project->refresh();

        return $project;
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        Gate::authorize('view', [$project]);

        return Inertia::render('projects/show', compact('project'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        Gate::authorize('update', [$project]);

        $data = $request->validate([
            'name' => [
                'required',
                'max:255',
                Rule::unique('projects', 'name')
                    ->where('user_id', Auth::id())
                    ->whereNot('id', $project->id),
            ],
        ], [
            'unique' => 'Je hebt al een project met die naam.',
        ]);

        $project->update($data);

        return $project;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}
