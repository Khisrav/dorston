#!/bin/sh
set -e

# Install Composer dependencies if vendor directory doesn't exist or is empty
if [ ! -d "vendor" ] || [ -z "$(ls -A vendor)" ]; then
    echo "Vendor directory not found or empty. Running composer install..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
else
    echo "Vendor directory exists, skipping composer install."
fi

# Clear configurations to avoid caching issues in development
echo "Clearing configurations..."
php artisan config:clear || echo "Could not clear config cache"
php artisan route:clear || echo "Could not clear route cache"
php artisan view:clear || echo "Could not clear view cache"

# Run the default command (e.g., php-fpm or bash)
exec "$@"
