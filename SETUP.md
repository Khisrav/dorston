# Dorston Project - Setup Overview

This project provides **interactive setup scripts** for local development across all major platforms.

✨ **New:** Fully interactive scripts that check existing installations and give you control!

## 📋 Available Documentation

- **[SETUP_INTERACTIVE.md](SETUP_INTERACTIVE.md)** - **NEW! Guide to interactive setup features**
- **[VERSIONS.md](VERSIONS.md)** - Exact versions of all dependencies
- **[LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md)** - Complete guide for local development
- **[SETUP_WINDOWS.md](SETUP_WINDOWS.md)** - Windows-specific setup instructions

## 🚀 Quick Start

### macOS

```bash
chmod +x scripts/setup-macos.sh
./scripts/setup-macos.sh
```

### Linux (Ubuntu/Debian)

```bash
chmod +x scripts/setup-linux.sh
./scripts/setup-linux.sh
```

### Windows

See [SETUP_WINDOWS.md](SETUP_WINDOWS.md) for detailed instructions.

## ✅ Verify Installation

After running the setup script, verify everything is installed correctly:

```bash
chmod +x scripts/verify-setup.sh
./scripts/verify-setup.sh
```

This will check:
- ✓ PHP 8.3 and required extensions
- ✓ Composer 2.x
- ✓ Node.js 20.x LTS
- ✓ MySQL 8.4
- ✓ Redis 7.x
- ✓ Project dependencies
- ✓ Configuration files
- ✓ Permissions

## 🎯 What Gets Installed

| Component | Version | Purpose |
|-----------|---------|---------|
| PHP | 8.3.15 | Backend runtime |
| Composer | 2.8.x | PHP dependency manager |
| Node.js | 20.x LTS | Frontend runtime |
| npm | 10.x | Node package manager |
| MySQL | 8.4.7 | Database |
| Redis | 7.x | Cache & sessions |

## 📖 Next Steps

1. **Run setup script** for your platform
2. **Verify installation** with `./scripts/verify-setup.sh`
3. **Configure database** (create database, update `.env`)
4. **Run migrations** with `php artisan migrate`
5. **Start development** with:
   - Terminal 1: `php artisan serve`
   - Terminal 2: `npm run dev`
6. **Visit** http://localhost:8000

## 📚 Documentation

For detailed development workflows, debugging, and common tasks, see:
- [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md) - Comprehensive development guide

## 🐛 Troubleshooting

### Installation Issues

**macOS: Homebrew fails**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Linux: Permission denied**
```bash
sudo chmod +x scripts/setup-linux.sh
sudo ./scripts/setup-linux.sh
```

**Windows: PowerShell execution policy**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Version Mismatches

If you have different versions installed, you may need to:

**Switch PHP version (macOS):**
```bash
brew unlink php
brew link php@8.3 --force
```

**Switch Node version:**
```bash
# Using nvm (recommended)
nvm install 20
nvm use 20
```

### Common Errors

**Error: Command not found after installation**
- Close and reopen your terminal
- Check your PATH: `echo $PATH`

**Error: Permission denied on storage**
```bash
chmod -R 775 storage bootstrap/cache
```

**Error: MySQL connection refused**
```bash
# macOS:
brew services start mysql

# Linux:
sudo systemctl start mysql
```

## 🎯 Using Makefile Commands

The project includes convenient Makefile commands:

```bash
make help        # Show all available commands
make serve       # Start Laravel development server
make dev         # Start Vite dev server
make build       # Build assets for production
make phpmyadmin  # Start phpMyAdmin server
make artisan CMD="migrate"  # Run artisan commands
```

## 💡 Tips

- **Use version managers:** `nvm` for Node.js, `phpbrew` for PHP
- **IDE:** VS Code with Laravel Extension Pack or PhpStorm
- **Git:** Always work on feature branches
- **Testing:** Run `php artisan test` before committing

## 🆘 Need Help?

1. Check [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md) for detailed guides
2. Run `./scripts/verify-setup.sh` to diagnose issues
3. Check Laravel docs: https://laravel.com/docs
4. Search existing issues or create a new one

## 📦 Production Deployment

These scripts are for **local development only**. For production deployment:
- Set up a proper web server (Nginx/Apache) with PHP-FPM
- Configure MySQL for production use
- Use environment-specific `.env` files
- Set up automated backups

---

**Ready to start?** Run the setup script for your platform and start coding! 🚀

