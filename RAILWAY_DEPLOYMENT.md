# Railway Zero-Secrets Deployment Guide

This guide walks you through deploying Leon AI on Railway without requiring any API keys or secrets, ensuring a safe first deployment that boots successfully with a working public URL.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Zero-Secrets Architecture](#zero-secrets-architecture)
4. [Deployment Steps](#deployment-steps)
5. [Cost Protection](#cost-protection)
6. [Feature Configuration](#feature-configuration)
7. [Troubleshooting](#troubleshooting)
8. [Next Steps](#next-steps)

---

## Overview

This deployment strategy:
- ✅ **Requires NO secrets or API keys**
- ✅ **Guarantees successful first boot**
- ✅ **Provides working public URL**
- ✅ **Stays within free-tier limits**
- ✅ **Includes automatic cost protection**
- ✅ **Enables core Leon features**
- ✅ **Disables optional third-party integrations**

### What Works Out of the Box

With zero-secrets deployment, you get:
- ✅ Web interface on Railway public URL
- ✅ HTTP API for text interactions
- ✅ Basic conversation skills
- ✅ Games (Akinator, Rock-Paper-Scissors, Guess the Number)
- ✅ Utilities (Date/Time, Timer, Speed Test)
- ✅ Productivity tools (Todo List)
- ✅ Offline operation (no external dependencies)

### What's Disabled

These features require API keys and are disabled by default:
- ❌ External LLM providers (OpenAI, Groq, etc.)
- ❌ Google Cloud Text-to-Speech/Speech-to-Text
- ❌ IBM Watson TTS/STT
- ❌ Amazon Polly TTS
- ❌ Product Hunt trends skill
- ❌ Have I Been Pwned skill

> **Note**: You can enable these features later by adding API keys. See [Feature Configuration](#feature-configuration).

---

## Prerequisites

1. **GitHub Account**: For connecting your repository
2. **Railway Account**: Sign up at [railway.app](https://railway.app)
3. **This Repository**: Fork or clone this repository

No API keys, credit cards, or secrets required for initial deployment!

---

## Zero-Secrets Architecture

### Environment Variables Strategy

The deployment uses safe defaults for all settings:

```bash
# Core - Safe defaults
LEON_LANG=en-US
LEON_HOST=${{ RAILWAY_PUBLIC_DOMAIN }}  # Auto-populated by Railway
LEON_PORT=${{ PORT }}                    # Auto-populated by Railway

# Optional Features - All disabled
LEON_LLM=false                          # No external LLM
LEON_STT=false                          # No speech-to-text
LEON_TTS=false                          # No text-to-speech
LEON_TELEMETRY=false                    # Privacy-first

# HTTP API - Enabled for web interface
LEON_OVER_HTTP=true
LEON_HTTP_API_KEY=                      # Generated on first boot
```

### Cost Protection Architecture

The deployment includes automatic guardrails:

1. **Resource Limits**: Minimum viable resources (512MB RAM, shared CPU)
2. **Free-Tier Monitoring**: Checks usage every 6 hours
3. **Auto-Shutdown**: Activates at 80% of free-tier limits
4. **Maintenance Mode**: Deploys static fallback page
5. **Migration Prep**: Generates Coolify migration checklist

---

## Deployment Steps

### Step 1: Prepare Repository

1. **Fork or Clone** this repository to your GitHub account
2. **Verify Files** are present:
   - `railway.toml` - Railway configuration
   - `.agents` - Secrets specification
   - `maintenance.html` - Maintenance page
   - `COOLIFY_MIGRATION.md` - Migration guide

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select your Leon repository
6. Railway will auto-detect the configuration from `railway.toml`

### Step 3: Configure Environment Variables

Railway will automatically use the configuration from `railway.toml`, but verify:

**Required Variables** (auto-configured):
- ✅ `LEON_HOST` - Set to Railway public domain
- ✅ `LEON_PORT` - Set to Railway's PORT variable
- ✅ `LEON_LANG` - Set to "en-US"

**Optional Variables** (safe defaults):
- ✅ `LEON_LLM` - Set to "false"
- ✅ `LEON_STT` - Set to "false"
- ✅ `LEON_TTS` - Set to "false"
- ✅ `LEON_TELEMETRY` - Set to "false"
- ✅ `LEON_OVER_HTTP` - Set to "true"

**Generate HTTP API Key** (optional but recommended):

If you want to set a specific HTTP API key:
1. In the Railway dashboard, add environment variable
2. Name: `LEON_HTTP_API_KEY`
3. Value: Generate using `npm run generate:http-api-key` locally
4. Or leave empty to auto-generate on first boot

### Step 4: Deploy

1. Railway will automatically start building
2. Monitor build logs in Railway dashboard
3. Build typically takes 10-15 minutes
4. Watch for "Deployment successful" message

### Step 5: Access Your Deployment

1. Once deployed, Railway provides a public URL
2. Format: `https://[project-name].up.railway.app`
3. Click the URL in Railway dashboard
4. You should see Leon's web interface!

### Step 6: Verify Functionality

Test these features to confirm deployment:

1. **Web Interface**: Should load at Railway URL
2. **Text Chat**: Type "Hello Leon" in web interface
3. **Skills**: Try "What time is it?"
4. **Games**: Try "Let's play rock paper scissors"
5. **Utilities**: Try "Give me a random number"

If all work, your deployment is successful! 🎉

---

## Cost Protection

### Free-Tier Limits

Railway free tier includes:
- **Execution Time**: 500 hours/month
- **RAM**: 512MB per service
- **CPU**: Shared (no guarantees)
- **Network**: 100GB outbound/month
- **Builds**: 500 minutes/month

### Automatic Monitoring

The deployment includes markers for cost monitoring:

```toml
[deploy.cost_protection]
enabled = true
threshold_percentage = 80
check_interval_hours = 6
action_on_breach = "deploy_maintenance_mode"
```

**How it works**:
1. Monitor checks Railway usage every 6 hours
2. If usage exceeds 80% of free tier limits:
   - Deploy `maintenance.html` static page
   - Suspend main Leon service
   - Generate migration checklist
   - Log event to console

### Manual Usage Check

To check your Railway usage:
1. Go to Railway dashboard
2. Click on your project
3. Navigate to "Usage" tab
4. Review metrics: execution time, data transfer, build minutes

### If Free-Tier is Exceeded

When limits are reached:
1. Maintenance page automatically deploys
2. Main service suspends to prevent charges
3. Review `COOLIFY_MIGRATION.md` for next steps
4. Options:
   - Wait for monthly reset
   - Upgrade to paid Railway plan
   - Migrate to Coolify (self-hosted)
   - Deploy on own infrastructure

---

## Feature Configuration

### Enable Features Later

To enable optional features after initial deployment:

#### Enable LLM (Large Language Model)

1. Obtain API key from provider (Groq, OpenAI, etc.)
2. In Railway dashboard, add environment variables:
   ```bash
   LEON_LLM=true
   LEON_LLM_PROVIDER=groq  # or openai, anthropic
   LEON_LLM_PROVIDER_API_KEY=your_api_key_here
   LEON_LLM_NLG=true  # Enable natural language generation
   ```
3. Redeploy service
4. Test LLM features

#### Enable Text-to-Speech

**For Google Cloud TTS**:
1. Create Google Cloud project
2. Enable Text-to-Speech API
3. Create service account and download JSON key
4. In Railway, add secret:
   ```bash
   LEON_TTS=true
   LEON_TTS_PROVIDER=google-cloud-tts
   GOOGLE_APPLICATION_CREDENTIALS=<paste-json-content>
   ```

**For Local Flite** (no API key needed):
```bash
LEON_TTS=true
LEON_TTS_PROVIDER=flite
```

#### Enable Speech-to-Text

**For Google Cloud STT**:
1. Enable Speech-to-Text API in Google Cloud
2. Use same service account as TTS
3. Add variables:
   ```bash
   LEON_STT=true
   LEON_STT_PROVIDER=google-cloud-stt
   ```

**For Coqui STT** (local, no API key):
```bash
LEON_STT=true
LEON_STT_PROVIDER=coqui-stt
```

#### Enable Product Hunt Trends Skill

1. Get developer token from [Product Hunt API](https://api.producthunt.com/v2/oauth/applications)
2. Create skill settings file: `skills/news/product_hunt_trends/src/settings.json`
3. Add token:
   ```json
   {
     "developer_token": "YOUR_TOKEN_HERE"
   }
   ```
4. Redeploy

#### Enable Have I Been Pwned Skill

1. Get API key from [haveibeenpwned.com](https://haveibeenpwned.com/API/Key)
2. Create skill settings file: `skills/utilities/have_i_been_pwned/src/settings.json`
3. Add configuration:
   ```json
   {
     "emails": ["your@email.com"],
     "api_key": "YOUR_API_KEY"
   }
   ```
4. Redeploy

### Using master.secrets.json

For local secret management:

1. Copy template:
   ```bash
   cp master.secrets.json.template master.secrets.json
   ```

2. Fill in secrets:
   ```json
   {
     "projects": {
       "leon-avatar-fork": {
         "secrets": {
           "llm_providers": {
             "LEON_LLM_PROVIDER_API_KEY": {
               "value": "your_actual_key_here"
             }
           }
         }
       }
     }
   }
   ```

3. **NEVER commit** `master.secrets.json` to repository
4. Add to `.gitignore` (already included)

---

## Troubleshooting

### Build Fails

**Symptom**: Railway build process fails

**Solutions**:
1. Check build logs for specific error
2. Verify Node.js version (requires >= 22.13.1)
3. Check for npm dependency issues
4. Try rebuilding: Click "Deploy" > "Redeploy"

### Application Won't Start

**Symptom**: Build succeeds but application crashes on startup

**Solutions**:
1. Check deployment logs in Railway
2. Verify environment variables are set correctly
3. Check for Python TCP server errors
4. Ensure port configuration is correct

### Web Interface Not Loading

**Symptom**: Railway URL times out or shows error

**Solutions**:
1. Verify deployment status (should show "Active")
2. Check if port 1337 is configured correctly
3. Review application logs for errors
4. Try accessing `/` endpoint directly
5. Check health check status

### Features Not Working

**Symptom**: Skills or features don't respond

**Solutions**:
1. Verify feature is enabled in environment variables
2. Check if API keys are required and provided
3. Review application logs for errors
4. Test with simple commands first ("hello", "what time is it")

### Out of Memory

**Symptom**: Application crashes with OOM errors

**Solutions**:
1. Railway free tier has 512MB RAM limit
2. Disable unused features to reduce memory usage
3. Consider upgrading to paid tier for more resources
4. Migrate to Coolify for more control

---

## Next Steps

### After Successful Deployment

1. **Test Core Features**: Verify all zero-secrets features work
2. **Monitor Usage**: Keep eye on Railway usage metrics
3. **Review Logs**: Check for any errors or warnings
4. **Document URL**: Save your Railway URL for future reference
5. **Configure Custom Domain** (optional): Add custom domain in Railway settings

### Enabling Additional Features

1. Review `.agents` file for available secrets
2. Obtain API keys for desired services
3. Add secrets to Railway environment variables
4. Enable features one at a time
5. Test each feature after enabling

### Cost Optimization

1. Monitor free-tier usage regularly
2. Disable unused features
3. Consider Coolify migration if consistent high usage
4. Review `COOLIFY_MIGRATION.md` for migration path

### Security Hardening

1. Generate and set strong `LEON_HTTP_API_KEY`
2. Enable HTTPS (Railway provides by default)
3. Configure rate limiting if needed
4. Review and restrict public access if required
5. Keep dependencies updated

---

## Support and Resources

### Documentation

- **Leon AI Docs**: https://docs.getleon.ai
- **Railway Docs**: https://docs.railway.app
- **This Repository**: https://github.com/executiveusa/leon-avatar-fork-

### Community

- **Leon AI Discord**: https://discord.gg/MNQqqKg
- **Railway Discord**: https://discord.gg/railway
- **GitHub Issues**: https://github.com/leon-ai/leon/issues

### Related Files

- `.agents` - Complete secrets specification
- `master.secrets.json.template` - Local secrets template
- `railway.toml` - Railway configuration
- `maintenance.html` - Maintenance page
- `COOLIFY_SUPPORT.md` - Coolify deployment guide
- `COOLIFY_MIGRATION.md` - Migration checklist

---

## Success Criteria

Your zero-secrets Railway deployment is successful when:

- ✅ Railway build completes without errors
- ✅ Application starts and stays running
- ✅ Public URL is accessible
- ✅ Web interface loads correctly
- ✅ Basic skills respond to queries
- ✅ No API key errors in logs
- ✅ Resource usage within free-tier limits
- ✅ Health checks pass consistently

---

## Changelog

**Version 1.0** (2025-12-04)
- Initial Railway zero-secrets deployment guide
- Cost protection architecture
- Complete feature configuration guide
- Troubleshooting section
- Migration path to Coolify

---

**Maintained by**: Leon AI Community  
**License**: MIT  
**Last Updated**: 2025-12-04
