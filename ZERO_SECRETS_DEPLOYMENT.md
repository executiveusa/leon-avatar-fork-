# Zero-Secrets Deployment Architecture

This document describes the zero-secrets deployment architecture implemented for Leon AI, enabling deployment on Railway and other platforms without requiring any API keys or secrets.

## Overview

The zero-secrets deployment architecture allows Leon AI to be deployed successfully on Railway's free tier (or any other platform) without requiring:
- ❌ No API keys
- ❌ No service account credentials
- ❌ No third-party integrations
- ❌ No secrets management
- ✅ Working public URL on first deploy
- ✅ Core features functional out-of-the-box
- ✅ Free-tier cost protection
- ✅ Automatic maintenance mode on limit breach

## Architecture Components

### 1. Core Configuration Files

#### `.agents`
Machine-readable specification of all secrets and integrations:
- Complete list of environment variables
- Categorized by module (core, optional, skill-specific)
- Stub strategies for zero-secrets mode
- Format specifications for each secret
- Designed for consumption by automated agents

#### `master.secrets.json.template`
Local secret management template:
- Store secrets for all projects in one place
- Never commit to repository
- Use for local development
- Source for production secret injection
- Encrypted storage recommendations

#### `railway.toml`
Railway deployment configuration:
- Zero-secrets environment variables
- Cost-protection guardrails
- Resource limits for free tier
- Health checks and monitoring markers
- Maintenance mode configuration

### 2. Documentation Files

#### `RAILWAY_DEPLOYMENT.md`
Complete deployment guide:
- Step-by-step Railway setup
- Zero-secrets configuration
- Feature enablement instructions
- Troubleshooting guide
- Cost monitoring

#### `COOLIFY_SUPPORT.md`
Coolify deployment scaffolding:
- Self-hosted alternative to Railway
- Cost-effective hosting
- Full control over infrastructure
- VPS configuration guide

#### `COOLIFY_MIGRATION.md`
Migration checklist:
- Triggered when free-tier limits reached
- Step-by-step migration process
- Rollback procedures
- Testing and validation steps

#### `HOSTINGER_VPN.md`
Hostinger VPN integration notes:
- VPN tunnel configuration
- WireGuard setup
- Hybrid deployment architecture
- Security best practices

### 3. Supporting Files

#### `maintenance.html`
Static maintenance page:
- Deployed when free-tier limits reached
- Explains situation to users
- Provides migration information
- Professional appearance
- Minimal resource usage

#### `Dockerfile.coolify`
Docker configuration for Coolify:
- Optimized for self-hosted deployment
- Multi-stage build support
- Health checks included
- Port configuration

#### `scripts/verify-free-tier.js`
Verification script:
- Checks zero-secrets configuration
- Validates deployment files
- Verifies environment variables
- Reports readiness for deployment

## Zero-Secrets Strategy

### What's Enabled (No Secrets Required)

1. **Web Interface**
   - Accessible via Railway public URL
   - Full UI functionality
   - Text-based interaction

2. **HTTP API**
   - RESTful endpoints
   - Authentication (auto-generated key)
   - Text query processing

3. **Core Skills**
   - Basic conversation
   - Date/Time utilities
   - Timer functionality
   - Random number generation
   - Todo list management

4. **Games**
   - Akinator
   - Rock-Paper-Scissors
   - Guess the Number

5. **Utilities**
   - Speed test
   - Translator (basic)
   - System information

### What's Disabled (Requires Secrets)

1. **External LLM Providers**
   - OpenAI GPT
   - Groq
   - Anthropic Claude
   - Google Gemini

2. **Cloud TTS/STT**
   - Google Cloud Text-to-Speech
   - Google Cloud Speech-to-Text
   - IBM Watson TTS/STT
   - Amazon Polly

3. **Third-Party Skills**
   - Product Hunt trends (requires API key)
   - Have I Been Pwned (requires API key)
   - Weather services (may require API key)

### How It Works

```
┌─────────────────────────────────────────────┐
│          Zero-Secrets Deployment            │
└─────────────────────────────────────────────┘
                     ↓
        ┌────────────────────────┐
        │   Railway Platform     │
        │  (Free Tier - $0/mo)   │
        └────────────────────────┘
                     ↓
        ┌────────────────────────┐
        │   Auto-Configuration   │
        │  • No API keys         │
        │  • Safe defaults       │
        │  • Minimal resources   │
        └────────────────────────┘
                     ↓
        ┌────────────────────────┐
        │   Cost Protection      │
        │  • Monitor usage       │
        │  • 80% threshold       │
        │  • Auto-shutdown       │
        └────────────────────────┘
                     ↓
        ┌────────────────────────┐
        │  Working Leon AI       │
        │  • Web interface       │
        │  • HTTP API            │
        │  • Basic skills        │
        │  • Games & utilities   │
        └────────────────────────┘
```

## Cost Protection Architecture

### Free-Tier Monitoring

The deployment includes markers for automated monitoring:

```toml
[deploy.cost_protection]
enabled = true
threshold_percentage = 80
check_interval_hours = 6
action_on_breach = "deploy_maintenance_mode"
```

### Automatic Actions

When 80% of free-tier limits are reached:

1. **Detection**: Monitor detects threshold breach
2. **Action**: Deploy `maintenance.html` static page
3. **Suspension**: Main Leon service suspended/scaled to zero
4. **Notification**: Log event with details
5. **Preparation**: Generate `COOLIFY_MIGRATION.md` checklist
6. **Failover**: Prepare for Coolify migration

### Manual Monitoring

Users can check Railway usage:
- Dashboard → Project → Usage tab
- Metrics: execution time, data transfer, build minutes
- Alerts: Set up notifications in Railway settings

## Migration Paths

### Path 1: Railway Free → Railway Paid
- Upgrade Railway subscription
- Remove cost protection limits
- Enable more features
- Scale resources as needed

### Path 2: Railway → Coolify
- Set up Coolify on VPS
- Deploy Leon on Coolify
- Update DNS
- Cancel Railway
- Cost: ~$9/month for VPS

### Path 3: Railway → Hostinger VPN + Coolify
- Hostinger VPS with VPN tunnel
- Enhanced security
- Hybrid deployment option
- Cost: ~$9/month

### Path 4: Hybrid Deployment
- Railway for web traffic (free tier)
- Coolify for heavy processing
- VPN tunnel between services
- Optimize cost/performance

## Security Considerations

### Zero-Secrets Mode
- ✅ No secrets in repository
- ✅ No secrets in Railway environment (minimal)
- ✅ Telemetry disabled by default
- ✅ Privacy-first configuration

### Secret Management
- Store secrets in `master.secrets.json` locally
- Never commit `master.secrets.json` to repository
- Use Railway's secret management for production
- Rotate API keys regularly
- Use minimum required permissions

### Best Practices
1. Use `.gitignore` to prevent secret commits
2. Generate unique HTTP API keys per environment
3. Enable only features you need
4. Monitor access logs
5. Keep dependencies updated
6. Use HTTPS (Railway provides automatically)

## Feature Enablement

### Adding Secrets Later

To enable optional features after zero-secrets deployment:

1. **Obtain API Keys**: Get credentials from service providers
2. **Update Railway Secrets**: Add to Railway environment variables
3. **Enable Features**: Set feature flags to `true`
4. **Test**: Verify functionality
5. **Monitor**: Check resource usage

### Example: Enable LLM

```bash
# In Railway dashboard, add:
LEON_LLM=true
LEON_LLM_PROVIDER=groq
LEON_LLM_PROVIDER_API_KEY=your_api_key_here
LEON_LLM_NLG=true
```

### Example: Enable Google Cloud TTS

```bash
# In Railway dashboard, add:
LEON_TTS=true
LEON_TTS_PROVIDER=google-cloud-tts
GOOGLE_APPLICATION_CREDENTIALS=<paste-json-content>
```

## Verification

Before deploying, run verification script:

```bash
# Local verification
npm install
export LEON_LANG=en-US
export LEON_HOST=http://localhost
export LEON_PORT=1337
export LEON_OVER_HTTP=true
node scripts/verify-free-tier.js
```

Expected output:
```
✓ All checks passed! Ready for deployment.
Deployment Mode: Zero-Secrets
```

## Success Metrics

Your zero-secrets deployment is successful when:

1. ✅ Railway build completes without errors
2. ✅ Application starts and remains running
3. ✅ Public URL is accessible
4. ✅ Web interface loads
5. ✅ Basic skills respond correctly
6. ✅ No API key errors in logs
7. ✅ Resource usage within free-tier limits
8. ✅ Health checks pass
9. ✅ Cost protection is active
10. ✅ Documentation is accessible

## Support and Resources

### Documentation
- **This File**: Zero-secrets architecture overview
- **RAILWAY_DEPLOYMENT.md**: Deployment guide
- **COOLIFY_MIGRATION.md**: Migration checklist
- **.agents**: Secrets specification
- **master.secrets.json.template**: Secret management

### Community
- **Leon AI Discord**: https://discord.gg/MNQqqKg
- **Railway Discord**: https://discord.gg/railway
- **GitHub Issues**: https://github.com/executiveusa/leon-avatar-fork-/issues

### Related Projects
- **Leon AI**: https://github.com/leon-ai/leon
- **Railway**: https://railway.app
- **Coolify**: https://coolify.io
- **Hostinger**: https://www.hostinger.com

## Version History

**Version 1.0** (2025-12-04)
- Initial zero-secrets architecture
- Railway deployment support
- Cost protection guardrails
- Coolify migration scaffolding
- Hostinger VPN integration notes
- Complete documentation suite

## License

This deployment architecture is part of Leon AI and is licensed under the MIT License.

---

**Last Updated**: 2025-12-04  
**Maintained By**: Leon AI Community  
**Status**: Production Ready
