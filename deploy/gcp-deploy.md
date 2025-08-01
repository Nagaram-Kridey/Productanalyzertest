# Google Cloud Platform Deployment Guide

## 🚀 Google Cloud Run (Serverless - Recommended)

### **Step 1: Setup Google Cloud**
```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Set project
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com
gcloud services enable sql-component.googleapis.com
```

### **Step 2: Build and Deploy**

```bash
# 1. Build and push to Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/product-analyzer

# 2. Deploy to Cloud Run
gcloud run deploy product-analyzer \
  --image gcr.io/YOUR_PROJECT_ID/product-analyzer \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY=your_key_here \
  --set-env-vars ANTHROPIC_API_KEY=your_key_here \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --port 8000
```

### **Step 3: Setup Cloud SQL (PostgreSQL)**

```bash
# 1. Create SQL instance
gcloud sql instances create product-analyzer-db \
  --database-version POSTGRES_13 \
  --tier db-f1-micro \
  --region us-central1

# 2. Create database and user
gcloud sql databases create product_analyzer \
  --instance product-analyzer-db

gcloud sql users create dbuser \
  --instance product-analyzer-db \
  --password your_secure_password

# 3. Get connection string
gcloud sql instances describe product-analyzer-db \
  --format="value(connectionName)"
```

### **Step 4: Connect Cloud Run to Cloud SQL**

```bash
# Update Cloud Run service with Cloud SQL connection
gcloud run services update product-analyzer \
  --add-cloudsql-instances YOUR_PROJECT_ID:us-central1:product-analyzer-db \
  --set-env-vars DATABASE_URL="postgresql://dbuser:your_secure_password@/product_analyzer?host=/cloudsql/YOUR_PROJECT_ID:us-central1:product-analyzer-db" \
  --region us-central1
```

## 🔧 Alternative: Google Kubernetes Engine (GKE)

### **Step 1: Create GKE Cluster**
```bash
# Create cluster
gcloud container clusters create product-analyzer-cluster \
  --num-nodes 3 \
  --machine-type e2-medium \
  --zone us-central1-a

# Get credentials
gcloud container clusters get-credentials product-analyzer-cluster \
  --zone us-central1-a
```

### **Step 2: Deploy with Kubernetes**

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: product-analyzer
spec:
  replicas: 3
  selector:
    matchLabels:
      app: product-analyzer
  template:
    metadata:
      labels:
        app: product-analyzer
    spec:
      containers:
      - name: product-analyzer
        image: gcr.io/YOUR_PROJECT_ID/product-analyzer
        ports:
        - containerPort: 8000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-keys
              key: openai-key
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
---
apiVersion: v1
kind: Service
metadata:
  name: product-analyzer-service
spec:
  selector:
    app: product-analyzer
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

```bash
# Deploy
kubectl apply -f k8s-deployment.yaml
kubectl get services
```

## 📊 Cost Optimization (Cloud Run)

**Estimated Monthly Costs:**
- Cloud Run (pay-per-request): ~$10-30
- Cloud SQL db-f1-micro: ~$7-15
- Container Registry: ~$1-5
- **Total: ~$18-50/month**

## 🔒 Security Configuration

```bash
# Create secrets
kubectl create secret generic api-keys \
  --from-literal=openai-key=your_openai_key \
  --from-literal=anthropic-key=your_anthropic_key

# Update Cloud Run with secrets
gcloud run services update product-analyzer \
  --update-env-vars OPENAI_API_KEY=$(gcloud secrets versions access latest --secret="openai-key") \
  --region us-central1
```

## 🔍 Monitoring

```bash
# View logs
gcloud run services logs read product-analyzer \
  --region us-central1

# Monitor performance
gcloud run services describe product-analyzer \
  --region us-central1
```