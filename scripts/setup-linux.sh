#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Dorston Project Setup (Linux)${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo -e "${RED}Cannot detect OS. This script supports Ubuntu/Debian.${NC}"
    exit 1
fi

# Update package manager
echo -e "${YELLOW}Updating package manager...${NC}"
sudo apt update

# Install prerequisites
echo ""
echo -e "${YELLOW}Installing prerequisites...${NC}"
sudo apt install -y software-properties-common curl wget git unzip

# Add PHP repository
echo ""
echo -e "${YELLOW}Adding PHP repository...${NC}"
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update

# Install PHP 8.3 and extensions
echo ""
echo -e "${YELLOW}Installing PHP 8.3 and extensions...${NC}"
sudo apt install -y \
    php8.3 \
    php8.3-cli \
    php8.3-fpm \
    php8.3-mysql \
    php8.3-redis \
    php8.3-mbstring \
    php8.3-xml \
    php8.3-curl \
    php8.3-zip \
    php8.3-gd \
    php8.3-intl \
    php8.3-bcmath

# Set PHP 8.3 as default
sudo update-alternatives --set php /usr/bin/php8.3

# Install Composer
echo ""
echo -e "${YELLOW}Installing Composer...${NC}"
if command -v composer &> /dev/null; then
    echo -e "${GREEN}✓ Composer already installed${NC}"
    composer self-update
else
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
    sudo chmod +x /usr/local/bin/composer
fi

# Install Node.js 20 LTS
echo ""
echo -e "${YELLOW}Installing Node.js 20 LTS...${NC}"
if command -v node &> /dev/null; then
    CURRENT_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [[ "$CURRENT_VERSION" == "20" ]]; then
        echo -e "${GREEN}✓ Node.js 20 already installed${NC}"
    else
        echo -e "${YELLOW}Different Node version detected. Installing Node 20...${NC}"
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt install -y nodejs
    fi
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Install MySQL
echo ""
echo -e "${YELLOW}Installing MySQL 8.4...${NC}"
if command -v mysql &> /dev/null; then
    echo -e "${GREEN}✓ MySQL already installed${NC}"
else
    sudo apt install -y mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
    
    echo ""
    echo -e "${YELLOW}MySQL installed. You should secure it:${NC}"
    echo -e "${BLUE}Run: sudo mysql_secure_installation${NC}"
fi

# Install Redis
echo ""
echo -e "${YELLOW}Installing Redis...${NC}"
if command -v redis-server &> /dev/null; then
    echo -e "${GREEN}✓ Redis already installed${NC}"
else
    sudo apt install -y redis-server
    sudo systemctl start redis
    sudo systemctl enable redis
fi

# Install Nginx (optional)
echo ""
read -p "Install Nginx? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Installing Nginx...${NC}"
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
fi

# Install project dependencies
echo ""
echo -e "${YELLOW}Installing project dependencies...${NC}"
if [ -f "composer.json" ]; then
    composer install
else
    echo -e "${RED}⚠ composer.json not found. Are you in the project directory?${NC}"
fi

if [ -f "package.json" ]; then
    npm install
else
    echo -e "${RED}⚠ package.json not found. Are you in the project directory?${NC}"
fi

# Create .env if it doesn't exist
echo ""
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cp .env.example .env 2>/dev/null || echo -e "${RED}⚠ .env.example not found${NC}"
    
    if [ -f ".env" ]; then
        php artisan key:generate
        echo -e "${GREEN}✓ .env created and app key generated${NC}"
    fi
fi

# Set proper permissions
echo ""
echo -e "${YELLOW}Setting permissions...${NC}"
sudo chown -R $USER:$USER storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Display versions
echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Installed Versions${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo -e "PHP:      $(php -v | head -n 1 | awk '{print $2}')"
echo -e "Composer: $(composer --version --no-ansi | awk '{print $3}')"
echo -e "Node.js:  $(node --version)"
echo -e "npm:      $(npm --version)"
echo -e "MySQL:    $(mysql --version | awk '{print $5}' | cut -d',' -f1)"
echo -e "Redis:    $(redis-server --version | awk '{print $3}' | cut -d'=' -f2)"
echo ""

# Next steps
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo -e "1. Configure your database:"
echo -e "   ${BLUE}sudo mysql${NC}"
echo -e "   ${BLUE}CREATE DATABASE dorston;${NC}"
echo -e "   ${BLUE}CREATE USER 'dorston'@'localhost' IDENTIFIED BY 'password';${NC}"
echo -e "   ${BLUE}GRANT ALL PRIVILEGES ON dorston.* TO 'dorston'@'localhost';${NC}"
echo -e "   ${BLUE}FLUSH PRIVILEGES;${NC}"
echo ""
echo -e "2. Update .env with your database credentials"
echo ""
echo -e "3. Run migrations:"
echo -e "   ${BLUE}php artisan migrate${NC}"
echo ""
echo -e "4. Start development servers:"
echo -e "   ${BLUE}php artisan serve${NC} (in one terminal)"
echo -e "   ${BLUE}npm run dev${NC} (in another terminal)"
echo ""
echo -e "5. Visit: ${BLUE}http://localhost:8000${NC}"
echo ""

