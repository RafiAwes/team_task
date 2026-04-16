# Unified Builder Stage
FROM php:8.4-fpm AS builder
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    curl \
    gnupg \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install PHP extensions
RUN docker-php-ext-install zip pdo_mysql bcmath

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Install Node dependencies and build
RUN npm install
RUN npm run build

# Final Stage: Production Environment
FROM serversideup/php:8.4-fpm-nginx AS final
WORKDIR /var/www/html

# Switch to root to ensure we can set permissions
USER root

# Environment variables for production
ENV PHP_OPCACHE_ENABLE=1
ENV AUTORUN_ENABLED=false

# Copy built application from builder
COPY --from=builder --chown=www-data:www-data /app .

# Ensure storage and cache are writable
RUN chmod -R 775 storage bootstrap/cache

# Use our custom entrypoint
COPY scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh && \
    sed -i 's/\r$//' /usr/local/bin/entrypoint.sh

# Expose the default PORT used by Render
EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
