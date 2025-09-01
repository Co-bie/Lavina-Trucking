# Use PHP 8.2 with Apache
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    mariadb-client \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy existing application directory contents
COPY . /var/www/html

# Copy existing application directory permissions
COPY --chown=www-data:www-data . /var/www/html

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Configure Apache to serve Laravel
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Create entrypoint script
RUN echo '#!/bin/bash\n\
echo "🚀 Starting Laravel application..."\n\
\n\
# Create .env file from docker environment if not exists\n\
if [ ! -f .env ]; then\n\
    echo "Creating .env file..."\n\
    if [ -f .env.docker ]; then\n\
        cp .env.docker .env\n\
    else\n\
        cp .env.example .env\n\
    fi\n\
fi\n\
\n\
# Generate key if not set\n\
if ! grep -q "APP_KEY=base64:" .env; then\n\
    echo "Generating application key..."\n\
    php artisan key:generate --force\n\
fi\n\
\n\
# Wait a moment for database to be ready\n\
echo "Waiting 10 seconds for database..."\n\
sleep 10\n\
\n\
# Try to run migrations (non-blocking)\n\
echo "Running migrations..."\n\
php artisan migrate --force || echo "Migrations failed or already run"\n\
\n\
# Cache configuration for production\n\
php artisan config:cache || echo "Config cache failed"\n\
\n\
# Start Apache\n\
echo "🚀 Starting Apache server on port 80..."\n\
apache2-foreground' > /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
