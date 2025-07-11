<?php

use App\Models\Project;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            $table
                ->foreignIdFor(Project::class)
                ->constrained()
                ->cascadeOnDelete();
            $table->unsignedSmallInteger('nr');
            $table->string('title');
            $table->text('description')->default('');

            $table->timestamps();

            $table->unique(['project_id', 'nr']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
