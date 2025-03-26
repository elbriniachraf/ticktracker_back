<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('tva_rates', function (Blueprint $table) {
            $table->id();
            $table->string('country_code', 3)->default('FR');
            $table->string('label')->nullable();
            $table->decimal('rate', 5, 2);
            $table->string('category')->default('STANDARD');
            $table->boolean('is_active')->default(true);
            $table->date('valid_from')->nullable();
            $table->date('valid_to')->nullable();
            $table->timestamps();

        });
    }

    public function down()
    {
        Schema::dropIfExists('tva_rates');
    }
};
