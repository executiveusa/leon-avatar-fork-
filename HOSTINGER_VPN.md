# Hostinger VPN Deployment Notes

This document provides scaffolding and configuration notes for deploying Leon AI with Hostinger VPS and VPN tunneling support.

## Overview

Hostinger VPN deployment enables:
- **Private Network**: Secure VPN tunnel between services
- **Cost-Effective**: Affordable VPS hosting
- **Full Control**: Root access to infrastructure
- **Geographic Options**: Choose datacenter location
- **Scalability**: Easy resource upgrades

## Status

**Current Status**: ⚠️ Scaffolding Only - Not Active

This is a placeholder configuration for future Hostinger VPN deployments. It is not currently activated or required for Railway deployment.

## Prerequisites

1. **Hostinger VPS**: Minimum 2GB RAM, 2 CPU cores
2. **VPN Software**: WireGuard or OpenVPN
3. **Domain**: Optional but recommended
4. **SSH Access**: Root or sudo access to VPS
5. **Coolify**: Installed on Hostinger VPS (optional)

## Hostinger VPS Setup

### 1. Choose VPS Plan

Recommended plan for Leon AI:

- **KVM 2**: 2 vCPU, 4GB RAM, 50GB SSD - $8.99/month
- **KVM 4**: 4 vCPU, 8GB RAM, 100GB SSD - $14.99/month

Choose datacenter location closest to your users.

### 2. Initial Server Setup

```bash
# Update system
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git ufw fail2ban

# Configure firewall
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
ufw allow 1337/tcp # Leon main port
ufw allow 1342/tcp # Leon TCP server
ufw allow 51820/udp # WireGuard VPN
ufw enable

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

## WireGuard VPN Configuration

### Server Configuration

1. **Install WireGuard**:
```bash
apt install -y wireguard
```

2. **Generate Keys**:
```bash
cd /etc/wireguard
wg genkey | tee server_private.key | wg pubkey > server_public.key
chmod 600 server_private.key
```

3. **Create Server Config** (`/etc/wireguard/wg0.conf`):
```ini
[Interface]
PrivateKey = <server_private_key>
Address = 10.0.0.1/24
ListenPort = 51820
SaveConfig = true

# Enable IP forwarding
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Client peer configuration
[Peer]
# Client 1
PublicKey = <client_public_key>
AllowedIPs = 10.0.0.2/32
```

4. **Enable WireGuard**:
```bash
systemctl enable wg-quick@wg0
systemctl start wg-quick@wg0
```

### Client Configuration

For connecting other services through VPN:

```ini
[Interface]
PrivateKey = <client_private_key>
Address = 10.0.0.2/24
DNS = 1.1.1.1

[Peer]
PublicKey = <server_public_key>
Endpoint = <hostinger_vps_ip>:51820
AllowedIPs = 10.0.0.0/24
PersistentKeepalive = 25
```

## Coolify + Hostinger Integration

### Install Coolify on Hostinger VPS

```bash
# Install Coolify
curl -fsSL https://get.coollabs.io | bash

# Access Coolify UI
# Navigate to http://your-hostinger-ip:3000
```

### Configure Leon AI in Coolify

1. Create new project in Coolify
2. Connect Git repository
3. Set environment variables (zero-secrets configuration)
4. Deploy application

See `COOLIFY_SUPPORT.md` for detailed Coolify configuration.

## VPN Tunnel Use Cases

### Use Case 1: Multi-Service Architecture

Connect Leon AI on Railway to supporting services on Hostinger:

```
Railway (Leon Main) <-> VPN Tunnel <-> Hostinger (Database, Cache, etc.)
```

Configuration:
- Install WireGuard client on Railway (if supported)
- Configure Leon to use VPN tunnel for backend services
- Encrypt all traffic through tunnel

### Use Case 2: Hybrid Deployment

Run main Leon service on Railway, heavy processing on Hostinger:

```
Railway (Web Interface) <-> VPN <-> Hostinger (LLM, TTS, STT processing)
```

Benefits:
- Railway handles web traffic (cheap)
- Hostinger handles compute (flexible resources)
- VPN ensures secure communication

### Use Case 3: Failover Setup

Use Hostinger as failover when Railway free-tier exceeded:

```
Primary: Railway (Free Tier)
        ↓ (if limits exceeded)
Failover: Hostinger VPS (via Coolify)
```

## Network Architecture

### Recommended Setup

```
Internet
    ↓
[Load Balancer / CDN]
    ↓
[Hostinger VPS with Coolify]
    ↓
[WireGuard VPN]
    ↓
[Leon AI Services]
    ├── Web Interface (1337)
    ├── TCP Server (1342)
    └── Internal Services
```

### Security Layers

1. **Firewall**: UFW with minimal open ports
2. **VPN**: WireGuard encryption for internal traffic
3. **SSL/TLS**: Let's Encrypt certificates
4. **Fail2ban**: Intrusion prevention
5. **Rate Limiting**: Nginx or Cloudflare

## DNS Configuration

### For Hostinger Deployment

1. **Add A Record**:
   ```
   Type: A
   Name: leon (or @)
   Value: <hostinger_vps_ip>
   TTL: 3600
   ```

2. **Add CNAME** (optional subdomain):
   ```
   Type: CNAME
   Name: api
   Value: leon.yourdomain.com
   TTL: 3600
   ```

3. **Configure SSL**:
   - Use Coolify's built-in Let's Encrypt
   - Or manually with Certbot

## Cost Comparison

### Railway + Hostinger VPN Hybrid

- Railway (Free Tier): $0/month (web traffic)
- Hostinger VPS: $8.99/month (processing)
- Total: $8.99/month

### Full Hostinger Deployment

- Hostinger VPS: $8.99-14.99/month
- No usage limits
- Predictable costs

### Benefits of Hostinger

- No surprise charges
- Full resource control
- Better for compute-intensive tasks
- Suitable for LLM, TTS, STT processing

## Monitoring and Maintenance

### Monitoring Tools

```bash
# Install monitoring stack
docker run -d \
  --name=netdata \
  -p 19999:19999 \
  -v /proc:/host/proc:ro \
  -v /sys:/host/sys:ro \
  netdata/netdata
```

Access monitoring at `http://your-vps-ip:19999`

### Backup Strategy

```bash
# Automated daily backups
cat > /etc/cron.daily/leon-backup << 'EOF'
#!/bin/bash
tar -czf /backups/leon-$(date +%Y%m%d).tar.gz /app
find /backups -name "leon-*.tar.gz" -mtime +7 -delete
EOF

chmod +x /etc/cron.daily/leon-backup
```

## Troubleshooting

### VPN Connection Issues

```bash
# Check WireGuard status
wg show

# Check firewall
ufw status

# Test connectivity
ping 10.0.0.1  # From client
```

### Performance Issues

```bash
# Check resources
htop

# Check Docker containers
docker stats

# Check network
iftop
```

## Migration to Hostinger

When migrating from Railway to Hostinger:

1. Set up Hostinger VPS
2. Install Coolify
3. Configure VPN (optional)
4. Deploy Leon AI
5. Test thoroughly
6. Update DNS
7. Monitor performance

See `COOLIFY_MIGRATION.md` for detailed steps.

## Security Best Practices

1. **Regular Updates**: Keep system and packages updated
2. **Strong Passwords**: Use SSH keys, disable password auth
3. **Firewall Rules**: Minimal open ports
4. **VPN Only**: Restrict sensitive services to VPN
5. **Monitoring**: Set up alerts for unusual activity
6. **Backups**: Daily automated backups
7. **SSL/TLS**: Always use HTTPS

## Support Resources

- **Hostinger Support**: https://www.hostinger.com/support
- **WireGuard Docs**: https://www.wireguard.com/
- **Coolify Docs**: https://coolify.io/docs
- **Leon AI Docs**: https://docs.getleon.ai

## Status and Activation

**Current Status**: Scaffolding prepared, not activated

**To Activate**:
1. Provision Hostinger VPS
2. Follow setup instructions above
3. Configure VPN tunnel
4. Deploy Leon via Coolify
5. Update DNS and configuration

**Last Updated**: 2025-12-04
