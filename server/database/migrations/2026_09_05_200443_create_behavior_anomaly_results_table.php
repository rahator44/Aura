<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBehaviorAnomalyResultsTable extends Migration
{
    public function up()
    {
        Schema::create('behavior_anomaly_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('anomaly');
            $table->decimal('anomaly_score', 10, 4);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('behavior_anomaly_results');
    }
}
