# Smart Form Builder - Project Setup Guide

## Prerequisites

### Required Software
- Docker and Docker Compose
- Git
- Node.js (v20)
- PHP (v8.2)
- Composer
- PostgreSQL

### Required Accounts
- GitHub account

## Environment Setup

### 1. Clone the Repository
```gitbash
git clone git@github.com:singaravelankr/form-builder.git
cd form-builder

```
### 2. Docker Setup
1. Rebuild containers with proper cache clearing:
```bash
docker-compose down -v
docker system prune -f

docker-compose build --no-cache
docker-compose up -d

```

## Backend Setup

### 1. Install Dependencies
```bash
docker-compose exec -u root backend composer install
```

### 2. Generate Application Key
```bash
docker-compose exec backend php artisan key:generate
docker-compose exec backend php artisan migrate:fresh

docker-compose exec backend php artisan migrate
```

### 3. Set Directory Permissions (Optional)
(Optional) if you get folder permissions error - Set up Laravel permissions
```bash
docker-compose exec -u root backend chown -R www-data:www-data /var/www
docker-compose exec -u root backend chmod -R 777 /var/www/storage
docker-compose exec -u root backend chmod -R 777 /var/www/bootstrap/cache

chmod -R 777 storage bootstrap/cache

```

## Frontend Setup

### 1. Install Dependencies
```bash
# Install dependencies if needed
docker-compose exec frontend npm install

#reStart services:
docker-compose down -v
docker-compose up -d

# Start the dev server
docker-compose exec frontend npm run dev
```

### 1. Start Docker Containers
```bash
docker-compose up -d
```

### Verify Setup

```bash
docker-compose ps  #to see running containers
docker-compose logs #to see logs


All containers are up and running:
-backend: The PHP backend service is running and listening on port 9000 internally
-db: The PostgreSQL database is running and exposed on port 5432
-frontend: The frontend service is running and exposed on port 3000
-nginx: The Nginx service is running and exposed on port 8000
```
API_URL=http://localhost:8000/api
FRONTEND_URL=http://localhost:3000


## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check environment variables
   - Ensure database exists

2. **Port Conflicts**
   - Check if ports 8000 and 3000 are available
   - Update ports in docker-compose.yml if needed

3. **Docker Issues**
   - Restart Docker service
   - Clear Docker cache: `docker system prune -a`
   - Rebuild containers: `docker-compose build --no-cache`

4. **Node.js Dependencies**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules: `rm -rf node_modules`
   - Reinstall: `npm install`

### Debugging Tools

1. **Backend**
   - Laravel Debugbar
   - Xdebug
   - Laravel Telescope

2. **Frontend**
   - React Developer Tools
   - Redux DevTools
   - Chrome DevTools

## Additional Resources

### Documentation
- [API Documentation](docs/API.md)
- [System Components](docs/SystemComponents.md)
- [GitHub Setup Guide](docs/GitHubSetupGuide.md)

### Support
- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [Docker Documentation](https://docs.docker.com)

## Contact Information

For technical support or questions:
- Email: singaravelan.kr@gmail.com
- LinkedIn: https://www.linkedin.com/in/singaravelan-krishnan
