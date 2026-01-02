# Database Management Tools

This guide covers different ways to access and manage your MySQL database.

## Option 1: phpMyAdmin (Recommended for Beginners)

### Installation on macOS

**Method A: phpMyAdmin App (Easiest)**

```bash
# Install via Homebrew
brew install --cask phpmyadmin

# Open it
open -a phpMyAdmin
```

Access: Open "phpMyAdmin" from your Applications folder

**Method B: Web Interface**

```bash
# Install via Homebrew
brew install phpmyadmin

# Start the server
php -S localhost:8080 -t /opt/homebrew/share/phpmyadmin

# Visit in browser
open http://localhost:8080
```

Login with your MySQL credentials:
- **Username:** root (or your MySQL user)
- **Password:** (your MySQL password)

### Installation on Linux

```bash
# Install phpMyAdmin
sudo apt install phpmyadmin

# During installation:
# - Choose apache2 or nginx (or 'none' if you'll use PHP's built-in server)
# - Configure with dbconfig-common: Yes
# - Set phpMyAdmin password

# Using PHP built-in server (no web server needed)
php -S localhost:8080 -t /usr/share/phpmyadmin

# Visit: http://localhost:8080
```

### Installation on Windows

1. Download from: https://www.phpmyadmin.net/downloads/
2. Extract to `C:\phpmyadmin`
3. Open terminal in that directory
4. Run: `php -S localhost:8080`
5. Visit: http://localhost:8080

### phpMyAdmin Features

✅ Visual database browser
✅ Run SQL queries with syntax highlighting
✅ Import/Export databases
✅ Manage users and permissions
✅ View table structures
✅ Edit data with a GUI

## Option 2: MySQL Command Line

**Access MySQL CLI:**

```bash
# Connect to MySQL
mysql -u root -p

# Enter your password when prompted
```

**Common commands:**

```sql
-- List databases
SHOW DATABASES;

-- Select a database
USE dorston;

-- List tables
SHOW TABLES;

-- View table structure
DESCRIBE users;

-- Run queries
SELECT * FROM users;

-- Create database
CREATE DATABASE mydb;

-- Delete database
DROP DATABASE mydb;

-- Exit
EXIT;
```

**Tips:**
- Press `↑` to recall previous commands
- End statements with `;`
- Use `\c` to cancel a command
- Use `help` for built-in help

## Option 3: TablePlus (Recommended GUI)

**Best GUI client for Mac/Windows/Linux**

### Installation

**macOS:**
```bash
brew install --cask tableplus
```

**Windows/Linux:**
Download from https://tableplus.com

### Features

✨ Beautiful, modern interface
✨ Multiple database support (MySQL, PostgreSQL, SQLite, etc.)
✨ SQL editor with autocomplete
✨ Visual query builder
✨ Dark mode support
✨ Free tier available

### Setup

1. Open TablePlus
2. Click "Create a new connection"
3. Choose MySQL
4. Enter credentials:
   - **Host:** 127.0.0.1
   - **Port:** 3306
   - **User:** root
   - **Password:** (your password)
   - **Database:** dorston (optional)
5. Click "Connect"

## Option 4: Sequel Ace (macOS Only)

**Free, native macOS app**

### Installation

```bash
brew install --cask sequel-ace
```

Or download from: https://sequel-ace.com

### Setup

1. Open Sequel Ace
2. Click "+" to add connection
3. Enter:
   - **Name:** Dorston Local
   - **Host:** 127.0.0.1
   - **Username:** root
   - **Password:** (your password)
   - **Database:** dorston
4. Click "Connect"

## Option 5: VS Code Extensions

### Install MySQL Extension

1. Open VS Code
2. Go to Extensions (⌘+Shift+X)
3. Search for "MySQL"
4. Install "MySQL" by cweijan

### Connect

1. Click MySQL icon in sidebar
2. Click "+" to add connection
3. Enter credentials
4. Browse databases visually

### Features

✅ Execute queries in VS Code
✅ View query results
✅ Export results
✅ Integrated with your code editor

## Option 6: Laravel's Built-in Tools

### Tinker (Laravel REPL)

```bash
# Start Tinker
php artisan tinker

# Query directly in PHP
>>> DB::table('users')->get();
>>> User::all();
>>> DB::select('SELECT * FROM users');
```

### DB Commands

```bash
# Show database info
php artisan db:show

# Show table info
php artisan db:table users

# Monitor database
php artisan db:monitor
```

## Comparison

| Tool | Pros | Cons | Best For |
|------|------|------|----------|
| **phpMyAdmin** | Free, Web-based, Feature-rich | Can be slow, Requires PHP | Beginners, Quick tasks |
| **MySQL CLI** | Fast, Always available, Lightweight | Terminal-only, Less visual | Quick queries, Scripts |
| **TablePlus** | Beautiful UI, Multi-DB, Fast | Paid (with free tier) | Professional use |
| **Sequel Ace** | Free, Native macOS, Fast | macOS only | Mac users |
| **VS Code** | Integrated, No context switch | Less features | Developers in VS Code |
| **Laravel Tinker** | Direct model access, PHP syntax | Not visual | Laravel-specific tasks |

## Quick Start Guide by Use Case

### "I want to browse my database"
→ Use **TablePlus** or **phpMyAdmin**

### "I need to run a quick query"
→ Use **MySQL CLI** or **Laravel Tinker**

### "I want to import a SQL file"
→ Use **phpMyAdmin** or **MySQL CLI**

### "I need to export data"
→ Use **phpMyAdmin** or `mysqldump`

### "I'm already in VS Code"
→ Use **MySQL Extension for VS Code**

## Common Tasks

### Backup Database

**Using mysqldump:**
```bash
# Backup single database
mysqldump -u root -p dorston > backup.sql

# Backup all databases
mysqldump -u root -p --all-databases > all-backup.sql

# Backup with date
mysqldump -u root -p dorston > backup-$(date +%Y%m%d).sql
```

**Using phpMyAdmin:**
1. Select database
2. Click "Export"
3. Choose "Quick" or "Custom"
4. Click "Go"

### Restore Database

**Using MySQL CLI:**
```bash
mysql -u root -p dorston < backup.sql
```

**Using phpMyAdmin:**
1. Select database
2. Click "Import"
3. Choose file
4. Click "Go"

### Create New Database

**MySQL CLI:**
```bash
mysql -u root -p -e "CREATE DATABASE newdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

**phpMyAdmin:**
1. Click "New" in sidebar
2. Enter database name
3. Choose utf8mb4_unicode_ci
4. Click "Create"

### Create Database User

**MySQL CLI:**
```sql
-- Create user
CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';

-- Grant privileges
GRANT ALL PRIVILEGES ON dorston.* TO 'newuser'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;
```

**phpMyAdmin:**
1. Click "User accounts"
2. Click "Add user account"
3. Fill in details
4. Choose privileges
5. Click "Go"

## Troubleshooting

### Can't Connect to MySQL

```bash
# Check if MySQL is running
brew services list | grep mysql  # macOS
sudo systemctl status mysql      # Linux

# Start MySQL
brew services start mysql        # macOS
sudo systemctl start mysql       # Linux

# Check MySQL socket
ls -la /tmp/mysql.sock
```

### "Access denied for user 'root'@'localhost'"

```bash
# Reset root password (macOS)
brew services stop mysql
mysqld_safe --skip-grant-tables &
mysql -u root
# In MySQL:
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
EXIT;
# Restart MySQL normally
```

### phpMyAdmin Shows Blank Page

```bash
# Check PHP version
php -v

# Check phpMyAdmin directory
ls -la /opt/homebrew/share/phpmyadmin

# Check PHP error log
tail -f /opt/homebrew/var/log/php-fpm.log
```

### Connection Timeout

Check your `.env` file:
```env
DB_HOST=127.0.0.1  # Not 'localhost'
DB_PORT=3306
```

## Security Tips

1. **Never use root in production**
   - Create specific users with limited privileges

2. **Use strong passwords**
   ```bash
   # Generate random password
   openssl rand -base64 32
   ```

3. **Secure your MySQL installation**
   ```bash
   mysql_secure_installation
   ```

4. **Don't expose phpMyAdmin publicly**
   - Only run locally
   - Use VPN for remote access

5. **Regular backups**
   ```bash
   # Add to crontab
   0 2 * * * mysqldump -u root -p'password' dorston > /backups/dorston-$(date +\%Y\%m\%d).sql
   ```

## Recommended Setup

For **local development**, I recommend:

1. **Primary tool:** TablePlus or Sequel Ace
   - Beautiful UI, fast, professional

2. **Quick access:** MySQL CLI
   - For quick queries and scripts

3. **Emergency/learning:** phpMyAdmin
   - When you need a web interface

4. **Integrated:** VS Code MySQL extension
   - When working in VS Code

Choose what fits your workflow best! 🚀

