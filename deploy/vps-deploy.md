# VPS/Self-Hosted Deployment Guide

## 🖥️ Ubuntu/Debian VPS Setup

### **Step 1: Server Preparation**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### **Step 2: Setup Application**
```bash
# Clone repository
git clone <your-repo-url> /opt/product-analyzer
cd /opt/product-analyzer

# Setup environment
cp .env.example .env
nano .env  # Add your API keys

# Create directories
sudo mkdir -p /opt/product-analyzer/{data,logs}
sudo chown -R $USER:$USER /opt/product-analyzer
```

### **Step 3: Configure Nginx**
```nginx
# /etc/nginx/sites-available/product-analyzer
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location /static/ {
        proxy_pass http://localhost:8000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        proxy_pass http://localhost:8000/health;
        access_log off;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/product-analyzer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### **Step 4: Deploy Application**
```bash
# Start application
cd /opt/product-analyzer
docker-compose up -d --build

# Check status
docker-compose ps
docker-compose logs -f
```

### **Step 5: Setup Systemd Service**
```bash
# Create systemd service
sudo tee /etc/systemd/system/product-analyzer.service > /dev/null <<EOF
[Unit]
Description=Product Analyzer Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/product-analyzer
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl enable product-analyzer.service
sudo systemctl start product-analyzer.service
```

## 🔧 Production Optimizations

### **Database Configuration (PostgreSQL)**
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Create database and user
sudo -u postgres createuser --interactive
sudo -u postgres createdb product_analyzer

# Update .env
echo "DATABASE_URL=postgresql://username:password@localhost:5432/product_analyzer" >> .env
```

### **Redis Cache Setup**
```bash
# Install Redis
sudo apt install redis-server -y

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: maxmemory 256mb
# Set: maxmemory-policy allkeys-lru

sudo systemctl restart redis-server

# Update .env
echo "REDIS_URL=redis://localhost:6379/0" >> .env
```

### **Monitoring Setup**
```bash
# Install monitoring tools
sudo apt install htop iotop netstat-nat -y

# Setup log rotation
sudo tee /etc/logrotate.d/product-analyzer > /dev/null <<EOF
/opt/product-analyzer/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker-compose -f /opt/product-analyzer/docker-compose.yml restart app
    endscript
}
EOF
```

## 🔒 Security Hardening

### **Firewall Configuration**
```bash
# Setup UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Optional: Change SSH port
sudo nano /etc/ssh/sshd_config
# Change: Port 2222
sudo systemctl restart ssh
sudo ufw allow 2222
```

### **Fail2Ban Setup**
```bash
# Install Fail2Ban
sudo apt install fail2ban -y

# Configure Fail2Ban
sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
logpath = /var/log/nginx/error.log

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 📊 Performance Optimization

### **Nginx Optimizations**
```nginx
# Add to /etc/nginx/nginx.conf
worker_processes auto;
worker_connections 1024;

gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

server {
    # ... existing config ...
    
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:8000;
        # ... other proxy settings ...
    }
}
```

### **Docker Optimizations**
```yaml
# Update docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
        reservations:
          cpus: '1.0'
          memory: 2G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## 🔍 Monitoring and Maintenance

### **Automated Backups**
```bash
# Create backup script
sudo tee /opt/backup-product-analyzer.sh > /dev/null <<'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
docker-compose -f /opt/product-analyzer/docker-compose.yml exec -T db pg_dump -U username product_analyzer > $BACKUP_DIR/db_backup_$DATE.sql

# Backup application data
tar -czf $BACKUP_DIR/data_backup_$DATE.tar.gz /opt/product-analyzer/data

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
EOF

chmod +x /opt/backup-product-analyzer.sh

# Add to crontab
echo "0 2 * * * /opt/backup-product-analyzer.sh" | sudo crontab -
```

### **System Monitoring**
```bash
# Create monitoring script
sudo tee /opt/monitor-product-analyzer.sh > /dev/null <<'EOF'
#!/bin/bash
# Check if application is running
if ! curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "$(date): Application health check failed, restarting..." >> /var/log/product-analyzer-monitor.log
    cd /opt/product-analyzer
    docker-compose restart app
fi

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 85 ]; then
    echo "$(date): Disk usage is ${DISK_USAGE}%" >> /var/log/product-analyzer-monitor.log
fi
EOF

chmod +x /opt/monitor-product-analyzer.sh

# Add to crontab (check every 5 minutes)
echo "*/5 * * * * /opt/monitor-product-analyzer.sh" | sudo crontab -
```

## 💰 Cost Estimation (VPS)

**Monthly Costs:**
- VPS (2 CPU, 4GB RAM): $10-25
- Domain + SSL: $10-15
- Backup storage: $5
- **Total: $25-45/month**

## 🆘 Troubleshooting

```bash
# Check application logs
docker-compose logs -f app

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check system resources
htop
df -h

# Restart services
sudo systemctl restart nginx
docker-compose restart

# Update application
cd /opt/product-analyzer
git pull
docker-compose down
docker-compose up -d --build
```