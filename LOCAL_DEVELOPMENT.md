# Local Development Guide

This guide covers local development after you've run the setup scripts.

## Quick Start

### First Time Setup

1. **Run the setup script for your OS:**

   **macOS:**
   ```bash
   cd /path/to/dorston
   chmod +x scripts/setup-macos.sh
   ./scripts/setup-macos.sh
   ```

   **Linux (Ubuntu/Debian):**
   ```bash
   cd /path/to/dorston
   chmod +x scripts/setup-linux.sh
   ./scripts/setup-linux.sh
   ```

   **Windows:**
   See `SETUP_WINDOWS.md` for detailed instructions.

2. **Verify installation:**
   ```bash
   chmod +x scripts/verify-setup.sh
   ./scripts/verify-setup.sh
   ```

3. **Configure database in `.env`:**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=dorston
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

4. **Run migrations:**
   ```bash
   php artisan migrate
   ```

5. **Seed database (optional):**
   ```bash
   php artisan db:seed
   ```

## Daily Development Workflow

### Starting Development Servers

You can use the Makefile commands for convenience:

**Start Laravel Backend:**
```bash
make serve
```
This starts the backend at `http://localhost:8000`

**Start Vite Frontend:**
```bash
make dev
```
This starts Vite dev server for hot-module-replacement

**Start phpMyAdmin (optional):**
```bash
make phpmyadmin
```
This starts phpMyAdmin at `http://localhost:8080`

Or run the commands directly in separate terminal windows:

**Terminal 1 - Laravel Backend:**
```bash
php artisan serve
```

**Terminal 2 - Vite Frontend:**
```bash
npm run dev
```

**Terminal 3 - phpMyAdmin (optional):**
```bash
php -S localhost:8080 -t /opt/homebrew/share/phpmyadmin
```

### Access Your Application

Visit: http://localhost:8000

### Stopping Development

- Press `Ctrl+C` in each terminal to stop the servers

## Common Tasks

### Install New Composer Package
```bash
composer require vendor/package-name
```

### Install New npm Package
```bash
npm install package-name
# or for dev dependencies
npm install --save-dev package-name
```

### Run Database Migrations
```bash
# Run new migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Fresh migration (WARNING: deletes all data)
php artisan migrate:fresh

# Fresh with seeders
php artisan migrate:fresh --seed
```

### Clear Caches
```bash
# Clear all caches
php artisan optimize:clear

# Or individually:
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Run Tests
```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test --filter=ExampleTest

# With coverage
php artisan test --coverage
```

### Build for Production
```bash
# Build assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Database Management

**Using phpMyAdmin:**
- Start with: `make phpmyadmin`
- Visit: http://localhost:8080
- Login with your MySQL credentials

**Using MySQL CLI:**
```bash
# Connect to MySQL
mysql -u root -p

# Select database
use dorston;

# Show tables
show tables;

# Run queries
select * from users;
```

**Create backup:**
```bash
mysqldump -u root -p dorston > backup-$(date +%Y%m%d-%H%M%S).sql
```

**Restore from backup:**
```bash
mysql -u root -p dorston < backup-file.sql
```

### Working with Redis

**Check if Redis is running:**
```bash
redis-cli ping
# Should return: PONG
```

**Clear Redis cache:**
```bash
redis-cli FLUSHALL
```

**Or from Laravel:**
```bash
php artisan cache:clear
```

## Project Structure

```
dorston/
├── app/                  # Application code
│   ├── Http/            # Controllers, Middleware
│   ├── Models/          # Eloquent models
│   └── ...
├── bootstrap/           # Framework bootstrap
├── config/             # Configuration files
├── database/           # Migrations, seeders
├── public/             # Public assets, entry point
├── resources/          # Views, assets
│   ├── js/            # Vue.js components
│   ├── css/           # Stylesheets
│   └── views/         # Blade templates
├── routes/            # Route definitions
├── storage/           # Logs, cache, uploads
├── tests/             # Automated tests
└── vendor/            # Composer dependencies
```

## Debugging

### Enable Debug Mode

In `.env`:
```env
APP_DEBUG=true
APP_ENV=local
```

**Never enable this in production!**

### View Logs

```bash
# Laravel logs
tail -f storage/logs/laravel.log

# Vite logs
# Already visible in the npm run dev terminal
```

### Laravel Telescope (Optional)

Install Laravel Telescope for advanced debugging:

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

Visit: http://localhost:8000/telescope

### Common Issues

**Issue: Port 8000 already in use**
```bash
# Use a different port
php artisan serve --port=8001
```

**Issue: Permission denied on storage**
```bash
chmod -R 775 storage bootstrap/cache
```

**Issue: MySQL connection refused**
```bash
# Check if MySQL is running
# macOS:
brew services list

# Linux:
sudo systemctl status mysql

# Start MySQL if stopped:
# macOS:
brew services start mysql

# Linux:
sudo systemctl start mysql
```

**Issue: Node packages not found**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: Composer autoload errors**
```bash
composer dump-autoload
```

## IDE Setup

### Visual Studio Code

**Recommended Extensions:**
- Laravel Extension Pack
- PHP Intelephense
- Vue - Official (Volar)
- ESLint
- Prettier
- Tailwind CSS IntelliSense

**Settings (`.vscode/settings.json`):**
```json
{
  "php.suggest.basic": false,
  "php.validate.executablePath": "/usr/bin/php",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[php]": {
    "editor.defaultFormatter": "bmewburn.vscode-intelephense-client"
  }
}
```

### PhpStorm

PhpStorm works great out of the box with Laravel. Enable Laravel plugin:
1. Settings → Plugins → Search "Laravel"
2. Install and enable
3. Settings → Languages & Frameworks → PHP → Laravel → Enable for this project

## Environment Variables

Important `.env` variables for local development:

```env
APP_NAME=Dorston
APP_ENV=local
APP_KEY=base64:... (generated automatically)
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dorston
DB_USERNAME=root
DB_PASSWORD=root

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log  # Emails go to logs in local dev

VITE_APP_NAME="${APP_NAME}"
```

## Git Workflow

```bash
# Create a feature branch
git checkout -b feature/my-new-feature

# Make changes, then:
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/my-new-feature

# Create pull request on GitHub/GitLab
```

## Performance Tips

### Faster Composer Installs
```bash
composer install --optimize-autoloader --no-dev
```

### Faster npm Installs
```bash
npm ci  # Instead of npm install (uses package-lock.json)
```

### Enable OPcache (Production)

In `php.ini`:
```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
opcache.revalidate_freq=60
```

## Next Steps

1. **Read the codebase** - Familiarize yourself with existing code
2. **Run tests** - Make sure everything works: `php artisan test`
3. **Check VERSIONS.md** - Ensure your versions match
4. **Start coding!** - Create your first feature

## Getting Help

- **Laravel Docs:** https://laravel.com/docs
- **Vue.js Docs:** https://vuejs.org/guide/
- **Inertia.js Docs:** https://inertiajs.com/
- **Stack Overflow:** Tag questions with `laravel`, `vue.js`, `inertia`

## Using Makefile Commands

The project includes a Makefile with convenient shortcuts:

```bash
make help        # Show all available commands
make serve       # Start Laravel server
make dev         # Start Vite dev server
make build       # Build assets for production
make phpmyadmin  # Start phpMyAdmin
make artisan CMD="migrate"  # Run artisan commands
```

