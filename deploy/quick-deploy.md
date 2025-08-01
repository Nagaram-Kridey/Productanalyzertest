# Quick Deployment Guide

## 🚀 One-Command Deployment

1. **Clone and configure**:
   ```bash
   git clone <your-repo-url>
   cd consumable-product-analyzer
   cp .env.example .env
   ```

2. **Edit .env with your API keys**:
   ```bash
   nano .env  # or vim .env
   # Add your OPENAI_API_KEY or ANTHROPIC_API_KEY
   ```

3. **Start the application**:
   ```bash
   ./start.sh
   ```

The script will automatically:
- Detect your environment (Docker/local)
- Install dependencies
- Build the application
- Start all services
- Show you the access URL

## 🌐 Access Points

Once deployed:
- **Application**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🔧 Troubleshooting

If `./start.sh` fails:
1. Check if Docker is installed: `docker --version`
2. Verify API keys in .env file
3. Ensure ports 8000 is available
4. Check logs: `docker-compose logs` (if using Docker)