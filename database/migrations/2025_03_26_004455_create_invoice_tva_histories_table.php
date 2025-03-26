<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('invoice_tva_histories', function (Blueprint $table) {
            $table->engine = 'InnoDB';  // Assurez-vous que le moteur est InnoDB
            $table->id();
            $table->unsignedBigInteger('invoice_line_id');  // Assurez-vous que c'est bien un unsignedBigInteger
            $table->unsignedBigInteger('old_tva_rate_id');
            $table->unsignedBigInteger('new_tva_rate_id');
            $table->decimal('old_tva_amount', 8, 2);
            $table->decimal('new_tva_amount', 8, 2);
            $table->timestamps();
        
            // Définir la clé étrangère
            $table->foreign('invoice_line_id')->references('id')->on('invoice_lines')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('invoice_tva_histories');
    }
};
