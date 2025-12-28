# Deployment Guide

This guide explains how to deploy changes to your VPS.

## Quick Start

After making changes, committing, and pushing to `main`:

### On your VPS

```bash
# Option 1: Automated deployment (recommended)
./deploy.sh

# Option 2: Using Make
make prod-deploy
```

That's it! The script will:
- Pull latest code from git
- Stop running containers
- Clear old assets
- Rebuild Docker images with new code and assets
- Start fresh containers
- Show you the status

## Manual Deployment Steps

If you prefer to run commands manually:

```bash
# 1. Pull latest code
git pull origin main

# 2. Stop and remove containers
docker compose -f compose.prod.yaml down

# 3. Remove old assets volume (important!)
docker volume rm dorston_laravel-public-assets

# 4. Rebuild images
docker compose -f compose.prod.yaml build --no-cache

# 5. Start containers
docker compose -f compose.prod.yaml up -d
```

## Common Tasks

### View Logs
```bash
# All services
make prod-logs
# or
docker compose -f compose.prod.yaml logs -f

# Specific service
docker compose -f compose.prod.yaml logs -f php-fpm
docker compose -f compose.prod.yaml logs -f web
```

### Check Status
```bash
make prod-ps
# or
docker compose -f compose.prod.yaml ps
```

### Run Migrations
```bash
make prod-migrate
# or
docker compose -f compose.prod.yaml exec php-fpm php artisan migrate --force
```

### Clear Cache
```bash
make prod-cache-clear
```

### Optimize Application
```bash
make prod-optimize
```

### Access Container Shell
```bash
make prod-shell
# or
docker compose -f compose.prod.yaml exec php-fpm sh
```

### Restart Services
```bash
make prod-restart
# or
docker compose -f compose.prod.yaml restart
```

## Available Make Commands

Run `make help` to see all available commands, or check the production-specific ones:

- `make prod-deploy` - Full automated deployment
- `make prod-build` - Build Docker images
- `make prod-up` - Start containers
- `make prod-down` - Stop containers
- `make prod-restart` - Restart containers
- `make prod-logs` - View logs
- `make prod-ps` - Show container status
- `make prod-migrate` - Run migrations
- `make prod-cache-clear` - Clear all caches
- `make prod-optimize` - Optimize application
- `make prod-shell` - Access PHP container

## How It Works

### Asset Building

Your frontend assets (Vue, CSS, JS) are built **inside Docker** during the image build process:

1. The Nginx Dockerfile creates a temporary container with Node.js
2. Runs `npm install && npm run build:ssr` to build client and SSR bundles
3. Copies the built assets into the final image
4. Assets are shared between Nginx and PHP-FPM via Docker volumes

This means:
- ✅ You don't need Node.js installed on your VPS
- ✅ Assets are always fresh with each deployment
- ✅ No manual `npm run build` needed

### Database Migrations

Migrations run automatically when the PHP-FPM container starts (see `docker/production/php-fpm/entrypoint.sh`). You can also run them manually with `make prod-migrate`.

### Configuration Caching

The entrypoint script also automatically:
- Caches configuration: `php artisan config:cache`
- Caches routes: `php artisan route:cache`

## Troubleshooting

### Old assets still showing?

```bash
# Make sure to remove the assets volume
docker volume rm dorston_laravel-public-assets

# Then rebuild
docker compose -f compose.prod.yaml build --no-cache
docker compose -f compose.prod.yaml up -d
```

### Container won't start?

```bash
# Check logs
docker compose -f compose.prod.yaml logs

# Check specific service
docker compose -f compose.prod.yaml logs php-fpm
docker compose -f compose.prod.yaml logs mysql
```

### Database connection issues?

```bash
# Check if MySQL is healthy
docker compose -f compose.prod.yaml ps

# Restart MySQL
docker compose -f compose.prod.yaml restart mysql
```

### Need to reset everything?

```bash
# WARNING: This will delete all data!
docker compose -f compose.prod.yaml down -v
docker compose -f compose.prod.yaml build --no-cache
docker compose -f compose.prod.yaml up -d
```

## First Time Setup on VPS

1. Clone the repository
2. Copy `.env.example` to `.env` and configure it
3. Make the deployment script executable:
   ```bash
   chmod +x deploy.sh
   ```
4. Run initial deployment:
   ```bash
   ./deploy.sh
   ```

## Environment Variables

Make sure your `.env` file on the VPS has:
- Database credentials matching `compose.prod.yaml`
- Proper `APP_URL`
- `APP_ENV=production`
- `APP_DEBUG=false`
- Other production-specific settings

