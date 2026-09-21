<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Services\MachineLearningService;

class ExportBehaviorData extends Command
{
    protected $signature = 'ml:export-behavior';
    protected $description = 'Export user behavior data to CSV for ML training';

    public function handle()
    {
        $this->info('Starting behavior data export...');

        $users = User::all();
        
        $csvPath = base_path('../data/behavior.csv');
        $dir = dirname($csvPath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $file = fopen($csvPath, 'w');
        
        // Write header
        fputcsv($file, [
            'user_id',
            'login_attempts',
            'failed_logins',
            'session_duration',
            'pages_accessed',
            'tickets_viewed',
            'tickets_booked',
            'events_viewed',
            'events_created',
            'total_actions',
            'requests_per_minute'
        ]);

        $count = 0;
        foreach ($users as $user) {
            $features = MachineLearningService::extractFeatures($user->id);
            
            // Only export users who have some actions
            if ($features['total_actions'] > 0) {
                fputcsv($file, [
                    $user->id,
                    $features['login_attempts'],
                    $features['failed_logins'],
                    $features['session_duration'],
                    $features['pages_accessed'],
                    $features['tickets_viewed'],
                    $features['tickets_booked'],
                    $features['events_viewed'],
                    $features['events_created'],
                    $features['total_actions'],
                    $features['requests_per_minute']
                ]);
                $count++;
            }
        }

        fclose($file);

        $this->info("Successfully exported {$count} user records to {$csvPath}");
    }
}
