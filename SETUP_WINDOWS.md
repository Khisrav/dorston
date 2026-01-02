# Windows Setup Guide

This guide will help you set up the development environment on Windows.

## Prerequisites

- Windows 10 or 11
- Administrator access

## Installation Steps

### 1. Install Chocolatey (Package Manager)

Open **PowerShell as Administrator** and run:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Close and reopen PowerShell as Administrator for the changes to take effect.

### 2. Install PHP 8.3

```powershell
choco install php --version=8.3.15 -y
```

Verify installation:
```powershell
php -v
```

### 3. Install Composer

```powershell
choco install composer -y
```

Verify:
```powershell
composer --version
```

### 4. Install Node.js 20 LTS

```powershell
choco install nodejs-lts --version=20.11.0 -y
```

Verify:
```powershell
node --version
npm --version
```

### 5. Install MySQL 8.4

**Option A: Using Chocolatey**
```powershell
choco install mysql --version=8.4.7 -y
```

**Option B: Manual Install (Recommended)**
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Run the installer
3. Choose "Developer Default" setup
4. Set root password during installation
5. Start MySQL service

Verify:
```powershell
mysql --version
```

### 6. Install Redis

**For Windows, use Memurai (Redis alternative):**

```powershell
choco install memurai-developer -y
```

Or download from: https://www.memurai.com/

### 7. Install Git (if not already installed)

```powershell
choco install git -y
```

### 8. Clone and Setup Project

Open a new PowerShell window (normal, not admin):

```powershell
# Navigate to your projects directory
cd C:\Users\YourUsername\Projects

# Clone the repository (if not already done)
# git clone your-repo-url dorston
cd dorston

# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Copy .env file
copy .env.example .env

# Generate application key
php artisan key:generate
```

### 9. Configure Database

Open MySQL:
```powershell
mysql -u root -p
```

Create database:
```sql
CREATE DATABASE dorston;
EXIT;
```

### 10. Update .env File

Edit `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dorston
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

### 11. Run Migrations

```powershell
php artisan migrate
```

### 12. Start Development Servers

Open two PowerShell windows:

**Window 1 - Laravel:**
```powershell
cd C:\Users\YourUsername\Projects\dorston
php artisan serve
```

**Window 2 - Vite:**
```powershell
cd C:\Users\YourUsername\Projects\dorston
npm run dev
```

### 13. Access Application

Open your browser and visit:
```
http://localhost:8000
```

## Alternative: Using XAMPP

If you prefer a simpler all-in-one solution:

1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP (includes PHP, MySQL, Apache)
3. Start Apache and MySQL from XAMPP Control Panel
4. Still need to install Node.js and Composer separately
5. Place project in `C:\xampp\htdocs\dorston`

## Troubleshooting

### PHP Extensions Missing

If you get errors about missing PHP extensions, edit `php.ini`:

1. Find php.ini location: `php --ini`
2. Open php.ini in a text editor
3. Uncomment (remove `;`) from these lines:
   ```ini
   extension=curl
   extension=fileinfo
   extension=gd
   extension=mbstring
   extension=openssl
   extension=pdo_mysql
   extension=redis
   extension=zip
   ```
4. Restart PowerShell

### Port Already in Use

If port 8000 is busy, use a different port:
```powershell
php artisan serve --port=8001
```

### Permission Issues

Run PowerShell as Administrator if you encounter permission errors.

### MySQL Connection Issues

1. Ensure MySQL service is running:
   ```powershell
   net start MySQL84
   ```

2. Check if MySQL is listening:
   ```powershell
   netstat -ano | findstr :3306
   ```

## Version Check Script

Create a file `check-versions.ps1`:

```powershell
Write-Host "Checking installed versions..." -ForegroundColor Blue
Write-Host ""
Write-Host "PHP:      " -NoNewline; php -v | Select-Object -First 1
Write-Host "Composer: " -NoNewline; composer --version --no-ansi
Write-Host "Node.js:  " -NoNewline; node --version
Write-Host "npm:      " -NoNewline; npm --version
Write-Host "MySQL:    " -NoNewline; mysql --version
Write-Host "Git:      " -NoNewline; git --version
Write-Host ""
```

Run it:
```powershell
.\check-versions.ps1
```

## Using WSL2 (Alternative Approach)

If you have Windows 11 or Windows 10 (recent versions), you can use WSL2:

1. Install WSL2:
   ```powershell
   wsl --install
   ```

2. Install Ubuntu from Microsoft Store

3. Follow the Linux setup guide inside WSL2

This gives you a Linux environment on Windows!

## IDE Recommendations

- **Visual Studio Code** - Free, excellent Laravel support
  ```powershell
  choco install vscode -y
  ```
  
  Recommended extensions:
  - Laravel Extension Pack
  - PHP Intelephense
  - Vue - Official
  - ESLint
  - Prettier

- **PhpStorm** - Paid, but very powerful
  - 30-day free trial
  - Free for students

## Next Steps

Once everything is installed and working:

1. Read `LOCAL_DEVELOPMENT.md` for development workflow
2. Check `VERSIONS.md` to ensure all versions match
3. Run `php artisan test` to ensure everything works
4. Start coding!

