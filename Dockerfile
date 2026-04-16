# Unified Builder Stage
FROM php:8.4-fpm AS builder
WORKDIR /app

# Install system dependencies (curl is installed here!)
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    curl \
    gnupg \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# --- CRITICAL FIX: Download the cert in the builder stage ---
RUN curl -sSo /app/isrgrootx1.pem https://letsencrypt.org/certs/isrgrootx1.pem
# ------------------------------------------------------------

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

# --- CRITICAL FIX: Copy the cert from the builder stage ---
COPY --from=builder /app/isrgrootx1.pem /etc/ssl/certs/isrgrootx1.pem
RUN chmod 644 /etc/ssl/certs/isrgrootx1.pem
# ----------------------------------------------------------

# Environment variables for production
ENV PHP_OPCACHE_ENABLE=1
ENV AUTORUN_ENABLED=true

# Copy built application from builder
COPY --from=builder --chown=www-data:www-data /app .

# Ensure storage and cache are writable
RUN chmod -R 775 storage bootstrap/cache

# Expose the default PORT used by Render
EXPOSE 8080