<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class TagController extends Controller
{
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
}
