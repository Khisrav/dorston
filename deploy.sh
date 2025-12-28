#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="compose.prod.yaml"
PROJECT_NAME="dorston"

echo -e "${GREEN}=== Starting Deployment ===${NC}"

# Important: List existing volumes BEFORE deployment
echo -e "${YELLOW}Current volumes:${NC}"
docker volume ls | grep ${PROJECT_NAME} || echo "No volumes found yet"

# Step 1: Pull latest code
echo -e "${YELLOW}Pulling latest code from git...${NC}"
git pull origin main

# Step 2: Stop running containers (but keep volumes!)
echo -e "${YELLOW}Stopping containers...${NC}"
docker compose -p ${PROJECT_NAME} -f $COMPOSE_FILE down

# Step 3: Remove ONLY assets volume to force fresh build (NOT database!)
echo -e "${YELLOW}Removing old assets volume (keeping database)...${NC}"
docker volume rm ${PROJECT_NAME}_laravel-public-assets 2>/dev/null || echo "Assets volume doesn't exist, skipping..."

# Verify database volume still exists
echo -e "${YELLOW}Verifying database volume exists:${NC}"
if docker volume inspect ${PROJECT_NAME}_mysql-data-production >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Database volume found - your data is safe!${NC}"
else
    echo -e "${RED}⚠ WARNING: Database volume not found! This will create a new empty database.${NC}"
    read -p "Continue? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

# Step 4: Build new images
echo -e "${YELLOW}Building Docker images (this may take a few minutes)...${NC}"
docker compose -p ${PROJECT_NAME} -f $COMPOSE_FILE build --no-cache

# Step 5: Start containers (with explicit project name to ensure correct volumes)
echo -e "${YELLOW}Starting containers...${NC}"
docker compose -p ${PROJECT_NAME} -f $COMPOSE_FILE up -d

# Step 6: Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Step 7: Check container status
echo -e "${YELLOW}Checking container status...${NC}"
docker compose -p ${PROJECT_NAME} -f $COMPOSE_FILE ps

# Step 8: Verify volumes are properly mounted
echo -e "${YELLOW}Verifying volumes:${NC}"
docker volume ls | grep ${PROJECT_NAME}

# Step 9: Show recent logs
echo -e "${YELLOW}Recent logs:${NC}"
docker compose -p ${PROJECT_NAME} -f $COMPOSE_FILE logs --tail=20

echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo -e "${GREEN}Your application is now running with the latest changes.${NC}"
echo ""
echo "Useful commands:"
echo "  - View logs: docker compose -p ${PROJECT_NAME} -f $COMPOSE_FILE logs -f"
echo "  - Check status: docker compose -p ${PROJECT_NAME} -f $COMPOSE_FILE ps"
echo "  - Restart services: docker compose -p ${PROJECT_NAME} -f $COMPOSE_FILE restart"

