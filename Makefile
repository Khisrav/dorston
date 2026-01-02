.PHONY: help phpmyadmin dev build serve artisan

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

phpmyadmin: ## Start phpMyAdmin server on localhost:8080
	php -S localhost:8080 -t /opt/homebrew/share/phpmyadmin

dev: ## Start Vite development server
	npm run dev

build: ## Build assets for production
	npm run build

serve: ## Start Laravel development server
	php artisan serve

artisan: ## Run artisan command (usage: make artisan CMD="migrate")
	php artisan $(CMD)
