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
        // Users Table Improvements
        Schema::table('users', function (Blueprint $table) {
            // Security Enhancements
            $table->integer('login_attempts')->default(0)->after('last_login_at');
            $table->timestamp('locked_until')->nullable()->after('login_attempts');

            // Performance Indexes
            $table->index('is_active', 'idx_users_is_active');
            $table->index('deleted_at', 'idx_users_deleted_at');
            $table->index('last_login_at', 'idx_users_last_login');

            // Composite index for common auth checks (email, active, not deleted)
            $table->index(['email', 'is_active', 'deleted_at'], 'idx_users_auth_composite');
        });

        // Password Reset Tokens Improvements
        Schema::table('password_reset_tokens', function (Blueprint $table) {
            // Performance Indexes for token lookup and cleanup
            $table->index('created_at', 'idx_password_reset_created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('idx_users_auth_composite');
            $table->dropIndex('idx_users_is_active');
            $table->dropIndex('idx_users_deleted_at');
            $table->dropIndex('idx_users_last_login');

            $table->dropColumn(['login_attempts', 'locked_until']);
        });

        Schema::table('password_reset_tokens', function (Blueprint $table) {
            $table->dropIndex('idx_password_reset_created_at');
        });
    }
};
