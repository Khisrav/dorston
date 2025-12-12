.PHONY: help build up down restart logs shell artisan migrate fresh install clean

# Default environment file
ENV_FILE ?= .env.docker.local

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker image
	docker compose build

up: ## Start the application
	docker compose up -d

down: ## Stop the application
	docker compose down

restart: ## Restart the application
	docker compose restart

logs: ## View application logs
	docker compose logs -f app

logs-apache: ## View apache access logs
	docker compose exec app tail -f /var/log/apache2/access.log

logs-error: ## View error logs
	docker compose exec app tail -f /var/log/apache2/error.log

logs-mysql: ## View MySQL logs
	docker compose logs -f mysql

shell: ## Access container shell
	docker compose exec app sh

artisan: ## Run artisan command (usage: make artisan CMD="migrate")
	docker compose exec app php artisan $(CMD)

migrate: ## Run database migrations
	docker compose exec app php artisan migrate

migrate-fresh: ## Reset and re-run all migrations
	docker compose exec app php artisan migrate:fresh --force

seed: ## Run database seeders
	docker compose exec app php artisan db:seed

optimize: ## Optimize the application
	docker compose exec app php artisan optimize

clear-cache: ## Clear all caches
	docker compose exec app php artisan optimize:clear

key-generate: ## Generate application key
	docker compose exec app php artisan key:generate

install: build ## Full installation (build, up, migrations)
	@echo "Building Docker image..."
	@make build
	@echo "Starting containers..."
	@make up
	@sleep 5
	@echo "Running migrations..."
	@APP_RUN_MIGRATIONS=true docker compose up -d --force-recreate app
	@echo "Installation complete! Application is running at http://localhost:8000"

clean: ## Remove all containers, images, and volumes
	docker compose down -v --rmi all --remove-orphans

rebuild: ## Rebuild from scratch
	@make clean
	@make build
	@make up

# Queue-related targets
queue-up: ## Start with queue worker
	docker compose --profile queue up -d

queue-logs: ## View queue worker logs
	docker compose logs -f queue

queue-restart: ## Restart queue worker
	docker compose restart queue

# Production targets
prod-deploy: ## Deploy to production (build and start)
	@echo "Deploying to production..."
	docker compose build --no-cache
	docker compose up -d --force-recreate
	@echo "Running post-deployment tasks..."
	@make optimize
	@echo "Deployment complete!"

prod-migrate: ## Run migrations in production
	docker compose exec app php artisan migrate --force

