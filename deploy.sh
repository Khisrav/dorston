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

# Step 1: Pull latest code
echo -e "${YELLOW}Pulling latest code from git...${NC}"
git pull origin main

# Step 2: Stop running containers
echo -e "${YELLOW}Stopping containers...${NC}"
docker compose -f $COMPOSE_FILE down

# Step 3: Remove old assets volume to force fresh build
echo -e "${YELLOW}Removing old assets volume...${NC}"
docker volume rm ${PROJECT_NAME}_laravel-public-assets 2>/dev/null || echo "Volume doesn't exist, skipping..."

# Step 4: Build new images
echo -e "${YELLOW}Building Docker images (this may take a few minutes)...${NC}"
docker compose -f $COMPOSE_FILE build --no-cache

# Step 5: Start containers
echo -e "${YELLOW}Starting containers...${NC}"
docker compose -f $COMPOSE_FILE up -d

# Step 6: Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Step 7: Check container status
echo -e "${YELLOW}Checking container status...${NC}"
docker compose -f $COMPOSE_FILE ps

# Step 8: Show recent logs
echo -e "${YELLOW}Recent logs:${NC}"
docker compose -f $COMPOSE_FILE logs --tail=20

echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo -e "${GREEN}Your application is now running with the latest changes.${NC}"
echo ""
echo "Useful commands:"
echo "  - View logs: docker compose -f $COMPOSE_FILE logs -f"
echo "  - Check status: docker compose -f $COMPOSE_FILE ps"
echo "  - Restart services: docker compose -f $COMPOSE_FILE restart"

