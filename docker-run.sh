#!/bin/bash

# MoneyRAG Docker Run Script
# Runs backend and frontend as separate containers via docker-compose

set -e

echo "MoneyRAG Docker Setup"
echo "========================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo ""
echo "Choose an option:"
echo "1) Build and run (first time or after code changes)"
echo "2) Run existing containers"
echo "3) Stop containers"
echo "4) View logs"
echo "5) Clean up (remove containers and images)"
echo ""
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo "Building Docker images..."
        docker compose build
        echo "Starting containers..."
        docker compose up -d
        echo "Backend  running at http://localhost:7860"
        echo "Frontend running at http://localhost:8081"
        echo "View logs with: docker compose logs -f"
        ;;
    2)
        echo "Starting containers..."
        docker compose up -d
        echo "Backend  running at http://localhost:7860"
        echo "Frontend running at http://localhost:8081"
        ;;
    3)
        echo "Stopping containers..."
        docker compose down
        echo "Containers stopped"
        ;;
    4)
        echo "Showing logs (Ctrl+C to exit)..."
        docker compose logs -f
        ;;
    5)
        echo "Cleaning up..."
        docker compose down -v --rmi local
        echo "Cleanup complete"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
