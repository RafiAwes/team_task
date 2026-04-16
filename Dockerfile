# Stage 1: Build Frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build Backend
FROM php:8.3-fpm-alpine AS build-backend
WORKDIR /app
COPY composer*.json ./
RUN apk add --no-cache git unzip libzip-dev \
    && docker-php-ext-install zip
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
COPY . .
RUN composer install --no-dev --optimize-autoloader

# Final Stage: Production Environment
FROM serversideup/php:8.3-fpm-nginx AS final
WORKDIR /var/www/html

# Environment variables for production
ENV PHP_OPCACHE_ENABLE=1
ENV AUTORUN_ENABLED=false

# Copy PHP backend
COPY --from=build-backend --chown=www-data:www-data /app .

# Copy Frontend assets
COPY --from=build-frontend --chown=www-data:www-data /app/public/build ./public/build

# Ensure storage and cache are writable
RUN chmod -R 775 storage bootstrap/cache

# Expose the default PORT used by Render
EXPOSE 8080

# Use our custom entrypoint
COPY scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
