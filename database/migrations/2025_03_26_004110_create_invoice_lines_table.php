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
        Schema::create('invoice_lines', function (Blueprint $table) {
            $table->id(); // Identifiant unique pour chaque modification
            $table->unsignedBigInteger('invoice_line_id'); // Référence à la ligne de facture
            $table->unsignedBigInteger('old_tva_rate_id'); // Ancien ID du taux de TVA
            $table->unsignedBigInteger('new_tva_rate_id'); // Nouveau ID du taux de TVA
            $table->decimal('old_tva_amount', 8, 2); // Ancien montant de la TVA
            $table->decimal('new_tva_amount', 8, 2); // Nouveau montant de la TVA
            $table->timestamps(); // Horodatage pour la modification

            // Définir les clés étrangères
            $table->foreign('invoice_line_id')->references('id')->on('invoice_lines')->onDelete('cascade');
            $table->foreign('old_tva_rate_id')->references('id')->on('tva_rates')->onDelete('cascade');
            $table->foreign('new_tva_rate_id')->references('id')->on('tva_rates')->onDelete('cascade');

            $table->engine = 'InnoDB'; // Assure-toi que InnoDB est utilisé

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
