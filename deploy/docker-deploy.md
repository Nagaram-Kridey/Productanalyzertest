# Docker Deployment Guide

## 🐳 Docker Compose (Recommended)

```bash
# 1. Setup environment
cp .env.example .env
# Edit .env with your API keys

# 2. Create data directories
mkdir -p data logs

# 3. Deploy with Docker Compose
docker-compose up -d --build

# 4. Check status
docker-compose ps
docker-compose logs -f
```

## 🔧 Single Docker Container

```bash
# 1. Build the image
docker build -t product-analyzer .

# 2. Run the container
docker run -d \
  --name product-analyzer \
  -p 8000:8000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/logs:/app/logs \
  --env-file .env \
  product-analyzer

# 3. Check status
docker ps
docker logs product-analyzer
```

## 📊 Container Management

```bash
# Stop services
docker-compose down

# Restart services
docker-compose restart

# Update and rebuild
docker-compose down
docker-compose up -d --build

# View logs
docker-compose logs -f app

# Access container shell
docker-compose exec app bash
```

## 🔍 Health Monitoring

```bash
# Check health status
curl http://localhost:8000/health

# Monitor container resources
docker stats product-analyzer

# Check service status
docker-compose ps
```