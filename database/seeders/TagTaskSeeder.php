<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TagTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (Task::with('project.tags')->get() as $task) {
            $tags = $task->project->tags;
            $task
                ->tags()
                ->sync($tags->random(random_int(1, $tags->count() - 1)));
        }
    }
}
