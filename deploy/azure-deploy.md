# Microsoft Azure Deployment Guide

## 🚀 Azure Container Instances (ACI) - Simple

### **Step 1: Setup Azure CLI**
```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
az login

# Create resource group
az group create --name product-analyzer-rg --location eastus
```

### **Step 2: Deploy to Container Registry**
```bash
# Create container registry
az acr create --resource-group product-analyzer-rg \
  --name productanalyzerregistry \
  --sku Basic \
  --admin-enabled true

# Build and push image
az acr build --registry productanalyzerregistry \
  --image product-analyzer:latest .

# Get login server
az acr show --name productanalyzerregistry \
  --query loginServer --output table
```

### **Step 3: Deploy Container Instance**
```bash
# Create container instance
az container create \
  --resource-group product-analyzer-rg \
  --name product-analyzer-app \
  --image productanalyzerregistry.azurecr.io/product-analyzer:latest \
  --cpu 2 \
  --memory 4 \
  --registry-username productanalyzerregistry \
  --registry-password $(az acr credential show --name productanalyzerregistry --query "passwords[0].value" -o tsv) \
  --dns-name-label product-analyzer-unique \
  --ports 8000 \
  --environment-variables \
    OPENAI_API_KEY=your_openai_key \
    ANTHROPIC_API_KEY=your_anthropic_key \
    DATABASE_URL=sqlite:///./data/product_analyzer.db
```

## 🔧 Azure App Service (PaaS)

### **Step 1: Create App Service Plan**
```bash
# Create App Service plan
az appservice plan create \
  --name product-analyzer-plan \
  --resource-group product-analyzer-rg \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --resource-group product-analyzer-rg \
  --plan product-analyzer-plan \
  --name product-analyzer-webapp \
  --deployment-container-image-name productanalyzerregistry.azurecr.io/product-analyzer:latest
```

### **Step 2: Configure App Settings**
```bash
# Set environment variables
az webapp config appsettings set \
  --resource-group product-analyzer-rg \
  --name product-analyzer-webapp \
  --settings \
    OPENAI_API_KEY=your_openai_key \
    ANTHROPIC_API_KEY=your_anthropic_key \
    WEBSITES_PORT=8000
```

## 🗄️ Azure Database for PostgreSQL

### **Step 1: Create PostgreSQL Server**
```bash
# Create PostgreSQL server
az postgres server create \
  --resource-group product-analyzer-rg \
  --name product-analyzer-postgres \
  --location eastus \
  --admin-user dbadmin \
  --admin-password YourSecurePassword123 \
  --sku-name B_Gen5_1 \
  --version 11

# Create database
az postgres db create \
  --resource-group product-analyzer-rg \
  --server-name product-analyzer-postgres \
  --name product_analyzer

# Configure firewall
az postgres server firewall-rule create \
  --resource-group product-analyzer-rg \
  --server product-analyzer-postgres \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### **Step 2: Update Database Connection**
```bash
# Update app with PostgreSQL connection
az webapp config appsettings set \
  --resource-group product-analyzer-rg \
  --name product-analyzer-webapp \
  --settings \
    DATABASE_URL="postgresql://dbadmin:YourSecurePassword123@product-analyzer-postgres.postgres.database.azure.com:5432/product_analyzer"
```

## ⚙️ Azure Kubernetes Service (AKS)

### **Step 1: Create AKS Cluster**
```bash
# Create AKS cluster
az aks create \
  --resource-group product-analyzer-rg \
  --name product-analyzer-aks \
  --node-count 2 \
  --node-vm-size Standard_B2s \
  --generate-ssh-keys \
  --attach-acr productanalyzerregistry

# Get credentials
az aks get-credentials \
  --resource-group product-analyzer-rg \
  --name product-analyzer-aks
```

### **Step 2: Deploy to AKS**
```yaml
# azure-k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: product-analyzer
spec:
  replicas: 2
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
        image: productanalyzerregistry.azurecr.io/product-analyzer:latest
        ports:
        - containerPort: 8000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-secrets
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
  type: LoadBalancer
  selector:
    app: product-analyzer
  ports:
  - port: 80
    targetPort: 8000
```

```bash
# Create secrets
kubectl create secret generic api-secrets \
  --from-literal=openai-key=your_openai_key \
  --from-literal=anthropic-key=your_anthropic_key

# Deploy
kubectl apply -f azure-k8s-deployment.yaml
kubectl get services
```

## 📊 Cost Optimization

**Estimated Monthly Costs:**

**Container Instances:**
- ACI (2 CPU, 4GB): ~$30-40
- Container Registry: ~$5
- **Total: ~$35-45/month**

**App Service:**
- B1 Plan: ~$13
- PostgreSQL Basic: ~$20
- **Total: ~$33/month**

## 🔒 Security Configuration

```bash
# Enable managed identity
az webapp identity assign \
  --resource-group product-analyzer-rg \
  --name product-analyzer-webapp

# Store secrets in Key Vault
az keyvault create \
  --name product-analyzer-vault \
  --resource-group product-analyzer-rg \
  --location eastus

az keyvault secret set \
  --vault-name product-analyzer-vault \
  --name openai-key \
  --value your_openai_key
```

## 🔍 Monitoring

```bash
# View logs
az webapp log tail \
  --resource-group product-analyzer-rg \
  --name product-analyzer-webapp

# Monitor metrics
az monitor metrics list \
  --resource /subscriptions/{subscription-id}/resourceGroups/product-analyzer-rg/providers/Microsoft.Web/sites/product-analyzer-webapp \
  --metric "Requests"
```