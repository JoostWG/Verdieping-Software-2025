<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\Rule;

class TagController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate(
            [
                'project_id' => ['required', 'integer'],
                'name' => [
                    'required',
                    'max:255',
                    Rule::unique('tags', 'name')->where(
                        'project_id',
                        $request->input('project_id')
                    ),
                ],
            ],
            [
                'unique' => 'Er bestaat al een tag met die naam.',
            ]
        );

        $project = $request
            ->user()
            ->projects()
            ->findOrFail($data['project_id']);

        $tag = $project->tags()->create($data);

        return $tag;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tag $tag)
    {
        Gate::authorize('update', [$tag]);

        $data = $request->validate(
            [
                'name' => [
                    'required',
                    'max:255',
                    Rule::unique('tags', 'name')
                        ->where('project_id', $tag->project_id)
                        ->whereNot('id', $tag->id),
                ],
            ],
            [
                'unique' => 'Er bestaat al een tag met die naam.',
            ]
        );

        $tag->update($data);

        return $tag;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag)
    {
        Gate::authorize('delete', [$tag]);

        $tag->delete();

        return Response::noContent();
    }
}
