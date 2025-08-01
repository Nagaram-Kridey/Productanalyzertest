# AWS Cloud Deployment Guide

## 🚀 AWS ECS with Fargate (Recommended)

### **Step 1: Prerequisites**
```bash
# Install AWS CLI
pip install awscli
aws configure

# Install ECS CLI
curl -Lo ecs-cli https://amazon-ecs-cli.s3.amazonaws.com/ecs-cli-linux-amd64-latest
chmod +x ecs-cli && sudo mv ecs-cli /usr/local/bin/
```

### **Step 2: Create AWS Resources**

1. **Create RDS PostgreSQL Database**:
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier product-analyzer-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --engine-version 13.7 \
     --allocated-storage 20 \
     --db-name product_analyzer \
     --master-username dbadmin \
     --master-user-password YourSecurePassword123 \
     --vpc-security-group-ids sg-xxxxxxxxx
   ```

2. **Create ElastiCache Redis (Optional)**:
   ```bash
   aws elasticache create-cache-cluster \
     --cache-cluster-id product-analyzer-redis \
     --cache-node-type cache.t3.micro \
     --engine redis \
     --num-cache-nodes 1
   ```

### **Step 3: Deploy to ECS**

1. **Create ECS Cluster**:
   ```bash
   ecs-cli configure --cluster product-analyzer-cluster \
     --default-launch-type FARGATE \
     --config-name product-analyzer \
     --region us-east-1

   ecs-cli configure profile --access-key AWS_ACCESS_KEY_ID \
     --secret-key AWS_SECRET_ACCESS_KEY \
     --profile-name product-analyzer-profile

   ecs-cli up --cluster-config product-analyzer \
     --ecs-profile product-analyzer-profile
   ```

2. **Deploy Application**:
   ```bash
   # Build and push to ECR
   aws ecr create-repository --repository-name product-analyzer
   
   $(aws ecr get-login --no-include-email --region us-east-1)
   
   docker build -t product-analyzer .
   docker tag product-analyzer:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/product-analyzer:latest
   docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/product-analyzer:latest

   # Deploy with ECS CLI
   ecs-cli compose --project-name product-analyzer \
     --file docker-compose.yml \
     --cluster-config product-analyzer \
     --ecs-profile product-analyzer-profile \
     service up --create-log-groups
   ```

### **Step 4: Configure Load Balancer**

```bash
# Create Application Load Balancer
aws elbv2 create-load-balancer \
  --name product-analyzer-alb \
  --subnets subnet-xxxxxxxx subnet-yyyyyyyy \
  --security-groups sg-xxxxxxxxx

# Create target group
aws elbv2 create-target-group \
  --name product-analyzer-targets \
  --protocol HTTP \
  --port 8000 \
  --vpc-id vpc-xxxxxxxxx \
  --health-check-path /health
```

## 📊 Cost Optimization

**Estimated Monthly Costs:**
- ECS Fargate (2 tasks): ~$30-50
- RDS t3.micro: ~$15-20
- ALB: ~$20
- Data transfer: ~$5-10
- **Total: ~$70-100/month**

## 🔒 Security Configuration

1. **Environment Variables** (use AWS Secrets Manager):
   ```bash
   aws secretsmanager create-secret \
     --name product-analyzer/openai-key \
     --secret-string "your-openai-api-key"
   ```

2. **VPC Security Groups**:
   - ALB: Allow HTTP/HTTPS from 0.0.0.0/0
   - ECS: Allow 8000 from ALB security group
   - RDS: Allow 5432 from ECS security group

## 🔍 Monitoring

```bash
# CloudWatch logs
aws logs describe-log-groups --log-group-name-prefix /ecs/product-analyzer

# ECS service status
aws ecs describe-services --cluster product-analyzer-cluster \
  --services product-analyzer-service
```