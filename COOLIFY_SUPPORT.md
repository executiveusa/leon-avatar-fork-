# Coolify Deployment Support

This document provides scaffolding and configuration notes for deploying Leon AI on Coolify as an alternative or fallback to Railway.

## Overview

Coolify is a self-hosted, open-source Platform-as-a-Service (PaaS) that allows you to deploy applications on your own infrastructure. This provides:

- **Cost Control**: Pay only for your server resources
- **No Free-Tier Limits**: Use resources as needed within your server capacity
- **Full Control**: Complete access to deployment configuration
- **Privacy**: Data stays on your infrastructure

## Prerequisites

1. A server running Coolify (minimum 2GB RAM recommended)
2. Domain name (optional but recommended)
3. SSH access to your server
4. Docker installed on the server (Coolify requirement)

## Coolify Configuration

### Application Settings

```yaml
# Coolify Application Type
type: dockerfile  # or nixpacks

# Build Settings
build_pack: nixpacks
build_command: npm install && npm run build
start_command: npm start

# Port Configuration
port: 1337
public: true
```

### Environment Variables

Use the same zero-secrets configuration as Railway:

```bash
# Core Settings
LEON_LANG=en-US
LEON_HOST=https://your-domain.com  # Update with your domain
LEON_PORT=1337
LEON_NODE_ENV=production

# Disable Optional Features (Zero-Secrets Mode)
LEON_LLM=false
LEON_LLM_PROVIDER=local
LEON_LLM_NLG=false
LEON_LLM_ACTION_RECOGNITION=false
LEON_AFTER_SPEECH=false
LEON_WAKE_WORD=false
LEON_STT=false
LEON_STT_PROVIDER=coqui-stt
LEON_TTS=false
LEON_TTS_PROVIDER=flite

# Enable HTTP API
LEON_OVER_HTTP=true
LEON_HTTP_API_KEY=<generate-with-npm-script>
LEON_HTTP_API_LANG=en-US

# Privacy
LEON_TELEMETRY=false

# Python TCP Server
LEON_PY_TCP_SERVER_HOST=0.0.0.0
LEON_PY_TCP_SERVER_PORT=1342

# Python Environment
PIPENV_PIPFILE=tcp_server/src/Pipfile
PIPENV_VENV_IN_PROJECT=true
NODE_ENV=production
```

### Resource Requirements

**Minimum Configuration:**
- CPU: 1 core
- RAM: 2GB
- Disk: 10GB
- Network: 100Mbps

**Recommended Configuration:**
- CPU: 2 cores
- RAM: 4GB
- Disk: 20GB
- Network: 1Gbps

## Docker Compose Configuration

A Docker Compose file for Coolify is available at `docker-compose.coolify.yml` (to be created during migration).

Basic structure:

```yaml
version: '3.8'

services:
  leon:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "1337:1337"
      - "1342:1342"
    environment:
      - LEON_LANG=en-US
      - LEON_HOST=https://your-domain.com
      - LEON_PORT=1337
      # Add other environment variables
    volumes:
      - leon-data:/app/data
      - leon-logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:1337"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  leon-data:
  leon-logs:
```

## Hostinger VPN Integration

If deploying on Hostinger infrastructure with VPN tunneling:

### VPN Tunnel Configuration

1. **Set up WireGuard VPN** on Hostinger VPS
2. **Configure tunnel** from Coolify server to Hostinger
3. **Update DNS** to point to VPN endpoint

Example WireGuard configuration:

```ini
[Interface]
PrivateKey = <your-private-key>
Address = 10.0.0.2/24
DNS = 1.1.1.1

[Peer]
PublicKey = <hostinger-public-key>
Endpoint = hostinger-vps-ip:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

### Hostinger-Specific Notes

- Use Hostinger's VPS for hosting Coolify
- Configure firewall rules for ports 1337, 1342
- Set up SSL/TLS certificates (Let's Encrypt via Coolify)
- Configure CDN if needed for static assets

## Migration from Railway

When migrating from Railway to Coolify:

1. **Export environment variables** from Railway
2. **Import into Coolify** application settings
3. **Test deployment** with zero-secrets configuration
4. **Update DNS** to point to Coolify instance
5. **Monitor performance** and resource usage

See `COOLIFY_MIGRATION.md` for detailed step-by-step migration guide.

## Advantages of Coolify Deployment

1. **No Free-Tier Limits**: Use server resources as available
2. **Predictable Costs**: Fixed server costs regardless of usage
3. **Full Control**: Access to all server and application settings
4. **Privacy**: Self-hosted data and processing
5. **Customization**: Modify deployment as needed
6. **Scalability**: Add resources by upgrading server

## Limitations

1. **Server Management**: You manage the infrastructure
2. **Initial Setup**: More complex than Railway
3. **Maintenance**: Responsible for updates and security
4. **Support**: Community support vs. managed service

## Getting Started with Coolify

1. **Install Coolify** on your server:
   ```bash
   curl -fsSL https://get.coollabs.io | bash
   ```

2. **Access Coolify UI** at `http://your-server-ip:3000`

3. **Create new application** and connect to Git repository

4. **Configure environment variables** using zero-secrets configuration

5. **Deploy** and monitor

## Support and Resources

- **Coolify Documentation**: https://coolify.io/docs
- **Coolify GitHub**: https://github.com/coollabsio/coolify
- **Leon AI Documentation**: https://docs.getleon.ai
- **Community Discord**: https://discord.gg/MNQqqKg

## Next Steps

This document provides the scaffolding for Coolify deployment. When ready to migrate:

1. Review `COOLIFY_MIGRATION.md` for step-by-step instructions
2. Prepare your Coolify server
3. Test deployment with zero-secrets configuration
4. Gradually add optional features and secrets as needed

## Status

**Current Status**: Scaffolding prepared, not yet activated

**Activation Trigger**: 
- Free-tier limit breach on Railway
- Manual decision to migrate
- Cost optimization requirements

**Last Updated**: 2025-12-04
