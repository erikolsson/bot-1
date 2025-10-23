#!/bin/bash

# Towns Bot - GCP Secret Manager Setup Script
# This script creates or updates secrets in GCP Secret Manager

set -e  # Exit on error

echo "🔐 Towns Bot - GCP Secret Manager Setup"
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

# Prompt for secrets
echo "Enter your secrets (input will be hidden):"
echo ""

# APP_PRIVATE_DATA
echo -n "APP_PRIVATE_DATA (from Towns Developer Portal): "
read -s APP_PRIVATE_DATA
echo ""

if [ -z "$APP_PRIVATE_DATA" ]; then
    echo "❌ Error: APP_PRIVATE_DATA cannot be empty"
    exit 1
fi

# JWT_SECRET
echo -n "JWT_SECRET (from Towns Developer Portal): "
read -s JWT_SECRET
echo ""

if [ -z "$JWT_SECRET" ]; then
    echo "❌ Error: JWT_SECRET cannot be empty"
    exit 1
fi

# OPENAI_API_KEY
echo -n "OPENAI_API_KEY (from OpenAI): "
read -s OPENAI_API_KEY
echo ""

if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ Error: OPENAI_API_KEY cannot be empty"
    exit 1
fi

echo ""
echo "✅ All secrets provided"
echo ""

# Enable Secret Manager API
echo "📦 Enabling Secret Manager API..."
gcloud services enable secretmanager.googleapis.com --quiet

# Get project number for IAM binding
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")

# Function to create or update a secret
create_or_update_secret() {
    local SECRET_NAME=$1
    local SECRET_VALUE=$2

    echo "🔄 Processing secret: $SECRET_NAME"

    # Check if secret exists
    if gcloud secrets describe "$SECRET_NAME" &>/dev/null; then
        echo "   📝 Secret exists, creating new version..."
        echo -n "$SECRET_VALUE" | gcloud secrets versions add "$SECRET_NAME" --data-file=-
    else
        echo "   ✨ Creating new secret..."
        echo -n "$SECRET_VALUE" | gcloud secrets create "$SECRET_NAME" --data-file=-

        # Grant access to Cloud Run service account
        echo "   🔓 Granting access to Cloud Run service account..."
        gcloud secrets add-iam-policy-binding "$SECRET_NAME" \
            --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
            --role="roles/secretmanager.secretAccessor" \
            --quiet
    fi

    echo "   ✅ $SECRET_NAME ready"
    echo ""
}

# Create or update all secrets
echo "🚀 Creating/updating secrets in Secret Manager..."
echo ""

create_or_update_secret "app-private-data" "$APP_PRIVATE_DATA"
create_or_update_secret "jwt-secret" "$JWT_SECRET"
create_or_update_secret "openai-api-key" "$OPENAI_API_KEY"

echo "🎉 All secrets successfully configured!"
echo ""
echo "📋 Summary:"
echo "   • app-private-data: ✅"
echo "   • jwt-secret: ✅"
echo "   • openai-api-key: ✅"
echo ""
echo "Next step: Run ./scripts/deploy.sh to deploy your bot"
