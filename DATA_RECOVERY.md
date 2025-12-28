# Data Recovery Guide

## ⚠️ If Your Data Disappeared After Deployment

If you lost data after running the deployment, it's likely because Docker created new volumes with a different project name. Your old data might still exist!

### Step 1: Find Your Old Database Volume

List all Docker volumes to find your database:

```bash
docker volume ls
```

Look for volumes that might contain your database. Common patterns:
- `dorston_mysql-data-production`
- `{directory-name}_mysql-data-production`
- Any volume with "mysql" in the name

### Step 2: Check Volume Contents

Inspect a volume to see if it contains data:

```bash
# Replace VOLUME_NAME with the actual volume name
docker volume inspect VOLUME_NAME

# Check volume size (larger = likely has data)
docker system df -v | grep VOLUME_NAME
```

### Step 3: Access the Old Volume

If you found the old volume with your data:

```bash
# Stop current containers
docker compose -p dorston -f compose.prod.yaml down

# Start a temporary MySQL container with the old volume
docker run -it --rm \
  -v OLD_VOLUME_NAME:/var/lib/mysql \
  mysql:8.4.7 \
  bash

# Inside the container, check if data exists
ls -la /var/lib/mysql/
```

### Step 4: Export Data from Old Volume

Create a backup from the old volume:

```bash
# Start MySQL with the old volume temporarily
docker run -d --name temp-mysql \
  -v OLD_VOLUME_NAME:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  mysql:8.4.7

# Wait for MySQL to start (30 seconds)
sleep 30

# Export the database
docker exec temp-mysql mysqldump -u root -proot dorston > recovered-backup.sql

# Stop and remove temporary container
docker stop temp-mysql
docker rm temp-mysql
```

### Step 5: Import into Current Database

```bash
# Make sure your current containers are running
docker compose -p dorston -f compose.prod.yaml up -d

# Import the backup
docker exec -i dorston-mysql-1 mysql -u root -p${DB_PASSWORD:-root} ${DB_DATABASE:-dorston} < recovered-backup.sql

echo "Data recovered!"
```

## Prevention: Regular Backups

### Create a Backup

```bash
# Using Make
make prod-db-backup

# Or manually
docker exec dorston-mysql-1 mysqldump -u root -p${DB_PASSWORD:-root} ${DB_DATABASE:-dorston} > backup.sql
```

### Restore from Backup

```bash
# Using Make
make prod-db-restore FILE=backups/backup-20241228-120000.sql

# Or manually
docker exec -i dorston-mysql-1 mysql -u root -p${DB_PASSWORD:-root} ${DB_DATABASE:-dorston} < backup.sql
```

## Automated Daily Backups

Add this to your VPS crontab (`crontab -e`):

```bash
# Daily backup at 2 AM
0 2 * * * cd /path/to/dorston && make prod-db-backup

# Keep only last 7 days of backups
0 3 * * * find /path/to/dorston/backups -name "*.sql" -mtime +7 -delete
```

## Why Did This Happen?

Docker Compose uses the directory name as the project name by default. If:
- You ran commands from different directories
- The project name wasn't explicitly set
- You used different Docker Compose commands

Docker would create **new volumes** instead of using existing ones, making your old data inaccessible but not deleted.

## The Fix

The updated deployment script now:
1. ✅ Explicitly sets project name: `-p dorston`
2. ✅ Checks if database volume exists before deploying
3. ✅ Shows warnings if volume is missing
4. ✅ Lists volumes before and after deployment

## Useful Commands

```bash
# List all volumes
docker volume ls

# Inspect a specific volume
docker volume inspect dorston_mysql-data-production

# See volume sizes
docker system df -v

# Find which containers use a volume
docker ps -a --filter volume=VOLUME_NAME

# Remove unused volumes (DANGEROUS - creates backup first!)
docker volume prune
```

## Still Can't Find Your Data?

If your data is truly gone:

1. **Check if you have filesystem backups** (if your VPS has automatic snapshots)
2. **Check git history** - maybe you committed database seeds or test data
3. **Contact your VPS provider** - they might have backup snapshots
4. **Learn from this** - set up automated backups immediately!

## Emergency Contact Checklist

- [ ] List all volumes: `docker volume ls`
- [ ] Check volume sizes: `docker system df -v`
- [ ] Export any found volumes with MySQL data
- [ ] Set up automated daily backups
- [ ] Test backup/restore process

