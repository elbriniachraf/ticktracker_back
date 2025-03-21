<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoryTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('category', function (Blueprint $table) {
            $table->id(); // ID unique pour chaque catégorie
            $table->string('name'); // Le nom de la catégorie
            $table->text('description')->nullable(); // La description de la catégorie (nullable si vous ne voulez pas qu'elle soit obligatoire)
            $table->string('slug')->unique(); // Slug unique pour la catégorie
            $table->string('status')->default('active'); // Statut de la catégorie, par défaut "active"
            $table->timestamps(); // Les champs created_at et updated_at sont générés automatiquement
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category');
    }
}
