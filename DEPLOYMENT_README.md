# Leon AI - Railway Zero-Secrets Deployment

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

This repository includes a complete zero-secrets deployment architecture for Leon AI, enabling deployment on Railway without requiring any API keys or secrets.

## 🚀 Quick Start

### Option 1: One-Click Railway Deployment

1. Click the "Deploy on Railway" button above
2. Railway will automatically detect `railway.toml` configuration
3. Your Leon AI instance will deploy with zero configuration
4. Access your instance at the Railway-provided URL

**That's it!** No API keys, no secrets, no configuration needed.

### Option 2: Manual Railway Deployment

1. Fork this repository
2. Create new Railway project
3. Connect to your forked repository
4. Railway auto-deploys using `railway.toml`
5. Access your instance

### Option 3: Local Development

```bash
# Clone repository
git clone https://github.com/executiveusa/leon-avatar-fork-.git
cd leon-avatar-fork-

# Install dependencies
npm install

# Copy environment template
cp .env.sample .env

# Build and run
npm run build
npm start

# Access at http://localhost:1337
```

## 📦 What's Included

This repository includes the complete Railway Zero-Secrets Bootstrapper architecture:

### Core Configuration Files

| File | Purpose |
|------|---------|
| **`.agents`** | Machine-readable secrets specification for automation |
| **`railway.toml`** | Railway deployment config with cost protection |
| **`master.secrets.json.template`** | Local secret management template |
| **`.env.sample`** | Environment variables with safe defaults |
| **`Dockerfile.coolify`** | Docker configuration for Coolify deployment |

### Documentation

| File | Description |
|------|-------------|
| **`RAILWAY_DEPLOYMENT.md`** | Complete Railway deployment guide |
| **`ZERO_SECRETS_DEPLOYMENT.md`** | Zero-secrets architecture overview |
| **`COOLIFY_SUPPORT.md`** | Coolify deployment scaffolding |
| **`COOLIFY_MIGRATION.md`** | Step-by-step migration checklist |
| **`HOSTINGER_VPN.md`** | Hostinger VPN integration notes |

### Supporting Files

| File | Purpose |
|------|---------|
| **`maintenance.html`** | Static maintenance page for free-tier breach |
| **`scripts/verify-free-tier.js`** | Deployment verification script |

## ✨ Features

### Zero-Secrets Deployment
- ✅ No API keys required
- ✅ No service account credentials needed
- ✅ No third-party integrations required
- ✅ Working public URL on first deploy
- ✅ Free-tier optimized

### Cost Protection
- ✅ Automatic usage monitoring
- ✅ Free-tier limit detection
- ✅ Auto-shutdown at 80% threshold
- ✅ Maintenance page deployment
- ✅ Migration preparation

### What Works Out of the Box

**Core Features:**
- 🌐 Web interface
- 🔌 HTTP API
- 💬 Basic conversation
- 🎮 Games (Akinator, RPS, Guess the Number)
- 🛠️ Utilities (Date/Time, Timer, Speed Test)
- 📝 Todo List
- 🔒 Offline operation

### Optional Features (Require API Keys)

**Can be enabled later:**
- 🤖 External LLM (OpenAI, Groq, Anthropic)
- 🗣️ Google Cloud TTS/STT
- 🔊 Amazon Polly
- 📊 Product Hunt trends
- 🔐 Have I Been Pwned

## 📖 Documentation

### Getting Started
1. **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)** - Start here for Railway deployment
2. **[ZERO_SECRETS_DEPLOYMENT.md](./ZERO_SECRETS_DEPLOYMENT.md)** - Understand the architecture

### Advanced Topics
3. **[COOLIFY_MIGRATION.md](./COOLIFY_MIGRATION.md)** - Migrate when free-tier limits reached
4. **[COOLIFY_SUPPORT.md](./COOLIFY_SUPPORT.md)** - Self-hosted deployment option
5. **[HOSTINGER_VPN.md](./HOSTINGER_VPN.md)** - VPN tunnel configuration

### Reference
6. **[.agents](./.agents)** - Complete secrets specification (JSON)
7. **[master.secrets.json.template](./master.secrets.json.template)** - Local secret management

## 🔒 Secret Management

### Zero-Secrets Mode (Default)

All optional features requiring secrets are disabled:

```bash
LEON_LLM=false              # No external LLM
LEON_STT=false              # No speech-to-text
LEON_TTS=false              # No text-to-speech
LEON_TELEMETRY=false        # Privacy first
LEON_OVER_HTTP=true         # Web interface enabled
```

### Adding Secrets Later

1. **Local Development**: Use `master.secrets.json`
   ```bash
   cp master.secrets.json.template master.secrets.json
   # Edit master.secrets.json with your API keys
   # NEVER commit this file
   ```

2. **Railway Deployment**: Add to Railway environment variables
   ```bash
   # In Railway dashboard:
   LEON_LLM=true
   LEON_LLM_PROVIDER=groq
   LEON_LLM_PROVIDER_API_KEY=your_key_here
   ```

See **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)** for detailed instructions.

## 💰 Cost Protection

### Free-Tier Limits (Railway)

- **Execution Time**: 500 hours/month
- **RAM**: 512MB per service
- **CPU**: Shared (no guarantees)
- **Network**: 100GB outbound/month
- **Builds**: 500 minutes/month

### Automatic Protection

When usage reaches 80% of free-tier limits:

1. 🔍 **Detection**: Monitoring detects threshold breach
2. 🛑 **Action**: Deploy maintenance page
3. 💤 **Suspension**: Main service paused
4. 📋 **Preparation**: Generate migration checklist
5. 🔄 **Failover**: Prepare Coolify migration

### Manual Monitoring

Check usage in Railway dashboard:
- Navigate to Project → Usage tab
- Review metrics regularly
- Set up usage alerts

## 🔄 Migration Paths

### When Free-Tier Limits Are Reached

**Option 1: Upgrade Railway**
- Cost: Starting at $5/month
- Action: Upgrade subscription
- Benefit: No migration needed

**Option 2: Migrate to Coolify**
- Cost: ~$9/month (VPS)
- Action: Follow [COOLIFY_MIGRATION.md](./COOLIFY_MIGRATION.md)
- Benefit: Full control, no limits

**Option 3: Self-Host**
- Cost: Your infrastructure
- Action: Clone and deploy locally
- Benefit: Complete privacy

**Option 4: Hybrid**
- Cost: Mixed
- Action: Railway + Coolify
- Benefit: Best of both worlds

## 🧪 Verification

Before deploying, verify configuration:

```bash
# Set environment variables
export LEON_LANG=en-US
export LEON_HOST=http://localhost
export LEON_PORT=1337
export LEON_OVER_HTTP=true

# Run verification
node scripts/verify-free-tier.js
```

Expected output:
```
✓ All checks passed! Ready for deployment.
Deployment Mode: Zero-Secrets
Features Enabled:
  • Web interface
  • HTTP API
  • Basic skills (games, utilities)
  • Offline operation
```

## 📊 Architecture

```
┌─────────────────────────────────────────────┐
│     Railway Zero-Secrets Deployment         │
└─────────────────────────────────────────────┘
                     ↓
        ┌────────────────────────┐
        │   Auto-Configuration   │
        │  • No secrets needed   │
        │  • Safe defaults       │
        │  • Minimal resources   │
        └────────────────────────┘
                     ↓
        ┌────────────────────────┐
        │   Leon AI Instance     │
        │  • Web UI              │
        │  • HTTP API            │
        │  • Core skills         │
        └────────────────────────┘
                     ↓
        ┌────────────────────────┐
        │   Cost Protection      │
        │  • Usage monitoring    │
        │  • Auto-shutdown       │
        │  • Maintenance mode    │
        └────────────────────────┘
                     ↓
        ┌────────────────────────┐
        │   Migration Ready      │
        │  • Coolify prepared    │
        │  • Hostinger VPN       │
        │  • Checklist ready     │
        └────────────────────────┘
```

## 🛠️ Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Verify Node.js version (requires >= 22.13.1)
- Try rebuild: Deploy → Redeploy

### Application Won't Start
- Check deployment logs
- Verify environment variables
- Ensure port configuration is correct

### Features Not Working
- Verify feature is enabled
- Check if API keys required
- Review application logs

See **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)** for detailed troubleshooting.

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../.github/CONTRIBUTING.md) for guidelines.

## 📝 License

This project is licensed under the MIT License - see [LICENSE.md](./LICENSE.md) for details.

## 🙏 Acknowledgments

- **Leon AI Team**: Original project maintainers
- **Railway**: Deployment platform
- **Coolify**: Self-hosted PaaS alternative
- **Community**: Contributors and testers

## 🔗 Links

- **Leon AI Website**: https://getleon.ai
- **Leon AI Documentation**: https://docs.getleon.ai
- **Leon AI Discord**: https://discord.gg/MNQqqKg
- **Railway**: https://railway.app
- **Coolify**: https://coolify.io
- **Original Repository**: https://github.com/leon-ai/leon

## 📞 Support

- **Documentation**: Read the docs in this repository
- **Discord**: Join the Leon AI community
- **Issues**: Report bugs on GitHub
- **Discussions**: Ask questions in GitHub Discussions

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Railway build completes
- ✅ Application starts and stays running
- ✅ Public URL is accessible
- ✅ Web interface loads
- ✅ Basic skills respond
- ✅ No errors in logs
- ✅ Resource usage within limits
- ✅ Health checks pass

## 📅 Version

**Version**: 1.0  
**Last Updated**: 2025-12-04  
**Status**: Production Ready

---

**Made with ❤️ by the Leon AI Community**

[![Star on GitHub](https://img.shields.io/github/stars/leon-ai/leon?style=social)](https://github.com/leon-ai/leon)
[![Follow on Twitter](https://img.shields.io/twitter/follow/grenlouis?style=social)](https://twitter.com/grenlouis)
