# Deploy Towns Bot to Google Cloud Platform (GCP)

This guide walks you through deploying your Towns Protocol bot to GCP Cloud Run.

## Why Cloud Run?

- **Always-on** - Set `min-instances=1` to prevent cold starts and maintain in-memory state
- **Automatic scaling** - Handles traffic spikes automatically
- **Built-in HTTPS** - Secure webhook endpoint out of the box
- **Cost-effective** - Pay only for what you use
- **Easy deployment** - Docker-based, simple CLI commands

## Prerequisites

1. **GCP Account** - Sign up at https://cloud.google.com/
2. **gcloud CLI** - Install from https://cloud.google.com/sdk/docs/install
3. **Bot Credentials** - From https://app.alpha.towns.com/developer
   - `APP_PRIVATE_DATA` (base64 encoded)
   - `JWT_SECRET`
4. **OpenAI API Key** - From https://platform.openai.com/api-keys

## Step 1: Set Up GCP Project

```bash
# Install gcloud CLI (if not already installed)
# macOS:
brew install --cask google-cloud-sdk

# Login to GCP
gcloud auth login

# Create a new project (or use existing)
gcloud projects create towns-bot-PROJECT_ID --name="Towns Bot"

# Set the project as default
gcloud config set project towns-bot-PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

## Step 2: Store Secrets in Secret Manager

**IMPORTANT:** Never commit secrets to Git. Use GCP Secret Manager.

```bash
# Create secrets for your bot credentials
echo -n "YOUR_APP_PRIVATE_DATA" | gcloud secrets create app-private-data --data-file=-
echo -n "YOUR_JWT_SECRET" | gcloud secrets create jwt-secret --data-file=-
echo -n "YOUR_OPENAI_API_KEY" | gcloud secrets create openai-api-key --data-file=-

# Grant Cloud Run access to secrets
PROJECT_NUMBER=$(gcloud projects describe towns-bot-PROJECT_ID --format="value(projectNumber)")
gcloud secrets add-iam-policy-binding app-private-data \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding jwt-secret \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding openai-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Step 3: Deploy to Cloud Run

### Option A: Deploy from Dockerfile (Recommended)

```bash
# Build and deploy in one command
gcloud run deploy towns-bot \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --set-secrets="APP_PRIVATE_DATA=app-private-data:latest,JWT_SECRET=jwt-secret:latest,OPENAI_API_KEY=openai-api-key:latest" \
  --port 5123
```

### Option B: Deploy from Local Docker Image

```bash
# Build Docker image locally
docker build -t towns-bot .

# Tag for GCP Container Registry
docker tag towns-bot gcr.io/towns-bot-PROJECT_ID/towns-bot

# Push to Container Registry
docker push gcr.io/towns-bot-PROJECT_ID/towns-bot

# Deploy to Cloud Run
gcloud run deploy towns-bot \
  --image gcr.io/towns-bot-PROJECT_ID/towns-bot \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 1 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --set-secrets="APP_PRIVATE_DATA=app-private-data:latest,JWT_SECRET=jwt-secret:latest,OPENAI_API_KEY=openai-api-key:latest" \
  --port 5123
```

## Step 4: Get Your Webhook URL

After deployment, Cloud Run will output your service URL:

```bash
# Get the service URL
gcloud run services describe towns-bot --region us-central1 --format="value(status.url)"
```

Example output: `https://towns-bot-abc123-uc.a.run.app`

Your webhook endpoint will be: `https://towns-bot-abc123-uc.a.run.app/webhook`

## Step 5: Configure Towns Developer Portal

1. Go to https://app.alpha.towns.com/developer
2. Select your bot
3. Update **Webhook URL** to: `https://YOUR-CLOUD-RUN-URL/webhook`
4. Set **Forwarding Setting** to:
   - `ALL_MESSAGES` - Bot receives all messages
   - OR `MENTIONS_REPLIES_REACTIONS` - Bot only gets mentions/replies

## Step 6: Test Your Bot

```bash
# Check health endpoint
curl https://YOUR-CLOUD-RUN-URL/health

# View logs
gcloud run services logs read towns-bot --region us-central1 --limit 50

# Follow logs in real-time
gcloud run services logs tail towns-bot --region us-central1
```

## Configuration Options

### Min Instances (Always-On vs Cost-Saving)

**Always-On (Recommended for Production):**
```bash
--min-instances 1  # Keeps 1 instance always running (no cold starts)
```

**Cost-Saving (Development):**
```bash
--min-instances 0  # Scales to zero when idle (cold starts on first request)
```

### Memory and CPU

```bash
--memory 512Mi     # 512MB RAM (adjust based on bot needs)
--cpu 1            # 1 vCPU (can go up to 4)
```

### Timeout

```bash
--timeout 300      # 5 minutes max request timeout
```

## Update Deployment

After making code changes:

```bash
# Rebuild and redeploy
gcloud run deploy towns-bot \
  --source . \
  --region us-central1

# Or if using Docker image
docker build -t gcr.io/towns-bot-PROJECT_ID/towns-bot .
docker push gcr.io/towns-bot-PROJECT_ID/towns-bot
gcloud run deploy towns-bot --image gcr.io/towns-bot-PROJECT_ID/towns-bot --region us-central1
```

## Monitoring and Debugging

### View Logs

```bash
# Recent logs
gcloud run services logs read towns-bot --region us-central1 --limit 100

# Live logs
gcloud run services logs tail towns-bot --region us-central1

# Filter logs
gcloud run services logs read towns-bot --region us-central1 --filter="severity=ERROR"
```

### Check Service Status

```bash
# Service details
gcloud run services describe towns-bot --region us-central1

# List all revisions
gcloud run revisions list --service towns-bot --region us-central1
```

### Rollback to Previous Version

```bash
# List revisions
gcloud run revisions list --service towns-bot --region us-central1

# Rollback to specific revision
gcloud run services update-traffic towns-bot --region us-central1 --to-revisions REVISION_NAME=100
```

## Environment Variables

### View Current Environment Variables

```bash
gcloud run services describe towns-bot --region us-central1 --format="value(spec.template.spec.containers[0].env)"
```

### Update Environment Variables

```bash
gcloud run services update towns-bot \
  --region us-central1 \
  --update-env-vars NEW_VAR=value
```

## Cost Estimation

Cloud Run pricing (as of 2024):
- **CPU**: $0.00002400 per vCPU-second
- **Memory**: $0.00000250 per GiB-second
- **Requests**: $0.40 per million requests
- **Free Tier**: 2 million requests/month, 360,000 GiB-seconds/month

**Estimated monthly cost with min-instances=1:**
- Always-on instance: ~$15-30/month
- With min-instances=0: ~$5-10/month (depending on traffic)

## Troubleshooting

### Bot Not Receiving Messages

1. Check webhook URL in Towns Developer Portal matches Cloud Run URL
2. Verify forwarding setting (`ALL_MESSAGES` vs `MENTIONS_REPLIES_REACTIONS`)
3. Check logs for JWT errors: `gcloud run services logs read towns-bot --region us-central1`

### Cold Start Issues

- Set `--min-instances 1` to keep instance warm
- Increase `--memory` if bot is slow to start

### Secret Access Errors

```bash
# Verify secrets exist
gcloud secrets list

# Check IAM permissions
gcloud secrets get-iam-policy app-private-data
```

### Out of Memory

```bash
# Increase memory allocation
gcloud run services update towns-bot --region us-central1 --memory 1Gi
```

## Advanced: Custom Domain

```bash
# Map custom domain to Cloud Run
gcloud run domain-mappings create --service towns-bot --domain bot.yourdomain.com --region us-central1
```

## Cleanup

To delete the deployment:

```bash
# Delete Cloud Run service
gcloud run services delete towns-bot --region us-central1

# Delete secrets
gcloud secrets delete app-private-data
gcloud secrets delete jwt-secret
gcloud secrets delete openai-api-key

# Delete project (if desired)
gcloud projects delete towns-bot-PROJECT_ID
```

## Quick Reference Commands

```bash
# Deploy/Update
gcloud run deploy towns-bot --source . --region us-central1

# View logs
gcloud run services logs tail towns-bot --region us-central1

# Get webhook URL
gcloud run services describe towns-bot --region us-central1 --format="value(status.url)"

# Test health endpoint
curl $(gcloud run services describe towns-bot --region us-central1 --format="value(status.url)")/health

# Check status
gcloud run services describe towns-bot --region us-central1
```

## Next Steps

1. ✅ Deploy bot to Cloud Run
2. ✅ Configure webhook in Towns Developer Portal
3. ✅ Test bot in a Towns channel
4. 📊 Set up monitoring and alerts (Cloud Monitoring)
5. 🔐 Enable Cloud Armor for DDoS protection (if needed)
6. 📈 Scale up `--max-instances` based on usage

## Support

- GCP Cloud Run Docs: https://cloud.google.com/run/docs
- Towns Protocol Docs: https://docs.towns.com
- Bot Issues: Check AGENTS.md for troubleshooting

---

**Built for:** Towns Protocol Bot Framework
**Optimized for:** Google Cloud Run
**Build command:** `bun run build`
**Start command:** `bun run start`