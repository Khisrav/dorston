# Deployment Guide

This guide explains how to deploy changes to your VPS **safely** without losing data.

## ⚠️ IMPORTANT: Data Safety

**Your database and uploaded files are stored in Docker volumes that persist between deployments.**

The deployment process is designed to:
- ✅ Keep your database intact
- ✅ Keep uploaded files
- ✅ Only refresh application code and assets

However, **ALWAYS create a backup before deploying**:

```bash
make prod-db-backup
```

Backups are saved to `backups/backup-YYYYMMDD-HHMMSS.sql`

## Quick Start

After making changes, committing, and pushing to `main`:

### On your VPS

```bash
# STEP 1: Create a backup (IMPORTANT!)
make prod-db-backup

# STEP 2: Deploy
# Option 1: Automated deployment (recommended)
./deploy.sh

# Option 2: Using Make
make prod-deploy
```

The deployment script will:
1. Check that your database volume exists (safety check!)
2. Pull latest code from git
3. Stop running containers (volumes remain intact)
4. Clear old assets (NOT database!)
5. Rebuild Docker images with new code and assets
6. Start fresh containers with existing data
7. Show you the status

**Your data is safe!** Only application code and frontend assets are updated.

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

### Deployment
- `make prod-deploy` - Full automated deployment (safe, keeps data)
- `make prod-build` - Build Docker images
- `make prod-up` - Start containers
- `make prod-down` - Stop containers (keeps volumes)

### Database & Backups ⚠️ IMPORTANT
- `make prod-db-backup` - Create database backup (do this before every deploy!)
- `make prod-db-restore FILE=path/to/backup.sql` - Restore from backup
- `make prod-migrate` - Run migrations

### Monitoring
- `make prod-logs` - View logs
- `make prod-ps` - Show container status
- `make prod-volumes` - List data volumes
- `make prod-shell` - Access PHP container

### Maintenance
- `make prod-restart` - Restart containers
- `make prod-cache-clear` - Clear all caches
- `make prod-optimize` - Optimize application

### Dangerous Commands ⚠️
- `make prod-clean-volumes` - **DELETES ALL DATA!** (requires confirmation)

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
3. Make scripts executable:
   ```bash
   chmod +x deploy.sh
   chmod +x scripts/find-old-data.sh
   ```
4. Run initial deployment:
   ```bash
   ./deploy.sh
   ```
5. Set up automated backups (see below)

## Environment Variables

Make sure your `.env` file on the VPS has:
- Database credentials matching `compose.prod.yaml`
- Proper `APP_URL`
- `APP_ENV=production`
- `APP_DEBUG=false`
- Other production-specific settings

## Automated Backups (Highly Recommended!)

Set up daily automated backups on your VPS:

```bash
# Edit crontab
crontab -e

# Add these lines (adjust path to your project):
# Daily backup at 2 AM
0 2 * * * cd /path/to/dorston && make prod-db-backup

# Delete backups older than 7 days
0 3 * * * find /path/to/dorston/backups -name "*.sql" -mtime +7 -delete
```

## Data Recovery

**If you lost data after deployment**, see [DATA_RECOVERY.md](./DATA_RECOVERY.md) for recovery steps.

Your old data might still exist in orphaned Docker volumes! Use the recovery script:

```bash
./scripts/find-old-data.sh
```

## Project Name Consistency

All commands now use explicit project name (`-p dorston`) to ensure:
- ✅ Volumes are always found correctly
- ✅ No accidental data loss from mismatched names
- ✅ Consistent behavior regardless of working directory

The project name is set in:
- `deploy.sh` (line 11): `PROJECT_NAME="dorston"`
- `Makefile` (line 89): `PROJECT_NAME ?= dorston`

