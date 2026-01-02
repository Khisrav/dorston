# Interactive Setup Guide

The setup scripts have been updated to be **fully interactive**, giving you control over what gets installed and how.

## What's New

### ✨ Interactive Features

1. **Version Detection** - Checks what's already installed
2. **Smart Choices** - Options when versions don't match
3. **Confirmation Prompts** - You approve each action
4. **Multiple Options** - Choose how to handle conflicts
5. **Database Setup Wizard** - Interactive database configuration
6. **Service Management** - Choose whether to start services
7. **Verification** - Optional setup verification at the end

### 🎯 Key Improvements

#### Before
```bash
./scripts/setup-macos.sh
# Installs everything automatically, no questions asked
```

#### After
```bash
./scripts/setup-macos.sh
# Asks before each action:
# - What to install
# - How to handle version conflicts
# - Whether to start services
# - Database setup preferences
```

## Interactive Scenarios

### Scenario 1: Existing PHP Installation

**Old Behavior:**
- Installs PHP 8.3 regardless of what you have
- May break existing projects

**New Behavior:**
```
✓ PHP 8.2.15 is installed
⚠ Required version: PHP 8.3

What would you like to do?
  1) Install PHP 8.3 alongside current version
  2) Replace current PHP with PHP 8.3
  3) Keep current PHP and skip
  4) Exit setup

Choose an option [1-4]:
```

### Scenario 2: Node.js Version Mismatch

**New Behavior:**
```
✓ Node.js v18.19.0 is installed
⚠ Required version: Node.js 20.x LTS

What would you like to do?
  1) Install Node.js 20 alongside current version
  2) Replace current Node.js with v20
  3) Keep current Node.js and skip
  4) Install nvm (Node Version Manager) for easy switching

Choose an option [1-4]:
```

### Scenario 3: Database Setup

**New Behavior:**
```
Do you want to set up the database now? [y/N]: y

Database Setup
==============
Enter database name [dorston]: myproject
Enter MySQL username [root]: dbuser
Enter MySQL password: ********

✓ Database created
✓ .env updated with database credentials

Run database migrations now? [y/N]: y
✓ Migrations completed

Run database seeders? [y/N]: n
```

### Scenario 4: Existing Dependencies

**New Behavior:**
```
✓ Composer dependencies already installed
Reinstall/update Composer dependencies? [y/N]: n

✓ Node dependencies already installed
Reinstall/update Node dependencies? [y/N]: y

How would you like to install Node dependencies?
  1) npm install (standard)
  2) npm ci (clean install from lock file)
  3) npm install --force (force reinstall)
  4) Skip

Choose an option [1-4]:
```

## Running the Interactive Setup

### macOS
```bash
cd /path/to/dorston
./scripts/setup-macos.sh
```

The script will:
1. Check Homebrew installation
2. Ask about updating package lists
3. Check each dependency (PHP, Composer, Node.js, MySQL, Redis)
4. Offer options for conflicts
5. Help set up the project
6. Optionally configure database
7. Show summary and verification

### Linux (Ubuntu/Debian)
```bash
cd /path/to/dorston
./scripts/setup-linux.sh
```

Similar flow to macOS version.

### Windows
See `SETUP_WINDOWS.md` for manual installation steps.

## Tips for Using Interactive Scripts

### 1. Review Before Running
The script will show you what it plans to do before making changes.

### 2. Safe Defaults
Most prompts have safe defaults:
- `[Y/n]` means "Yes" is default (just press Enter)
- `[y/N]` means "No" is default

### 3. You Can Exit Anytime
Press `Ctrl+C` to cancel the script at any time. No changes are permanent until you confirm.

### 4. Re-run Safely
The script is idempotent - you can run it multiple times safely:
```bash
./scripts/setup-macos.sh
# First run: installs everything

./scripts/setup-macos.sh
# Second run: detects existing installations, asks if you want to update
```

### 5. Version Switching
If you need different PHP or Node versions for different projects:

**PHP:**
```bash
# Install multiple versions
brew install php@8.2 php@8.3

# Switch versions
brew unlink php@8.2
brew link php@8.3 --force

# Or use update-alternatives on Linux
sudo update-alternatives --config php
```

**Node.js (using nvm):**
```bash
# Install nvm (option 4 in the script)
nvm install 18
nvm install 20

# Switch versions
nvm use 18  # For older project
nvm use 20  # For this project
```

## Common Questions

### Q: What if I choose the wrong option?
**A:** Most actions can be reversed:
- Installed wrong version? Run the script again and choose differently
- Started a service? Stop it with `brew services stop <service>`
- Database issue? Drop and recreate it

### Q: Can I skip steps?
**A:** Yes! The script allows you to skip:
- Updating packages
- Installing specific tools
- Database setup
- Starting services
- Running migrations

### Q: What gets modified?
**A:** The script may modify:
- `/usr/local/bin/` (for global commands)
- `~/.zshrc` or `~/.bashrc` (PATH additions)
- Project `.env` file (if you choose database setup)
- System services (if you choose to start them)

**Never modified:**
- Existing project files
- Other projects' dependencies
- System files (beyond package installation)

### Q: How do I undo everything?
**A:** To completely remove installations:

```bash
# macOS
brew uninstall php@8.3 composer node@20 mysql redis

# Linux
sudo apt remove php8.3* composer nodejs mysql-server redis-server
```

### Q: The script failed midway. Now what?
**A:** Just run it again! The script:
- Detects what's already installed
- Skips completed steps
- Continues from where it left off

## Troubleshooting

### Script Won't Run
```bash
# Make it executable
chmod +x scripts/setup-macos.sh

# Or run with bash
bash scripts/setup-macos.sh
```

### Prompts Don't Appear
Your terminal might not support interactive input. Try:
```bash
# Use a different terminal
# Or run non-interactively (not recommended)
yes | ./scripts/setup-macos.sh
```

### "Command not found" After Installation
```bash
# Reload your shell configuration
source ~/.zshrc  # or ~/.bashrc

# Or restart your terminal
```

### Package Installation Fails
```bash
# Update Homebrew (macOS)
brew update && brew upgrade

# Update apt (Linux)
sudo apt update && sudo apt upgrade
```

## Advanced Usage

### Environment Variables

Control the script with environment variables:

```bash
# Skip all prompts, use defaults
export NONINTERACTIVE=1
./scripts/setup-macos.sh

# Specify versions
export PHP_VERSION=8.3
export NODE_VERSION=20
./scripts/setup-macos.sh
```

### Automation

For CI/CD or automated setups:

```bash
# Create a response file
cat > responses.txt << EOF
y
1
y
y
EOF

# Use it with the script
./scripts/setup-macos.sh < responses.txt
```

## Comparison: Old vs New

| Feature | Old Script | New Interactive Script |
|---------|-----------|----------------------|
| Version checking | ❌ Installs blindly | ✅ Detects & offers choices |
| Conflicts | ❌ May break things | ✅ Offers safe options |
| User control | ❌ All or nothing | ✅ Granular control |
| Re-runnable | ⚠️ May cause issues | ✅ Fully safe |
| Database setup | ❌ Manual | ✅ Interactive wizard |
| Service management | ❌ Auto-starts all | ✅ Ask for each |
| Verification | ❌ None | ✅ Optional at end |
| Error recovery | ❌ Start over | ✅ Resume from failure |

## Next Steps

After running the interactive setup:

1. **Verify installation:**
   ```bash
   ./scripts/verify-setup.sh
   ```

2. **Read the development guide:**
   See `LOCAL_DEVELOPMENT.md` for daily workflows

3. **Start coding:**
   ```bash
   php artisan serve
   npm run dev
   ```

## Feedback

The interactive scripts are designed to be helpful and non-destructive. If you encounter issues or have suggestions for improvements, please let us know!

