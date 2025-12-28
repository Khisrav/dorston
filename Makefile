.PHONY: help build up down restart logs shell artisan migrate fresh install clean

# Default environment file
ENV_FILE ?= .env.example

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
PROJECT_NAME ?= dorston
COMPOSE_PROD = docker compose -p $(PROJECT_NAME) -f compose.prod.yaml

prod-build: ## Build production images
	$(COMPOSE_PROD) build --no-cache

prod-up: ## Start production containers
	$(COMPOSE_PROD) up -d

prod-down: ## Stop production containers
	$(COMPOSE_PROD) down

prod-restart: ## Restart production containers
	$(COMPOSE_PROD) restart

prod-logs: ## View production logs
	$(COMPOSE_PROD) logs -f

prod-ps: ## Show production container status
	$(COMPOSE_PROD) ps

prod-volumes: ## List production volumes
	@docker volume ls | grep $(PROJECT_NAME) || echo "No volumes found"

prod-clean-volumes: ## Remove production volumes (WARNING: This will delete data!)
	@echo "⚠️  WARNING: This will delete ALL data including the database!"
	@read -p "Are you sure? Type 'yes' to continue: " confirm && [ "$$confirm" = "yes" ]
	$(COMPOSE_PROD) down -v

prod-deploy: ## Full production deployment (automated)
	@echo "Starting automated deployment..."
	@./deploy.sh

prod-migrate: ## Run migrations in production
	$(COMPOSE_PROD) exec php-fpm php artisan migrate --force

prod-cache-clear: ## Clear production cache
	$(COMPOSE_PROD) exec php-fpm php artisan cache:clear
	$(COMPOSE_PROD) exec php-fpm php artisan config:clear
	$(COMPOSE_PROD) exec php-fpm php artisan route:clear
	$(COMPOSE_PROD) exec php-fpm php artisan view:clear

prod-optimize: ## Optimize production
	$(COMPOSE_PROD) exec php-fpm php artisan optimize

prod-shell: ## Access production PHP container shell
	$(COMPOSE_PROD) exec php-fpm sh

prod-db-backup: ## Backup production database
	@echo "Creating database backup..."
	@mkdir -p backups
	docker exec $(PROJECT_NAME)-mysql-1 mysqldump -u root -p$${DB_PASSWORD:-root} $${DB_DATABASE:-dorston} > backups/backup-$$(date +%Y%m%d-%H%M%S).sql
	@echo "Backup saved to backups/"

prod-db-restore: ## Restore database from backup (usage: make prod-db-restore FILE=backups/backup.sql)
	@if [ -z "$(FILE)" ]; then echo "Error: Please specify FILE=path/to/backup.sql"; exit 1; fi
	@echo "Restoring database from $(FILE)..."
	docker exec -i $(PROJECT_NAME)-mysql-1 mysql -u root -p$${DB_PASSWORD:-root} $${DB_DATABASE:-dorston} < $(FILE)
	@echo "Database restored!"

