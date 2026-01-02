#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
REQUIRED_PHP_VERSION="8.3"
REQUIRED_NODE_VERSION="20"
REQUIRED_MYSQL_VERSION="8.4"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Dorston Project Setup (macOS)${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo -e "${CYAN}This script will help you set up your development environment.${NC}"
echo -e "${CYAN}You'll be prompted before any changes are made.${NC}"
echo ""

# Function to ask yes/no question
ask_yes_no() {
    local prompt="$1"
    local default="${2:-n}"
    
    if [[ "$default" == "y" ]]; then
        prompt="$prompt [Y/n]: "
    else
        prompt="$prompt [y/N]: "
    fi
    
    read -p "$(echo -e ${YELLOW}${prompt}${NC})" -n 1 -r
    echo
    
    if [[ "$default" == "y" ]]; then
        [[ ! $REPLY =~ ^[Nn]$ ]]
    else
        [[ $REPLY =~ ^[Yy]$ ]]
    fi
}

# Function to show menu
show_menu() {
    local title="$1"
    shift
    local options=("$@")
    
    echo -e "${CYAN}${title}${NC}"
    for i in "${!options[@]}"; do
        echo -e "  ${BLUE}$((i+1)))${NC} ${options[$i]}"
    done
    echo ""
}

# Check if Homebrew is installed
echo -e "${YELLOW}Checking Homebrew...${NC}"
if ! command -v brew &> /dev/null; then
    echo -e "${RED}✗${NC} Homebrew not found"
    if ask_yes_no "Install Homebrew? (required for this script)" "y"; then
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # Add Homebrew to PATH for Apple Silicon
        if [[ $(uname -m) == 'arm64' ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
        echo -e "${GREEN}✓ Homebrew installed${NC}"
    else
        echo -e "${RED}Cannot continue without Homebrew. Exiting.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Homebrew already installed${NC}"
fi

# Update Homebrew
echo ""
if ask_yes_no "Update Homebrew before installing packages?" "y"; then
    echo -e "${YELLOW}Updating Homebrew...${NC}"
    brew update
    echo -e "${GREEN}✓ Homebrew updated${NC}"
fi

# Check PHP installation
echo ""
echo -e "${YELLOW}Checking PHP...${NC}"
if command -v php &> /dev/null; then
    CURRENT_PHP_VERSION=$(php -v | head -n 1 | awk '{print $2}' | cut -d'.' -f1,2)
    echo -e "${GREEN}✓${NC} PHP $CURRENT_PHP_VERSION is installed"
    
    if [[ "$CURRENT_PHP_VERSION" != "$REQUIRED_PHP_VERSION" ]]; then
        echo -e "${YELLOW}⚠ Required version: PHP $REQUIRED_PHP_VERSION${NC}"
        echo ""
        show_menu "What would you like to do?" \
            "Install PHP $REQUIRED_PHP_VERSION alongside current version" \
            "Replace current PHP with PHP $REQUIRED_PHP_VERSION" \
            "Keep current PHP and skip" \
            "Exit setup"
        
        read -p "$(echo -e ${YELLOW}Choose an option [1-4]: ${NC})" choice
        case $choice in
            1)
                echo -e "${YELLOW}Installing PHP $REQUIRED_PHP_VERSION...${NC}"
                brew install php@${REQUIRED_PHP_VERSION}
                brew link php@${REQUIRED_PHP_VERSION} --force --overwrite
                brew postinstall php@${REQUIRED_PHP_VERSION}
                echo 'export PATH="/opt/homebrew/opt/php@'${REQUIRED_PHP_VERSION}'/bin:$PATH"' >> ~/.zshrc
                echo 'export PATH="/opt/homebrew/opt/php@'${REQUIRED_PHP_VERSION}'/sbin:$PATH"' >> ~/.zshrc
                export PATH="/opt/homebrew/opt/php@${REQUIRED_PHP_VERSION}/bin:$PATH"
                echo -e "${GREEN}✓ PHP $REQUIRED_PHP_VERSION installed${NC}"
                ;;
            2)
                echo -e "${YELLOW}Unlinking current PHP and installing PHP $REQUIRED_PHP_VERSION...${NC}"
                brew unlink php 2>/dev/null || true
                brew install php@${REQUIRED_PHP_VERSION}
                brew link php@${REQUIRED_PHP_VERSION} --force --overwrite
                brew postinstall php@${REQUIRED_PHP_VERSION}
                echo 'export PATH="/opt/homebrew/opt/php@'${REQUIRED_PHP_VERSION}'/bin:$PATH"' >> ~/.zshrc
                echo 'export PATH="/opt/homebrew/opt/php@'${REQUIRED_PHP_VERSION}'/sbin:$PATH"' >> ~/.zshrc
                export PATH="/opt/homebrew/opt/php@${REQUIRED_PHP_VERSION}/bin:$PATH"
                echo -e "${GREEN}✓ PHP $REQUIRED_PHP_VERSION installed and linked${NC}"
                ;;
            3)
                echo -e "${YELLOW}Keeping current PHP version${NC}"
                ;;
            4)
                echo -e "${RED}Setup cancelled${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid option. Keeping current PHP.${NC}"
                ;;
        esac
    else
        echo -e "${GREEN}✓ PHP version matches requirement${NC}"
    fi
else
    echo -e "${RED}✗${NC} PHP not found"
    if ask_yes_no "Install PHP $REQUIRED_PHP_VERSION?" "y"; then
        echo -e "${YELLOW}Installing PHP $REQUIRED_PHP_VERSION...${NC}"
        brew install php@${REQUIRED_PHP_VERSION}
        brew link php@${REQUIRED_PHP_VERSION} --force --overwrite
        brew postinstall php@${REQUIRED_PHP_VERSION}
        echo 'export PATH="/opt/homebrew/opt/php@'${REQUIRED_PHP_VERSION}'/bin:$PATH"' >> ~/.zshrc
        echo 'export PATH="/opt/homebrew/opt/php@'${REQUIRED_PHP_VERSION}'/sbin:$PATH"' >> ~/.zshrc
        export PATH="/opt/homebrew/opt/php@${REQUIRED_PHP_VERSION}/bin:$PATH"
        echo -e "${GREEN}✓ PHP $REQUIRED_PHP_VERSION installed${NC}"
    else
        echo -e "${RED}PHP is required. Cannot continue.${NC}"
        exit 1
    fi
fi

# Check Composer
echo ""
echo -e "${YELLOW}Checking Composer...${NC}"
if command -v composer &> /dev/null; then
    COMPOSER_VERSION=$(composer --version --no-ansi 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -n 1)
    echo -e "${GREEN}✓${NC} Composer $COMPOSER_VERSION is installed"
    
    if ask_yes_no "Update Composer to latest version?" "y"; then
        echo -e "${YELLOW}Updating Composer...${NC}"
        composer self-update
        echo -e "${GREEN}✓ Composer updated${NC}"
    fi
else
    echo -e "${RED}✗${NC} Composer not found"
    if ask_yes_no "Install Composer?" "y"; then
        echo -e "${YELLOW}Installing Composer...${NC}"
        EXPECTED_CHECKSUM="$(php -r 'copy("https://composer.github.io/installer.sig", "php://stdout");')"
        php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
        ACTUAL_CHECKSUM="$(php -r "echo hash_file('sha384', 'composer-setup.php');")"
        
        if [ "$EXPECTED_CHECKSUM" != "$ACTUAL_CHECKSUM" ]; then
            echo -e "${RED}✗ Composer installer corrupt${NC}"
            rm composer-setup.php
            exit 1
        fi
        
        php composer-setup.php --quiet
        rm composer-setup.php
        sudo mv composer.phar /usr/local/bin/composer
        sudo chmod +x /usr/local/bin/composer
        echo -e "${GREEN}✓ Composer installed${NC}"
    else
        echo -e "${YELLOW}Skipping Composer installation${NC}"
    fi
fi

# Check Node.js
echo ""
echo -e "${YELLOW}Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    CURRENT_NODE=$(node --version)
    CURRENT_NODE_MAJOR=$(echo $CURRENT_NODE | cut -d'v' -f2 | cut -d'.' -f1)
    echo -e "${GREEN}✓${NC} Node.js $CURRENT_NODE is installed"
    
    if [[ "$CURRENT_NODE_MAJOR" != "$REQUIRED_NODE_VERSION" ]]; then
        echo -e "${YELLOW}⚠ Required version: Node.js $REQUIRED_NODE_VERSION.x LTS${NC}"
        echo ""
        show_menu "What would you like to do?" \
            "Install Node.js $REQUIRED_NODE_VERSION alongside current version" \
            "Replace current Node.js with v$REQUIRED_NODE_VERSION" \
            "Keep current Node.js and skip" \
            "Install nvm (Node Version Manager) for easy switching"
        
        read -p "$(echo -e ${YELLOW}Choose an option [1-4]: ${NC})" choice
        case $choice in
            1)
                echo -e "${YELLOW}Installing Node.js $REQUIRED_NODE_VERSION...${NC}"
                brew install node@${REQUIRED_NODE_VERSION}
                brew link node@${REQUIRED_NODE_VERSION} --force --overwrite
                echo -e "${GREEN}✓ Node.js $REQUIRED_NODE_VERSION installed${NC}"
                ;;
            2)
                echo -e "${YELLOW}Replacing Node.js with v$REQUIRED_NODE_VERSION...${NC}"
                brew unlink node 2>/dev/null || true
                brew install node@${REQUIRED_NODE_VERSION}
                brew link node@${REQUIRED_NODE_VERSION} --force --overwrite
                echo -e "${GREEN}✓ Node.js $REQUIRED_NODE_VERSION installed and linked${NC}"
                ;;
            3)
                echo -e "${YELLOW}Keeping current Node.js version${NC}"
                ;;
            4)
                echo -e "${YELLOW}Installing nvm...${NC}"
                curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                export NVM_DIR="$HOME/.nvm"
                [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                nvm install ${REQUIRED_NODE_VERSION}
                nvm use ${REQUIRED_NODE_VERSION}
                echo -e "${GREEN}✓ nvm and Node.js $REQUIRED_NODE_VERSION installed${NC}"
                echo -e "${CYAN}Tip: Use 'nvm use 20' to switch to Node 20${NC}"
                ;;
            *)
                echo -e "${RED}Invalid option. Keeping current Node.js.${NC}"
                ;;
        esac
    else
        echo -e "${GREEN}✓ Node.js version matches requirement${NC}"
    fi
else
    echo -e "${RED}✗${NC} Node.js not found"
    if ask_yes_no "Install Node.js $REQUIRED_NODE_VERSION LTS?" "y"; then
        echo -e "${YELLOW}Installing Node.js $REQUIRED_NODE_VERSION...${NC}"
        brew install node@${REQUIRED_NODE_VERSION}
        brew link node@${REQUIRED_NODE_VERSION} --force --overwrite
        echo -e "${GREEN}✓ Node.js $REQUIRED_NODE_VERSION installed${NC}"
    else
        echo -e "${RED}Node.js is required. Cannot continue.${NC}"
        exit 1
    fi
fi

# Check MySQL
echo ""
echo -e "${YELLOW}Checking MySQL...${NC}"
if command -v mysql &> /dev/null; then
    MYSQL_VERSION=$(mysql --version | awk '{print $5}' | cut -d',' -f1)
    echo -e "${GREEN}✓${NC} MySQL $MYSQL_VERSION is installed"
    
    # Check if MySQL is running
    if brew services list | grep mysql | grep started &>/dev/null; then
        echo -e "${GREEN}✓${NC} MySQL service is running"
    else
        if ask_yes_no "MySQL is not running. Start it now?" "y"; then
            brew services start mysql
            echo -e "${GREEN}✓ MySQL service started${NC}"
        fi
    fi
else
    echo -e "${RED}✗${NC} MySQL not found"
    if ask_yes_no "Install MySQL?" "y"; then
        echo -e "${YELLOW}Installing MySQL...${NC}"
        brew install mysql
        
        if ask_yes_no "Start MySQL service now?" "y"; then
            brew services start mysql
            echo -e "${GREEN}✓ MySQL installed and started${NC}"
            echo ""
            echo -e "${YELLOW}⚠ IMPORTANT: Secure your MySQL installation${NC}"
            if ask_yes_no "Run mysql_secure_installation now?" "y"; then
                mysql_secure_installation
            else
                echo -e "${YELLOW}Remember to run 'mysql_secure_installation' later${NC}"
            fi
        else
            echo -e "${GREEN}✓ MySQL installed (not started)${NC}"
            echo -e "${CYAN}To start later: brew services start mysql${NC}"
        fi
    else
        echo -e "${YELLOW}Skipping MySQL installation${NC}"
        echo -e "${YELLOW}Note: You'll need MySQL for this project${NC}"
    fi
fi

# Check Redis
echo ""
echo -e "${YELLOW}Checking Redis...${NC}"
if command -v redis-server &> /dev/null; then
    REDIS_VERSION=$(redis-server --version | awk '{print $3}' | cut -d'=' -f2)
    echo -e "${GREEN}✓${NC} Redis $REDIS_VERSION is installed"
    
    # Check if Redis is running
    if brew services list | grep redis | grep started &>/dev/null; then
        echo -e "${GREEN}✓${NC} Redis service is running"
    else
        if ask_yes_no "Redis is not running. Start it now?" "y"; then
            brew services start redis
            echo -e "${GREEN}✓ Redis service started${NC}"
        fi
    fi
else
    echo -e "${RED}✗${NC} Redis not found"
    if ask_yes_no "Install Redis?" "y"; then
        echo -e "${YELLOW}Installing Redis...${NC}"
        brew install redis
        
        if ask_yes_no "Start Redis service now?" "y"; then
            brew services start redis
            echo -e "${GREEN}✓ Redis installed and started${NC}"
        else
            echo -e "${GREEN}✓ Redis installed (not started)${NC}"
            echo -e "${CYAN}To start later: brew services start redis${NC}"
        fi
    else
        echo -e "${YELLOW}Skipping Redis installation${NC}"
    fi
fi

# Check phpMyAdmin (optional)
echo ""
echo -e "${YELLOW}Checking phpMyAdmin...${NC}"
PHPMYADMIN_DIR="/opt/homebrew/share/phpmyadmin"

if brew list phpmyadmin &>/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} phpMyAdmin is installed"
    if ask_yes_no "Do you want to start phpMyAdmin?" "n"; then
        echo -e "${YELLOW}Starting phpMyAdmin on http://localhost:8080${NC}"
        echo -e "${CYAN}Press Ctrl+C in this terminal to stop${NC}"
        echo ""
        sleep 1
        open http://localhost:8080
        php -S localhost:8080 -t "$PHPMYADMIN_DIR"
    fi
else
    echo -e "${CYAN}ℹ${NC} phpMyAdmin not found (optional tool)"
    echo -e "${CYAN}phpMyAdmin provides a web interface for MySQL management${NC}"
    
    if ask_yes_no "Install phpMyAdmin?" "n"; then
        echo -e "${YELLOW}Installing phpMyAdmin...${NC}"
        brew install phpmyadmin
        
        if [ -d "$PHPMYADMIN_DIR" ]; then
            echo -e "${GREEN}✓ phpMyAdmin installed${NC}"
            echo ""
            echo -e "${CYAN}To access phpMyAdmin later, run:${NC}"
            echo -e "  ${BLUE}php -S localhost:8080 -t $PHPMYADMIN_DIR${NC}"
            echo -e "${CYAN}Then visit: ${BLUE}http://localhost:8080${NC}"
            echo ""
            
            if ask_yes_no "Start phpMyAdmin server now?" "y"; then
                echo -e "${YELLOW}Starting phpMyAdmin on http://localhost:8080${NC}"
                echo -e "${CYAN}Press Ctrl+C in this terminal to stop${NC}"
                echo ""
                sleep 1
                open http://localhost:8080
                php -S localhost:8080 -t "$PHPMYADMIN_DIR"
            fi
        else
            echo -e "${RED}✗ phpMyAdmin directory not found${NC}"
        fi
    else
        echo -e "${YELLOW}Skipping phpMyAdmin installation${NC}"
        echo -e "${CYAN}Alternatives:${NC}"
        echo -e "${CYAN}  - MySQL CLI: ${BLUE}mysql -u root -p${NC}"
        echo -e "${CYAN}  - TablePlus: ${BLUE}brew install --cask tableplus${NC}"
        echo -e "${CYAN}  - Sequel Ace: ${BLUE}brew install --cask sequel-ace${NC}"
    fi
fi

# Install project dependencies
echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Project Setup${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

if [ ! -f "composer.json" ]; then
    echo -e "${RED}✗${NC} composer.json not found"
    echo -e "${YELLOW}Are you in the project directory?${NC}"
    echo -e "${CYAN}Current directory: $(pwd)${NC}"
    
    if ask_yes_no "Exit setup?" "y"; then
        exit 1
    fi
fi

# Composer dependencies
if [ -f "composer.json" ]; then
    if [ -d "vendor" ]; then
        echo -e "${GREEN}✓${NC} Composer dependencies already installed"
        if ask_yes_no "Reinstall/update Composer dependencies?" "n"; then
            echo -e "${YELLOW}Installing Composer dependencies...${NC}"
            composer install
            echo -e "${GREEN}✓ Composer dependencies installed${NC}"
        fi
    else
        echo -e "${YELLOW}Installing Composer dependencies...${NC}"
        composer install
        echo -e "${GREEN}✓ Composer dependencies installed${NC}"
    fi
else
    echo -e "${YELLOW}⚠ composer.json not found, skipping Composer dependencies${NC}"
fi

# Node dependencies
if [ -f "package.json" ]; then
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✓${NC} Node dependencies already installed"
        if ask_yes_no "Reinstall/update Node dependencies?" "n"; then
            echo ""
            show_menu "How would you like to install Node dependencies?" \
                "npm install (standard)" \
                "npm ci (clean install from lock file)" \
                "npm install --force (force reinstall)" \
                "Skip"
            
            read -p "$(echo -e ${YELLOW}Choose an option [1-4]: ${NC})" choice
            case $choice in
                1)
                    echo -e "${YELLOW}Running npm install...${NC}"
                    npm install
                    echo -e "${GREEN}✓ Node dependencies installed${NC}"
                    ;;
                2)
                    echo -e "${YELLOW}Running npm ci...${NC}"
                    npm ci
                    echo -e "${GREEN}✓ Node dependencies installed${NC}"
                    ;;
                3)
                    echo -e "${YELLOW}Running npm install --force...${NC}"
                    npm install --force
                    echo -e "${GREEN}✓ Node dependencies installed${NC}"
                    ;;
                4)
                    echo -e "${YELLOW}Skipping Node dependencies${NC}"
                    ;;
                *)
                    echo -e "${RED}Invalid option. Skipping.${NC}"
                    ;;
            esac
        fi
    else
        echo -e "${YELLOW}Installing Node dependencies...${NC}"
        npm install
        echo -e "${GREEN}✓ Node dependencies installed${NC}"
    fi
else
    echo -e "${YELLOW}⚠ package.json not found, skipping Node dependencies${NC}"
fi

# Create .env if it doesn't exist
echo ""
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
    
    # Check if APP_KEY is set
    if grep -q "APP_KEY=base64:" .env; then
        echo -e "${GREEN}✓${NC} Application key is set"
    else
        echo -e "${YELLOW}⚠${NC} Application key not set"
        if ask_yes_no "Generate application key?" "y"; then
            php artisan key:generate
            echo -e "${GREEN}✓ Application key generated${NC}"
        fi
    fi
    
    if ask_yes_no "Do you want to edit .env file now?" "n"; then
        ${EDITOR:-nano} .env
    fi
else
    echo -e "${RED}✗${NC} .env file not found"
    if [ -f ".env.example" ]; then
        if ask_yes_no "Create .env from .env.example?" "y"; then
            cp .env.example .env
            echo -e "${GREEN}✓ .env created${NC}"
            
            if ask_yes_no "Generate application key?" "y"; then
                php artisan key:generate
                echo -e "${GREEN}✓ Application key generated${NC}"
            fi
            
            if ask_yes_no "Do you want to edit .env file now?" "y"; then
                ${EDITOR:-nano} .env
            fi
        fi
    else
        echo -e "${RED}⚠ .env.example not found${NC}"
    fi
fi

# Database setup
echo ""
if ask_yes_no "Do you want to set up the database now?" "y"; then
    echo ""
    echo -e "${CYAN}Database Setup${NC}"
    echo -e "${CYAN}==============${NC}"
    read -p "$(echo -e ${YELLOW}Enter database name [dorston]: ${NC})" DB_NAME
    DB_NAME=${DB_NAME:-dorston}
    
    read -p "$(echo -e ${YELLOW}Enter MySQL username [root]: ${NC})" DB_USER
    DB_USER=${DB_USER:-root}
    
    read -sp "$(echo -e ${YELLOW}Enter MySQL password: ${NC})" DB_PASS
    echo ""
    
    echo -e "${YELLOW}Creating database '$DB_NAME'...${NC}"
    if mysql -u"$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null; then
        echo -e "${GREEN}✓ Database created${NC}"
        
        # Update .env
        if [ -f ".env" ]; then
            sed -i.bak "s/DB_DATABASE=.*/DB_DATABASE=$DB_NAME/" .env
            sed -i.bak "s/DB_USERNAME=.*/DB_USERNAME=$DB_USER/" .env
            sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASS/" .env
            rm .env.bak
            echo -e "${GREEN}✓ .env updated with database credentials${NC}"
        fi
        
        if ask_yes_no "Run database migrations now?" "y"; then
            php artisan migrate
            echo -e "${GREEN}✓ Migrations completed${NC}"
            
            if ask_yes_no "Run database seeders?" "n"; then
                php artisan db:seed
                echo -e "${GREEN}✓ Seeders completed${NC}"
            fi
        fi
    else
        echo -e "${RED}✗ Failed to create database${NC}"
        echo -e "${YELLOW}You may need to create it manually${NC}"
    fi
else
    echo -e "${YELLOW}Skipping database setup${NC}"
    echo -e "${CYAN}Remember to:${NC}"
    echo -e "${CYAN}1. Create database: mysql -u root -p -e \"CREATE DATABASE dorston;\"${NC}"
    echo -e "${CYAN}2. Update .env with database credentials${NC}"
    echo -e "${CYAN}3. Run migrations: php artisan migrate${NC}"
fi

# Display versions
echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Installed Versions${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

if command -v php &> /dev/null; then
    echo -e "PHP:      ${GREEN}$(php -v | head -n 1 | awk '{print $2}')${NC}"
else
    echo -e "PHP:      ${RED}Not installed${NC}"
fi

if command -v composer &> /dev/null; then
    echo -e "Composer: ${GREEN}$(composer --version --no-ansi 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -n 1)${NC}"
else
    echo -e "Composer: ${RED}Not installed${NC}"
fi

if command -v node &> /dev/null; then
    echo -e "Node.js:  ${GREEN}$(node --version)${NC}"
else
    echo -e "Node.js:  ${RED}Not installed${NC}"
fi

if command -v npm &> /dev/null; then
    echo -e "npm:      ${GREEN}$(npm --version)${NC}"
else
    echo -e "npm:      ${RED}Not installed${NC}"
fi

if command -v mysql &> /dev/null; then
    echo -e "MySQL:    ${GREEN}$(mysql --version | awk '{print $5}' | cut -d',' -f1)${NC}"
else
    echo -e "MySQL:    ${RED}Not installed${NC}"
fi

if command -v redis-server &> /dev/null; then
    echo -e "Redis:    ${GREEN}$(redis-server --version | awk '{print $3}' | cut -d'=' -f2)${NC}"
else
    echo -e "Redis:    ${RED}Not installed${NC}"
fi

echo ""

# Final summary
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

if ask_yes_no "Would you like to see the verification report?" "y"; then
    if [ -f "scripts/verify-setup.sh" ]; then
        ./scripts/verify-setup.sh
    else
        echo -e "${YELLOW}Verification script not found${NC}"
    fi
fi

echo ""
echo -e "${CYAN}Quick Reference:${NC}"
echo ""
echo -e "${YELLOW}Start development servers:${NC}"
echo -e "  Terminal 1: ${BLUE}php artisan serve${NC}"
echo -e "  Terminal 2: ${BLUE}npm run dev${NC}"
echo ""
echo -e "${YELLOW}Common commands:${NC}"
echo -e "  Run migrations:    ${BLUE}php artisan migrate${NC}"
echo -e "  Clear caches:      ${BLUE}php artisan optimize:clear${NC}"
echo -e "  Run tests:         ${BLUE}php artisan test${NC}"
echo -e "  Build for prod:    ${BLUE}npm run build${NC}"
echo ""
echo -e "${YELLOW}Services:${NC}"
echo -e "  Start MySQL:       ${BLUE}brew services start mysql${NC}"
echo -e "  Start Redis:       ${BLUE}brew services start redis${NC}"
echo -e "  View services:     ${BLUE}brew services list${NC}"
echo ""
echo -e "${CYAN}Documentation:${NC}"
echo -e "  - SETUP.md - Setup overview"
echo -e "  - LOCAL_DEVELOPMENT.md - Development guide"
echo -e "  - VERSIONS.md - Required versions"
echo ""

if ask_yes_no "Start development servers now?" "n"; then
    echo ""
    echo -e "${YELLOW}Starting development servers...${NC}"
    echo -e "${CYAN}Press Ctrl+C to stop${NC}"
    echo ""
    
    # Start Laravel server in background
    php artisan serve &
    LARAVEL_PID=$!
    
    # Wait a moment
    sleep 2
    
    # Start Vite
    npm run dev
    
    # When Vite is stopped, also stop Laravel
    kill $LARAVEL_PID 2>/dev/null
else
    echo -e "${YELLOW}Setup complete! You can start development servers manually.${NC}"
fi

echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""

