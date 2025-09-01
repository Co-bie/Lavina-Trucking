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
# Wait for database with better error handling\n\
echo "Waiting for database connection..."\n\
max_attempts=30\n\
attempt=0\n\
\n\
while [ $attempt -lt $max_attempts ]; do\n\
    if mysql -h database -u lavina_user -p"lavina_password" -e "SELECT 1" >/dev/null 2>&1; then\n\
        echo "✅ Database connection successful!"\n\
        break\n\
    fi\n\
    attempt=$((attempt + 1))\n\
    echo "Database not ready (attempt $attempt/$max_attempts), waiting 3 seconds..."\n\
    sleep 3\n\
done\n\
\n\
if [ $attempt -eq $max_attempts ]; then\n\
    echo "❌ Database connection failed after $max_attempts attempts"\n\
    exit 1\n\
fi\n\
\n\
# Create .env file from docker environment\n\
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
    php artisan key:generate\n\
fi\n\
\n\
# Run migrations\n\
echo "Running migrations..."\n\
php artisan migrate --force\n\
\n\
# Seed database if needed\n\
echo "Seeding database..."\n\
php artisan db:seed --force || echo "Seeding skipped or failed"\n\
\n\
# Cache configuration\n\
php artisan config:cache\n\
php artisan route:cache\n\
\n\
# Start Apache\n\
echo "🚀 Starting Apache server..."\n\
apache2-foreground' > /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
