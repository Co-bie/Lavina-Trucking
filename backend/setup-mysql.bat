@echo off
echo ========================================
echo   MySQL Database Setup for Laravel
echo ========================================
echo.

echo Step 1: Clearing config cache...
php artisan config:clear

echo Step 2: Running migrations...
php artisan migrate:fresh

echo Step 3: Creating test user...
php artisan tinker --execute="User::create(['name'=>'Test User','first_name'=>'Test','last_name'=>'User','email'=>'test@example.com','password'=>bcrypt('password123'),'user_type'=>'client']);"

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo Database: lavina_trucking
echo Test User: test@example.com / password123
echo phpMyAdmin: http://127.0.0.1:8000/phpMyAdmin-5.2.2-all-languages/
echo ========================================
pause
