# Coolify Migration Checklist

This document provides a step-by-step checklist for migrating Leon AI from Railway to Coolify when free-tier limits are breached or migration is otherwise required.

## Migration Overview

**Reason for Migration**: Free-tier resource limits reached or cost optimization required  
**Target Platform**: Coolify (self-hosted PaaS)  
**Migration Type**: Zero-downtime with maintenance page fallback  
**Estimated Time**: 2-4 hours

---

## Pre-Migration Checklist

### 1. Server Preparation
- [ ] Provision server for Coolify (minimum 2GB RAM, 2 CPU cores, 20GB disk)
- [ ] Install Docker and Docker Compose on server
- [ ] Install Coolify using: `curl -fsSL https://get.coollabs.io | bash`
- [ ] Access Coolify UI and complete initial setup
- [ ] Configure firewall rules (allow ports 80, 443, 1337, 1342)
- [ ] Set up SSH key authentication for server access

### 2. DNS and Domain Configuration
- [ ] Choose domain or subdomain for Leon instance
- [ ] Update DNS A record to point to Coolify server IP
- [ ] Allow TTL to propagate (or set low TTL before migration)
- [ ] Test DNS resolution: `nslookup your-domain.com`

### 3. SSL/TLS Certificate Setup
- [ ] Configure Let's Encrypt in Coolify for automatic SSL
- [ ] Verify certificate generation and auto-renewal
- [ ] Test HTTPS access to Coolify server

### 4. Backup Current Deployment
- [ ] Export all environment variables from Railway
- [ ] Download any persistent data/logs from Railway
- [ ] Document current Railway configuration
- [ ] Save Railway deployment logs
- [ ] Export current `.env` configuration

---

## Migration Steps

### Phase 1: Deploy Maintenance Page on Railway
- [ ] Deploy `maintenance.html` as static site on Railway
- [ ] Verify maintenance page is accessible
- [ ] Suspend main Leon service on Railway (or scale to zero)
- [ ] Confirm cost protection is active

### Phase 2: Coolify Application Setup
- [ ] Log into Coolify dashboard
- [ ] Create new project: "Leon AI Assistant"
- [ ] Add Git repository (or use Docker image)
- [ ] Configure build settings:
  - [ ] Build pack: Nixpacks
  - [ ] Build command: `npm install && npm run build`
  - [ ] Start command: `npm start`
- [ ] Set port configuration: 1337 (public)
- [ ] Enable health checks: path `/`, interval 30s

### Phase 3: Environment Variables Configuration
- [ ] Copy environment variables from Railway
- [ ] Apply zero-secrets configuration:

```bash
# Core Settings
LEON_LANG=en-US
LEON_HOST=https://your-domain.com
LEON_PORT=1337
LEON_NODE_ENV=production

# Disable Optional Features
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
LEON_HTTP_API_KEY=<generate-new-key>
LEON_HTTP_API_LANG=en-US

# Privacy and Other Settings
LEON_TELEMETRY=false
LEON_PY_TCP_SERVER_HOST=0.0.0.0
LEON_PY_TCP_SERVER_PORT=1342
PIPENV_PIPFILE=tcp_server/src/Pipfile
PIPENV_VENV_IN_PROJECT=true
NODE_ENV=production
```

- [ ] Generate new HTTP API key: `npm run generate:http-api-key`
- [ ] Add LEON_HTTP_API_KEY to Coolify environment variables
- [ ] Verify all required variables are set

### Phase 4: Initial Deployment
- [ ] Trigger first build in Coolify
- [ ] Monitor build logs for errors
- [ ] Wait for build completion (may take 10-15 minutes)
- [ ] Check deployment status in Coolify dashboard
- [ ] Verify container is running: `docker ps`

### Phase 5: Testing and Validation
- [ ] Access Leon via Coolify URL: `https://your-domain.com`
- [ ] Verify web interface loads correctly
- [ ] Test basic conversation functionality
- [ ] Test HTTP API endpoint (if enabled)
- [ ] Verify games and utilities work (zero-secrets features)
- [ ] Check server logs for errors: `docker logs <container-id>`
- [ ] Monitor resource usage (CPU, RAM, disk)
- [ ] Run health check: `curl -f https://your-domain.com/`

### Phase 6: DNS and Traffic Migration
- [ ] Verify Coolify deployment is stable (15+ minutes uptime)
- [ ] Update primary DNS record to point to Coolify server
- [ ] Wait for DNS propagation (can take 5 minutes to 48 hours)
- [ ] Monitor traffic shift using access logs
- [ ] Test from different networks to verify DNS update

### Phase 7: Railway Cleanup
- [ ] Verify all traffic is now on Coolify (check Railway logs)
- [ ] Remove maintenance page from Railway
- [ ] Delete Railway project or scale to zero
- [ ] Cancel Railway subscription (if paid tier)
- [ ] Export final Railway logs for records
- [ ] Remove Railway configuration from repository (optional)

---

## Post-Migration Checklist

### 1. Monitoring and Maintenance
- [ ] Set up monitoring for Coolify server (CPU, RAM, disk, network)
- [ ] Configure log rotation for Leon application
- [ ] Set up automated backups for server
- [ ] Create backup of Coolify configuration
- [ ] Document new deployment URLs and credentials

### 2. Optional Feature Enablement
If you want to enable optional features after migration:

- [ ] Obtain API keys for desired services (LLM, TTS, STT)
- [ ] Update environment variables in Coolify
- [ ] Enable features one at a time:
  - [ ] LEON_LLM=true (if using LLM)
  - [ ] LEON_TTS=true (if using text-to-speech)
  - [ ] LEON_STT=true (if using speech-to-text)
- [ ] Test each feature after enabling
- [ ] Monitor resource usage with new features

### 3. Performance Optimization
- [ ] Analyze resource usage patterns
- [ ] Adjust server resources if needed
- [ ] Configure CDN for static assets (optional)
- [ ] Set up caching strategy (optional)
- [ ] Optimize database queries (if applicable)

### 4. Security Hardening
- [ ] Enable Coolify authentication
- [ ] Configure fail2ban on server
- [ ] Set up automatic security updates
- [ ] Review and restrict open ports
- [ ] Configure rate limiting for HTTP API
- [ ] Set up firewall rules (UFW or iptables)
- [ ] Enable audit logging

### 5. Documentation Updates
- [ ] Update deployment documentation with Coolify specifics
- [ ] Document new environment variables
- [ ] Update team access documentation
- [ ] Create runbook for common operations
- [ ] Document backup and restore procedures

---

## Rollback Plan

If migration fails or issues arise:

### Immediate Rollback to Railway
- [ ] Re-enable Leon service on Railway (scale up)
- [ ] Remove maintenance page from Railway
- [ ] Verify Railway deployment is working
- [ ] Revert DNS changes to point to Railway
- [ ] Wait for DNS propagation
- [ ] Notify users of rollback

### Troubleshooting Coolify Issues
- [ ] Check Coolify logs: `docker logs coolify`
- [ ] Check Leon container logs: `docker logs <leon-container>`
- [ ] Verify environment variables are set correctly
- [ ] Check server resources (disk space, memory)
- [ ] Verify network connectivity and firewall rules
- [ ] Review build logs for compilation errors
- [ ] Test with minimal configuration first

---

## Common Issues and Solutions

### Build Failures
**Issue**: Coolify build fails during npm install or build step  
**Solution**: 
- Check Node.js version compatibility
- Verify sufficient disk space on server
- Review build logs for specific error messages
- Ensure all dependencies are accessible

### Container Crashes
**Issue**: Leon container starts but crashes immediately  
**Solution**:
- Check container logs for error messages
- Verify environment variables are correct
- Ensure port 1337 is not already in use
- Check Python TCP server startup

### SSL Certificate Issues
**Issue**: HTTPS not working or certificate errors  
**Solution**:
- Verify DNS is pointing to correct server
- Check Let's Encrypt rate limits
- Ensure ports 80 and 443 are open
- Try manual certificate generation in Coolify

### Performance Issues
**Issue**: Slow response times or high resource usage  
**Solution**:
- Upgrade server resources (RAM, CPU)
- Disable unused features
- Check for memory leaks in logs
- Optimize database queries (if applicable)

---

## Cost Comparison

### Railway Free Tier (Before Migration)
- Cost: $0/month
- Limits: 500 hours/month, 512MB RAM, shared CPU
- Issues: Free-tier limits reached

### Coolify on Basic VPS (After Migration)
- Server Cost: $5-10/month (e.g., DigitalOcean, Linode, Vultr)
- Specs: 1-2 CPU cores, 2-4GB RAM, 50GB disk
- No usage limits within server capacity
- Full control and scalability

### Total Cost Savings
- Predictable monthly cost
- No surprise charges
- Can handle more traffic
- Better performance

---

## Support Resources

- **Coolify Documentation**: https://coolify.io/docs
- **Coolify Discord**: https://discord.gg/coolify
- **Leon AI Documentation**: https://docs.getleon.ai
- **Leon AI Discord**: https://discord.gg/MNQqqKg
- **This Repository Issues**: https://github.com/executiveusa/leon-avatar-fork-/issues

---

## Migration Status Tracker

**Migration Initiated**: [ ] Not Started | [ ] In Progress | [ ] Completed  
**Date Started**: _______________  
**Date Completed**: _______________  
**Performed By**: _______________  
**Issues Encountered**: _______________  
**Resolution Notes**: _______________

---

## Sign-off

Once migration is complete and stable:

- [ ] All checklist items completed
- [ ] Leon is accessible on Coolify
- [ ] All core features working
- [ ] DNS updated and propagated
- [ ] Railway resources cleaned up
- [ ] Documentation updated
- [ ] Team notified of new deployment URL

**Migration Approved By**: _______________  
**Date**: _______________  
**Signature**: _______________

---

**Last Updated**: 2025-12-04  
**Version**: 1.0  
**Status**: Ready for use when migration is triggered
