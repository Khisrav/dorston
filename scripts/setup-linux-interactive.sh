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
echo -e "${BLUE}  Dorston Project Setup (Linux)${NC}"
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

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    echo -e "${GREEN}✓${NC} Detected OS: $PRETTY_NAME"
else
    echo -e "${RED}Cannot detect OS. This script supports Ubuntu/Debian.${NC}"
    exit 1
fi

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}⚠ This script should NOT be run as root${NC}" 
   echo -e "${YELLOW}Please run as a regular user (sudo will be used when needed)${NC}"
   exit 1
fi

# Update package manager
echo ""
if ask_yes_no "Update package lists?" "y"; then
    echo -e "${YELLOW}Updating package manager...${NC}"
    sudo apt update
    echo -e "${GREEN}✓ Package lists updated${NC}"
fi

# Install prerequisites
echo ""
echo -e "${YELLOW}Checking prerequisites...${NC}"
PREREQS="software-properties-common curl wget git unzip"
MISSING_PREREQS=""

for pkg in $PREREQS; do
    if ! dpkg -l | grep -q "^ii  $pkg "; then
        MISSING_PREREQS="$MISSING_PREREQS $pkg"
    fi
done

if [ -n "$MISSING_PREREQS" ]; then
    echo -e "${YELLOW}Missing packages:$MISSING_PREREQS${NC}"
    if ask_yes_no "Install missing prerequisites?" "y"; then
        sudo apt install -y $MISSING_PREREQS
        echo -e "${GREEN}✓ Prerequisites installed${NC}"
    fi
else
    echo -e "${GREEN}✓ All prerequisites installed${NC}"
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
            "Switch to PHP $REQUIRED_PHP_VERSION" \
            "Keep current PHP and skip" \
            "Exit setup"
        
        read -p "$(echo -e ${YELLOW}Choose an option [1-4]: ${NC})" choice
        case $choice in
            1)
                echo -e "${YELLOW}Adding PHP repository...${NC}"
                sudo add-apt-repository -y ppa:ondrej/php
                sudo apt update
                echo -e "${YELLOW}Installing PHP $REQUIRED_PHP_VERSION...${NC}"
                sudo apt install -y php${REQUIRED_PHP_VERSION} \
                    php${REQUIRED_PHP_VERSION}-cli \
                    php${REQUIRED_PHP_VERSION}-fpm \
                    php${REQUIRED_PHP_VERSION}-mysql \
                    php${REQUIRED_PHP_VERSION}-redis \
                    php${REQUIRED_PHP_VERSION}-mbstring \
                    php${REQUIRED_PHP_VERSION}-xml \
                    php${REQUIRED_PHP_VERSION}-curl \
                    php${REQUIRED_PHP_VERSION}-zip \
                    php${REQUIRED_PHP_VERSION}-gd \
                    php${REQUIRED_PHP_VERSION}-intl \
                    php${REQUIRED_PHP_VERSION}-bcmath
                sudo update-alternatives --set php /usr/bin/php${REQUIRED_PHP_VERSION}
                echo -e "${GREEN}✓ PHP $REQUIRED_PHP_VERSION installed${NC}"
                ;;
            2)
                echo -e "${YELLOW}Switching to PHP $REQUIRED_PHP_VERSION...${NC}"
                if ! dpkg -l | grep -q "php${REQUIRED_PHP_VERSION}"; then
                    sudo add-apt-repository -y ppa:ondrej/php
                    sudo apt update
                    sudo apt install -y php${REQUIRED_PHP_VERSION} \
                        php${REQUIRED_PHP_VERSION}-cli \
                        php${REQUIRED_PHP_VERSION}-fpm \
                        php${REQUIRED_PHP_VERSION}-mysql \
                        php${REQUIRED_PHP_VERSION}-redis \
                        php${REQUIRED_PHP_VERSION}-mbstring \
                        php${REQUIRED_PHP_VERSION}-xml \
                        php${REQUIRED_PHP_VERSION}-curl \
                        php${REQUIRED_PHP_VERSION}-zip \
                        php${REQUIRED_PHP_VERSION}-gd \
                        php${REQUIRED_PHP_VERSION}-intl \
                        php${REQUIRED_PHP_VERSION}-bcmath
                fi
                sudo update-alternatives --set php /usr/bin/php${REQUIRED_PHP_VERSION}
                echo -e "${GREEN}✓ Switched to PHP $REQUIRED_PHP_VERSION${NC}"
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
        echo -e "${YELLOW}Adding PHP repository...${NC}"
        sudo add-apt-repository -y ppa:ondrej/php
        sudo apt update
        echo -e "${YELLOW}Installing PHP $REQUIRED_PHP_VERSION and extensions...${NC}"
        sudo apt install -y \
            php${REQUIRED_PHP_VERSION} \
            php${REQUIRED_PHP_VERSION}-cli \
            php${REQUIRED_PHP_VERSION}-fpm \
            php${REQUIRED_PHP_VERSION}-mysql \
            php${REQUIRED_PHP_VERSION}-redis \
            php${REQUIRED_PHP_VERSION}-mbstring \
            php${REQUIRED_PHP_VERSION}-xml \
            php${REQUIRED_PHP_VERSION}-curl \
            php${REQUIRED_PHP_VERSION}-zip \
            php${REQUIRED_PHP_VERSION}-gd \
            php${REQUIRED_PHP_VERSION}-intl \
            php${REQUIRED_PHP_VERSION}-bcmath
        sudo update-alternatives --set php /usr/bin/php${REQUIRED_PHP_VERSION}
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
        sudo composer self-update
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

# Rest of the script follows similar pattern to macOS version...
# (Node.js, MySQL, Redis, project setup)

echo ""
echo -e "${GREEN}Setup script continues...${NC}"
echo -e "${YELLOW}(Additional sections for Node.js, MySQL, Redis would follow)${NC}"

