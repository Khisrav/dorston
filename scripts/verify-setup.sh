#!/bin/bash

# Version Verification Script
# Checks if all required dependencies are installed with correct versions

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Version Verification${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Function to check version
check_version() {
    local name=$1
    local command=$2
    local expected=$3
    local extract=$4
    
    if command -v $command &> /dev/null; then
        local version=$(eval "$extract" 2>/dev/null)
        echo -e "${GREEN}✓${NC} $name: $version"
        
        # Check if version matches expected (loose matching)
        if [[ ! -z "$expected" ]]; then
            if [[ $version == $expected* ]]; then
                echo -e "  ${GREEN}→ Matches expected version ($expected)${NC}"
            else
                echo -e "  ${YELLOW}⚠ Expected: $expected, Got: $version${NC}"
            fi
        fi
    else
        echo -e "${RED}✗${NC} $name: NOT FOUND"
        ((ERRORS++))
    fi
    echo ""
}

# Check PHP
echo -e "${YELLOW}Checking PHP...${NC}"
check_version "PHP" "php" "8.3" "php -v | head -n 1 | awk '{print \$2}'"

# Check Composer
echo -e "${YELLOW}Checking Composer...${NC}"
check_version "Composer" "composer" "2." "composer --version --no-ansi 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -n 1"

# Check Node.js
echo -e "${YELLOW}Checking Node.js...${NC}"
check_version "Node.js" "node" "v20" "node --version"

# Check npm
echo -e "${YELLOW}Checking npm...${NC}"
check_version "npm" "npm" "10" "npm --version"

# Check MySQL
echo -e "${YELLOW}Checking MySQL...${NC}"
check_version "MySQL" "mysql" "8." "mysql --version | awk '{print \$5}' | cut -d',' -f1"

# Check Redis
echo -e "${YELLOW}Checking Redis...${NC}"
check_version "Redis" "redis-server" "7" "redis-server --version | awk '{print \$3}' | cut -d'=' -f2"

# Check PHP extensions
echo -e "${YELLOW}Checking PHP Extensions...${NC}"
required_extensions=("pdo_mysql" "mbstring" "xml" "curl" "zip" "gd" "intl" "bcmath" "redis")
for ext in "${required_extensions[@]}"; do
    if php -m | grep -q "^$ext$"; then
        echo -e "${GREEN}✓${NC} php-$ext"
    else
        echo -e "${RED}✗${NC} php-$ext: NOT FOUND"
        ((ERRORS++))
    fi
done
echo ""

# Check if project dependencies are installed
echo -e "${YELLOW}Checking Project Dependencies...${NC}"
if [ -d "vendor" ] && [ -f "vendor/autoload.php" ]; then
    echo -e "${GREEN}✓${NC} Composer dependencies installed"
else
    echo -e "${RED}✗${NC} Composer dependencies NOT installed"
    echo -e "  ${YELLOW}Run: composer install${NC}"
    ((ERRORS++))
fi

if [ -d "node_modules" ] && [ -f "node_modules/.bin/vite" ]; then
    echo -e "${GREEN}✓${NC} Node dependencies installed"
else
    echo -e "${RED}✗${NC} Node dependencies NOT installed"
    echo -e "  ${YELLOW}Run: npm install${NC}"
    ((ERRORS++))
fi
echo ""

# Check .env file
echo -e "${YELLOW}Checking Configuration...${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
    
    # Check if APP_KEY is set
    if grep -q "APP_KEY=base64:" .env; then
        echo -e "${GREEN}✓${NC} Application key is set"
    else
        echo -e "${RED}✗${NC} Application key not set"
        echo -e "  ${YELLOW}Run: php artisan key:generate${NC}"
        ((ERRORS++))
    fi
else
    echo -e "${RED}✗${NC} .env file NOT found"
    echo -e "  ${YELLOW}Run: cp .env.example .env && php artisan key:generate${NC}"
    ((ERRORS++))
fi
echo ""

# Check storage permissions
echo -e "${YELLOW}Checking Permissions...${NC}"
if [ -w "storage" ] && [ -w "bootstrap/cache" ]; then
    echo -e "${GREEN}✓${NC} Storage directories are writable"
else
    echo -e "${RED}✗${NC} Storage directories not writable"
    echo -e "  ${YELLOW}Run: chmod -R 775 storage bootstrap/cache${NC}"
    ((ERRORS++))
fi
echo ""

# Final summary
echo -e "${BLUE}================================${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo -e "${GREEN}You're ready to start development.${NC}"
    echo ""
    echo -e "${YELLOW}To start development servers:${NC}"
    echo -e "  Terminal 1: ${BLUE}php artisan serve${NC}"
    echo -e "  Terminal 2: ${BLUE}npm run dev${NC}"
else
    echo -e "${RED}✗ Found $ERRORS issue(s)${NC}"
    echo -e "${YELLOW}Please fix the issues above before continuing.${NC}"
fi
echo -e "${BLUE}================================${NC}"

exit $ERRORS

