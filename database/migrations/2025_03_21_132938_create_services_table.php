<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServicesTable extends Migration
{
    /**
     * Exécuter la migration.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id(); // Cela va créer un champ `id` auto-incrémenté
            $table->text('_id')->nullable();
            $table->text('name')->nullable();
            $table->text('description')->nullable();
            $table->text('price')->nullable();
            $table->text('private')->nullable();
            $table->text('duration')->nullable();
            $table->text('category_id')->nullable();
            $table->text('status')->nullable();
            $table->text('start_date')->nullable();
            $table->text('end_date')->nullable();
            $table->text('service_provider')->nullable();
            $table->text('location')->nullable();
            $table->text('rating')->nullable();
            $table->text('features')->nullable();
            $table->text('image_url')->nullable();
            $table->text('is_featured')->nullable();
            $table->text('tags')->nullable();
            $table->timestamps(); // Crée `created_at` et `updated_at`

            // Si vous avez besoin de contraintes supplémentaires, vous pouvez les ajouter ici
            // Par exemple, pour une clé étrangère sur `category_id`
            // $table->foreign('category_id')->references('id')->on('categories');
        });
    }

    /**
     * Revenir en arrière sur la migration.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('services');
    }
}
