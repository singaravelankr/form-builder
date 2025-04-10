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
# 1. Stop and remove all containers, networks, and volumes
docker-compose down -v

# 2. Nuclear cleanup (images, build cache, orphaned volumes)
docker system prune -a -f --volumes
docker image prune -a
docker builder prune --all -f

# 3. Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d

```

## Backend Setup

### 1. Install Dependencies
```bash
# Install dependencies and fix permissions
docker-compose exec -u root backend sh -c "
    composer install &&
    chown -R www-data:www-data /var/www &&
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache
"

# Initialize Laravel and Generate Application Key
docker-compose exec backend sh -c "
    php artisan key:generate &&
    php artisan migrate:fresh --seed
"
```

## Frontend Setup

### 1. Install Dependencies
```bash
# Install dependencies and start dev server
docker-compose exec frontend sh -c "
    npm install --no-cache && 
    npm run dev
"
```


### Verify Setup

```bash
# Check running services
docker-compose ps

# Tail logs (use service name like 'backend' or 'frontend')
docker-compose logs -f

# Test endpoints (example)
curl -I http://localhost:8000/api
curl -I http://localhost:3000


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

### Support
- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [Docker Documentation](https://docs.docker.com)

## Contact Information

For technical support or questions:
- Email: singaravelan.kr@gmail.com
- LinkedIn: https://www.linkedin.com/in/singaravelan-krishnan
