# Project Dependency Versions

This file specifies the exact versions of all dependencies used in this project.
Ensure you install these exact versions for consistency across all environments.

## Core Dependencies

| Dependency | Version | Notes |
|------------|---------|-------|
| PHP | 8.3.15 | Required |
| Composer | 2.8.x | Latest stable |
| Node.js | 20.x LTS | Long Term Support |
| npm | 10.x | Comes with Node |
| MySQL | 8.4.7 | Or compatible |
| Redis | 7.x | Latest stable |

## PHP Extensions Required

- php-fpm
- php-mysql (pdo_mysql)
- php-redis
- php-mbstring
- php-xml
- php-curl
- php-zip
- php-gd
- php-intl
- php-bcmath

## Optional Tools

| Tool | Version | Purpose |
|------|---------|---------|
| phpMyAdmin | Latest | Database management UI |
| Nginx | Latest | Web server (production) |

## How to Check Your Versions

```bash
# PHP
php -v

# Composer
composer --version

# Node.js
node --version

# npm
npm --version

# MySQL
mysql --version

# Redis
redis-server --version
```

## Compatibility Notes

- **PHP 8.3** is required for Laravel 11
- **Node.js 20.x LTS** ensures stability
- **MySQL 8.x** for modern features
- Works on macOS 12+, Ubuntu 20.04+, Windows 10+

