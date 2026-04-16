#!/bin/sh

# Exit on error
set -e

echo "Running migrations..."
php artisan migrate --force

echo "Starting web server..."
# serversideup uses s6-overlay, but we can call the base entrypoint
exec /usr/local/bin/docker-php-serversideup-entrypoint
