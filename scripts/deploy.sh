#!/bin/bash

# Towns Bot - GCP Cloud Run Deployment Script
# This script deploys the bot to Cloud Run with secrets from Secret Manager

set -e  # Exit on error

echo "🚀 Towns Bot - GCP Cloud Run Deployment"
echo "========================================"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo "❌ Error: Not authenticated with gcloud"
    echo "Run: gcloud auth login"
    exit 1
fi

# Get current project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: No GCP project set"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📋 Current GCP Project: $PROJECT_ID"
echo ""

# Configuration
SERVICE_NAME="towns-bot"
REGION="us-central1"
MIN_INSTANCES=1
MAX_INSTANCES=10
MEMORY="512Mi"
CPU=1
TIMEOUT=300
PORT=5123

# Prompt for configuration
echo "📝 Deployment Configuration:"
echo ""
echo "Service name: $SERVICE_NAME"
echo "Region: $REGION"
echo -n "Min instances (0 for scale-to-zero, 1+ for always-on) [$MIN_INSTANCES]: "
read USER_MIN_INSTANCES
MIN_INSTANCES=${USER_MIN_INSTANCES:-$MIN_INSTANCES}

echo -n "Max instances [$MAX_INSTANCES]: "
read USER_MAX_INSTANCES
MAX_INSTANCES=${USER_MAX_INSTANCES:-$MAX_INSTANCES}

echo -n "Memory (e.g., 512Mi, 1Gi) [$MEMORY]: "
read USER_MEMORY
MEMORY=${USER_MEMORY:-$MEMORY}

echo -n "CPU (1-4) [$CPU]: "
read USER_CPU
CPU=${USER_CPU:-$CPU}

echo ""

# Verify secrets exist
echo "🔍 Checking secrets in Secret Manager..."
REQUIRED_SECRETS=("app-private-data" "jwt-secret" "openai-api-key")
MISSING_SECRETS=()

for SECRET in "${REQUIRED_SECRETS[@]}"; do
    if ! gcloud secrets describe "$SECRET" &>/dev/null; then
        MISSING_SECRETS+=("$SECRET")
    else
        echo "   ✅ $SECRET"
    fi
done

if [ ${#MISSING_SECRETS[@]} -gt 0 ]; then
    echo ""
    echo "❌ Error: Missing secrets in Secret Manager:"
    for SECRET in "${MISSING_SECRETS[@]}"; do
        echo "   • $SECRET"
    done
    echo ""
    echo "Run ./scripts/setup-secrets.sh first to create secrets"
    exit 1
fi

echo ""

# Enable required APIs
echo "📦 Enabling required GCP APIs..."
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable run.googleapis.com --quiet
echo "   ✅ APIs enabled"
echo ""

# Build and deploy
echo "🏗️  Building and deploying to Cloud Run..."
echo ""
echo "This may take 3-5 minutes..."
echo ""

gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --platform managed \
    --region "$REGION" \
    --allow-unauthenticated \
    --min-instances "$MIN_INSTANCES" \
    --max-instances "$MAX_INSTANCES" \
    --memory "$MEMORY" \
    --cpu "$CPU" \
    --timeout "$TIMEOUT" \
    --port "$PORT" \
    --set-secrets="APP_PRIVATE_DATA=app-private-data:latest,JWT_SECRET=jwt-secret:latest,OPENAI_API_KEY=openai-api-key:latest" \
    --quiet

# Get the service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format="value(status.url)")

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "📋 Service Details:"
echo "   • Service Name: $SERVICE_NAME"
echo "   • Region: $REGION"
echo "   • Service URL: $SERVICE_URL"
echo "   • Webhook URL: $SERVICE_URL/webhook"
echo "   • Health Check: $SERVICE_URL/health"
echo ""
echo "🔧 Configuration:"
echo "   • Min Instances: $MIN_INSTANCES"
echo "   • Max Instances: $MAX_INSTANCES"
echo "   • Memory: $MEMORY"
echo "   • CPU: $CPU"
echo ""

# Test health endpoint
echo "🏥 Testing health endpoint..."
if curl -s -o /dev/null -w "%{http_code}" "$SERVICE_URL/health" | grep -q "200"; then
    echo "   ✅ Health check passed"
else
    echo "   ⚠️  Health check failed (service may still be starting)"
fi

echo ""
echo "📝 Next Steps:"
echo "   1. Configure webhook in Towns Developer Portal:"
echo "      → https://app.alpha.towns.com/developer"
echo "   2. Set Webhook URL to: $SERVICE_URL/webhook"
echo "   3. Set Forwarding to: ALL_MESSAGES or MENTIONS_REPLIES_REACTIONS"
echo ""
echo "📊 View Logs:"
echo "   gcloud run services logs read $SERVICE_NAME --region $REGION --limit 50"
echo ""
echo "📊 Live Logs:"
echo "   gcloud run services logs tail $SERVICE_NAME --region $REGION"
echo ""
echo "🔄 Update Deployment:"
echo "   Run ./scripts/deploy.sh again after code changes"
