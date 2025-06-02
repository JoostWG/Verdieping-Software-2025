<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Response;
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
            'projects' => Auth::user()
                ->projects()
                ->orderByDesc('created_at')
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', [Project::class]);

        $data = $request->validate(
            [
                'name' => [
                    'required',
                    'max:255',
                    Rule::unique('projects', 'name')->where(
                        'user_id',
                        Auth::id()
                    ),
                ],
            ],
            [
                'unique' => 'Je hebt al een project met die naam.',
            ]
        );

        $project = Auth::user()->projects()->create($data);

        $project->refresh();

        return $project;
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Project $project)
    {
        Gate::authorize('view', [$project]);

        $statusIds = array_map(
            fn($id) => intval($id),
            $request->filled('statusIds')
                ? explode(',', $request->input('statusIds'))
                : []
        );

        // dd($statusIds);

        $allowedOrderByFields = [
            'nr' => 'Nummer',
            'title' => 'Title',
            'status_id' => 'Status',
        ];

        $orderBy = $request->filled('orderBy')
            ? $request->input('orderBy')
            : 'nr';

        $orderByDesc = $request->boolean('desc');

        if (!in_array($orderBy, array_keys($allowedOrderByFields))) {
            $orderBy = null;
        }

        $project->load([
            'tags',
            'tasks' => fn($query) => $query
                ->with(['tags', 'status'])
                ->when(
                    count($statusIds),
                    fn($query) => $query->whereIn('status_id', $statusIds)
                )
                ->when(
                    $orderBy,
                    fn($query) => $query->orderBy(
                        $orderBy,
                        $orderByDesc ? 'desc' : 'asc'
                    )
                ),
        ]);

        $statuses = Status::all();

        return Inertia::render(
            'projects/show',
            compact(
                'project',
                'statuses',
                'statusIds',
                'orderBy',
                'orderByDesc',
                'allowedOrderByFields'
            )
        );
    }

    public function tags(Project $project)
    {
        Gate::authorize('view', [$project]);

        $project->load('tags');

        return Inertia::render('projects/tags', compact('project'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        Gate::authorize('update', [$project]);

        $data = $request->validate(
            [
                'name' => [
                    'required',
                    'max:255',
                    Rule::unique('projects', 'name')
                        ->where('user_id', Auth::id())
                        ->whereNot('id', $project->id),
                ],
            ],
            [
                'unique' => 'Je hebt al een project met die naam.',
            ]
        );

        $project->update($data);

        return $project;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        Gate::authorize('delete', [$project]);

        $project->delete();

        return Response::noContent();
    }
}
