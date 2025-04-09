#!/bin/bash

# Create necessary directories
mkdir -p docker/php docker/nginx/conf.d docker/node backend frontend

# Create Laravel project for backend
docker run --rm -v $(pwd)/backend:/app composer create-project laravel/laravel .

# Set proper permissions for Laravel
chmod -R 777 backend/storage backend/bootstrap/cache

# Create .env file for Laravel
cp backend/.env.example backend/.env

# Update Laravel .env file with PostgreSQL configuration
sed -i 's/DB_CONNECTION=mysql/DB_CONNECTION=pgsql/' backend/.env
sed -i 's/DB_HOST=127.0.0.1/DB_HOST=db/' backend/.env
sed -i 's/DB_PORT=3306/DB_PORT=5432/' backend/.env
sed -i 's/DB_DATABASE=laravel/DB_DATABASE=formbuilder/' backend/.env
sed -i 's/DB_USERNAME=root/DB_USERNAME=formbuilder/' backend/.env
sed -i 's/DB_PASSWORD=/DB_PASSWORD=formbuilder_secret/' backend/.env

# Create React frontend using Vite
docker run --rm -v $(pwd)/frontend:/app node:18-alpine sh -c "npm create vite@latest . -- --template react-ts && chown -R 1000:1000 /app"

# Build and start Docker containers
docker-compose up -d --build

# Install Laravel dependencies and setup backend
docker-compose exec backend composer install
docker-compose exec backend php artisan key:generate
docker-compose exec backend composer require laravel/sanctum
docker-compose exec backend php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
docker-compose exec backend php artisan migrate

# Install frontend dependencies
docker-compose exec frontend npm install
docker-compose exec frontend npm install @headlessui/react @heroicons/react axios @tailwindcss/forms

# Initialize Tailwind CSS
docker-compose exec frontend npm install -D tailwindcss postcss autoprefixer
docker-compose exec frontend npx tailwindcss init -p

echo "Setup completed!"
echo "Backend API is running at http://localhost:8000"
echo "Frontend is running at http://localhost:3000" 