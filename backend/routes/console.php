<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('about-project', function () {
    $this->info('Neighborhood Safety & Incident Reporting System API');
});
