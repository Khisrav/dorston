# Stage 1: Build assets
FROM php:8.4-cli AS builder

# Install Node.js and build tools
# PHP is already available in this image, needed because Vite plugins may call artisan commands during build
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    gnupg \
    unzip \
    git \
    libzip-dev \
    libxml2-dev \
    libicu-dev \
    libonig-dev \
    libpq-dev \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update && apt-get install -y --no-install-recommends \
    nodejs \
    && docker-php-ext-install -j$(nproc) \
    zip \
    intl \
    pdo_mysql \
    pdo_pgsql \
    mbstring \
    xml \
    bcmath \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www

# Copy Laravel application code
COPY . /var/www

# Set proper permissions for Laravel directories
RUN chown -R $USER:www-data storage bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

# Install Composer dependencies (needed for Vite plugins that use Laravel packages)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress --prefer-dist

# Create minimal .env file if it doesn't exist (needed for artisan commands during build)
RUN if [ ! -f .env ]; then \
    if [ -f .env.example ]; then \
        cp .env.example .env; \
    else \
        echo "APP_NAME=Laravel" > .env && \
        echo "APP_ENV=production" >> .env && \
        echo "APP_KEY=" >> .env && \
        echo "APP_DEBUG=false" >> .env && \
        echo "DB_CONNECTION=mysql" >> .env; \
    fi; \
    php artisan key:generate --force; \
    fi

# Install Node.js dependencies and build assets
RUN npm install && npm run build:ssr

# Stage 2: Nginx production image
FROM nginx:alpine

# Copy custom Nginx configuration
# -----------------------------------------------------------
# Replace the default Nginx configuration with our custom one
# that is optimized for serving a Laravel application.
# -----------------------------------------------------------
COPY ./docker/production/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy Laravel's public assets from the builder stage
# -----------------------------------------------------------
# We only need the 'public' directory from our Laravel app.
# -----------------------------------------------------------
COPY --from=builder /var/www/public /var/www/public

# Set the working directory to the public folder
WORKDIR /var/www/public

# Expose port 80 and start Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
