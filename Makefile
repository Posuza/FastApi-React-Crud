.PHONY: help dev prod backend frontend stop clean logs build

help:
    @echo "Available commands:"
    @echo "  dev         - Start development environment"
    @echo "  prod        - Start production environment"
    @echo "  backend     - Run only backend + database"
    @echo "  frontend    - Run only frontend"
    @echo "  stop        - Stop all services"
    @echo "  clean       - Remove all containers and volumes"
    @echo "  logs        - View logs for all services"
    @echo "  build       - Rebuild all services"

dev:
    @echo "Starting development environment..."
    docker-compose up --build

prod:
    @echo "Starting production environment..."
    docker-compose -f docker-compose.prod.yml up -d --build

backend:
    @echo "Starting backend development environment..."
    cd backEnd && docker-compose -f docker-compose.dev.yml up --build

frontend:
    @echo "Starting frontend development environment..."
    cd frontEnd && docker-compose -f docker-compose.dev.yml up --build

stop:
    @echo "Stopping all services..."
    docker-compose down || true
    docker-compose -f docker-compose.prod.yml down || true
    cd backEnd && docker-compose -f docker-compose.dev.yml down || true
    cd frontEnd && docker-compose -f docker-compose.dev.yml down || true

clean:
    @echo "Cleaning up everything..."
    docker-compose down -v || true
    docker-compose -f docker-compose.prod.yml down -v || true
    cd backEnd && docker-compose -f docker-compose.dev.yml down -v || true
    cd frontEnd && docker-compose -f docker-compose.dev.yml down -v || true
    docker system prune -f

logs:
    docker-compose logs -f

build:
    docker-compose build --no-cache