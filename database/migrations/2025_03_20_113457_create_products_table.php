<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->string('label');
            $table->decimal('price', 10, 2);
            $table->decimal('selling_price', 10, 2);
            $table->boolean('is_selling')->default(false);
            $table->boolean('is_purchasing')->default(false);
            $table->text('description')->nullable();
            $table->string('public_url')->nullable();
            $table->string('product_type', 100)->nullable();
            $table->decimal('weight', 10, 2)->nullable();
            $table->json('dimensions')->nullable(); // Stocke un tableau JSON
            $table->decimal('length', 10, 2)->nullable();
            $table->decimal('width', 10, 2)->nullable();
            $table->decimal('height', 10, 2)->nullable();
            $table->decimal('surface', 10, 2)->nullable();
            $table->decimal('volume', 10, 2)->nullable();
            $table->string('customs_code', 20)->nullable();
            $table->string('country_of_origin', 100)->nullable();
            $table->string('state_of_origin', 100)->nullable();
            $table->text('note')->nullable();
            $table->string('category')->nullable();
            $table->json('tags')->nullable(); // Stocke un tableau JSON
            $table->decimal('min_selling_price', 10, 2)->nullable();
            $table->decimal('tax_rate', 5, 2)->nullable()->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};
