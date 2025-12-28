#!/bin/bash
# Script to find and recover old database volumes

echo "🔍 Searching for MySQL data volumes..."
echo ""

# List all volumes that might contain MySQL data
volumes=$(docker volume ls --format "{{.Name}}" | grep -i mysql)

if [ -z "$volumes" ]; then
    echo "❌ No MySQL volumes found."
    exit 1
fi

echo "Found the following MySQL volumes:"
echo "=================================="
echo "$volumes"
echo ""

# Check size of each volume
echo "Volume details:"
echo "=================================="
docker system df -v | head -1
echo "$volumes" | while read -r volume; do
    docker system df -v | grep "$volume"
done

echo ""
echo "📊 Volumes with data (size > 1MB) are likely to contain your database."
echo ""
echo "To inspect a volume's contents:"
echo "  docker run --rm -v VOLUME_NAME:/data alpine ls -lah /data"
echo ""
echo "To export data from a volume:"
echo "  1. docker run -d --name temp-mysql -v VOLUME_NAME:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root mysql:8.4.7"
echo "  2. sleep 30  # wait for MySQL to start"
echo "  3. docker exec temp-mysql mysqldump -u root -proot dorston > recovered-backup.sql"
echo "  4. docker stop temp-mysql && docker rm temp-mysql"

