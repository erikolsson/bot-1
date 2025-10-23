# Deployment Scripts

Quick deployment scripts for GCP Cloud Run.

## Prerequisites

1. Install gcloud CLI:
   ```bash
   brew install --cask google-cloud-sdk
   ```

2. Login to GCP:
   ```bash
   gcloud auth login
   ```

3. Set your project:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

## Usage

### Step 1: Setup Secrets (First Time Only)

```bash
./scripts/setup-secrets.sh
```

This script will prompt you to enter:
- **APP_PRIVATE_DATA** - From https://app.alpha.towns.com/developer
- **JWT_SECRET** - From https://app.alpha.towns.com/developer
- **OPENAI_API_KEY** - From https://platform.openai.com/api-keys

Secrets are stored securely in GCP Secret Manager.

### Step 2: Deploy Bot

```bash
./scripts/deploy.sh
```

This script will:
1. Verify secrets exist in Secret Manager
2. Enable required GCP APIs
3. Build Docker image from source
4. Deploy to Cloud Run
5. Display your webhook URL

The script will prompt you for:
- Min instances (0 = scale-to-zero, 1+ = always-on)
- Max instances (default: 10)
- Memory allocation (default: 512Mi)
- CPU allocation (default: 1)

### Step 3: Configure Webhook

After deployment, configure your bot in the Towns Developer Portal:

1. Go to https://app.alpha.towns.com/developer
2. Select your bot
3. Set **Webhook URL** to: `https://YOUR-CLOUD-RUN-URL/webhook`
4. Set **Forwarding** to: `ALL_MESSAGES` or `MENTIONS_REPLIES_REACTIONS`

## Updating Your Bot

After making code changes:

```bash
./scripts/deploy.sh
```

The script will rebuild and redeploy automatically.

## Update Secrets

To update secrets (e.g., rotate API keys):

```bash
./scripts/setup-secrets.sh
```

Then redeploy:

```bash
./scripts/deploy.sh
```

## View Logs

```bash
# Recent logs
gcloud run services logs read towns-bot --region us-central1 --limit 50

# Live logs
gcloud run services logs tail towns-bot --region us-central1
```

## Troubleshooting

### "gcloud: command not found"
Install gcloud CLI: https://cloud.google.com/sdk/docs/install

### "Not authenticated with gcloud"
Run: `gcloud auth login`

### "No GCP project set"
Run: `gcloud config set project YOUR_PROJECT_ID`

### "Missing secrets"
Run: `./scripts/setup-secrets.sh` first

### Bot not responding
1. Check logs: `gcloud run services logs read towns-bot --region us-central1`
2. Verify webhook URL in Towns Developer Portal
3. Check health endpoint: `curl YOUR-CLOUD-RUN-URL/health`

## Configuration Options

### Always-On (No Cold Starts)
```bash
# In deploy.sh, set:
MIN_INSTANCES=1
```

### Cost-Saving (Scale to Zero)
```bash
# In deploy.sh, set:
MIN_INSTANCES=0
```

### More Resources
```bash
# In deploy.sh, increase:
MEMORY="1Gi"
CPU=2
```

## Scripts Reference

- **setup-secrets.sh** - Create/update secrets in Secret Manager
- **deploy.sh** - Deploy bot to Cloud Run
- **DEPLOY_GCP.md** - Complete deployment guide with manual steps

## Support

For detailed deployment guide, see: [DEPLOY_GCP.md](../DEPLOY_GCP.md)
