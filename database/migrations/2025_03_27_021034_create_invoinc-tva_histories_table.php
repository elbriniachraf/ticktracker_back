<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoinc_tva_histories', function (Blueprint $table) { 
            $table->id();
            $table->string('product')->nullable();
            $table->string('service')->nullable();
            $table->decimal('price_input', 10, 2);
            $table->decimal('tva_rate', 5, 2);
            $table->decimal('tva_amount', 10, 2);
            $table->decimal('result_price', 10, 2);
            $table->string('calculation_mode');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
