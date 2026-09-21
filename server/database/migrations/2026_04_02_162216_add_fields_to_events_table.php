<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('events', function (Blueprint $table) {
            if (!Schema::hasColumn('events', 'chief_guest')) {
                $table->string('chief_guest')->nullable()->after('location');
            }
            if (!Schema::hasColumn('events', 'tickets_sold')) {
                $table->integer('tickets_sold')->default(0)->after('capacity');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['chief_guest', 'tickets_sold']);
        });
    }
};
