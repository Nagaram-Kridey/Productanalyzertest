#!/bin/bash

# Consumable Product Risk Analyzer - Startup Script

echo "🧪 Starting Consumable Product Risk Analyzer..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    cp .env.example .env
    print_warning "Please edit .env file with your API keys before continuing."
    print_warning "You need at least one of: OPENAI_API_KEY or ANTHROPIC_API_KEY"
    echo "Press Enter to continue once you've configured your .env file..."
    read
fi

# Check for required environment variables
source .env

if [ -z "$OPENAI_API_KEY" ] && [ -z "$ANTHROPIC_API_KEY" ]; then
    print_error "No AI API keys found in .env file!"
    print_error "Please set either OPENAI_API_KEY or ANTHROPIC_API_KEY"
    exit 1
fi

# Check if Docker is available
if command -v docker-compose &> /dev/null; then
    print_status "Docker Compose found. Starting with Docker..."
    
    # Create necessary directories
    mkdir -p data logs
    
    # Build and start services
    print_status "Building and starting services..."
    docker-compose up --build
    
elif command -v docker &> /dev/null; then
    print_status "Docker found. Building and running container..."
    
    # Create necessary directories
    mkdir -p data logs
    
    # Build the image
    print_status "Building Docker image..."
    docker build -t product-analyzer .
    
    # Run the container
    print_status "Starting container..."
    docker run -d \
        -p 8000:8000 \
        -v "$(pwd)/data:/app/data" \
        -v "$(pwd)/logs:/app/logs" \
        --env-file .env \
        --name product-analyzer \
        product-analyzer
    
    print_success "Container started successfully!"
    print_status "Access the application at: http://localhost:8000"
    
else
    # Local development setup
    print_warning "Docker not found. Setting up for local development..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is required but not installed."
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is required but not installed."
        exit 1
    fi
    
    print_status "Installing Python dependencies..."
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    pip install -r requirements.txt
    
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    
    print_status "Building frontend..."
    npm run build
    cd ..
    
    print_status "Starting backend server..."
    cd backend
    python -m uvicorn main:app --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    cd ..
    
    print_success "Application started successfully!"
    print_status "Backend: http://localhost:8000"
    print_status "API Docs: http://localhost:8000/docs"
    
    # Handle graceful shutdown
    trap "kill $BACKEND_PID" EXIT
    
    print_status "Press Ctrl+C to stop the server..."
    wait $BACKEND_PID
fi