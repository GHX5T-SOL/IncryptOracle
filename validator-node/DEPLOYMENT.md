# Validator Node Deployment Guide

This guide covers deploying the Incrypt Oracle validator node to various cloud platforms.

## Prerequisites

- Node.js 18+ installed on the server
- Private key with IO tokens for staking
- Access to Binance Smart Chain RPC endpoint
- (Optional) Docker installed for containerized deployment

## Local Deployment

### Ubuntu/Debian

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/GHX5T-SOL/IncryptOracle.git
cd IncryptOracle/validator-node

# Install dependencies
npm install

# Build
npm run build

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run with PM2 for process management
npm install -g pm2
pm2 start dist/index.js --name incrypt-validator
pm2 save
pm2 startup
```

## Docker Deployment

### Building

```bash
docker build -t incrypt-validator:latest .
```

### Running

```bash
docker run -d \
  --name incrypt-validator \
  --restart unless-stopped \
  --env-file .env \
  -p 3001:3001 \
  incrypt-validator:latest
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  validator:
    build: .
    container_name: incrypt-validator
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "3001:3001"
    volumes:
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Run:
```bash
docker-compose up -d
```

## Cloud Deployment

### AWS EC2

1. Launch EC2 instance (Ubuntu 22.04 LTS, t2.micro or larger)
2. SSH into instance
3. Follow Local Deployment steps above
4. Configure Security Group to allow port 3001 for health checks
5. Set up CloudWatch monitoring (optional)

### AWS ECS/Fargate

1. Build and push Docker image to ECR
2. Create ECS task definition with environment variables
3. Create ECS service
4. Configure load balancer for health checks

### Google Cloud Run

```bash
# Build and push image
gcloud builds submit --tag gcr.io/PROJECT_ID/incrypt-validator

# Deploy
gcloud run deploy incrypt-validator \
  --image gcr.io/PROJECT_ID/incrypt-validator \
  --platform managed \
  --region us-central1 \
  --set-env-vars "VALIDATOR_PRIVATE_KEY=...,ORACLE_ADDRESS=..."
```

### Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create incrypt-validator

# Set environment variables
heroku config:set VALIDATOR_PRIVATE_KEY=...
heroku config:set ORACLE_ADDRESS=...

# Deploy
git push heroku main
```

### Railway

1. Connect GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

## Process Management

### PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start validator
pm2 start dist/index.js --name incrypt-validator

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Monitor
pm2 monit

# View logs
pm2 logs incrypt-validator

# Restart
pm2 restart incrypt-validator

# Stop
pm2 stop incrypt-validator
```

### Systemd Service

Create `/etc/systemd/system/incrypt-validator.service`:

```ini
[Unit]
Description=Incrypt Oracle Validator Node
After=network.target

[Service]
Type=simple
User=validator
WorkingDirectory=/opt/incrypt-validator
ExecStart=/usr/bin/node /opt/incrypt-validator/dist/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable incrypt-validator
sudo systemctl start incrypt-validator
sudo systemctl status incrypt-validator
```

## Monitoring

### Health Checks

Configure your monitoring service to check:
- `GET http://validator-ip:3001/health` - Should return 200
- `GET http://validator-ip:3001/ready` - Should return 200 if ready

### Prometheus Metrics

Scrape metrics from `/metrics` endpoint.

### Logging

Logs are written to:
- Console (stdout/stderr)
- `combined.log` (all logs)
- `error.log` (errors only)

For production, consider:
- CloudWatch Logs (AWS)
- Stackdriver (GCP)
- ELK Stack
- Grafana Loki

## Security Best Practices

1. **Private Key Management**
   - Use environment variables, not files
   - Consider AWS Secrets Manager or HashiCorp Vault
   - Rotate keys periodically

2. **Network Security**
   - Restrict health check port (3001) to monitoring IPs only
   - Use VPN or private network for RPC access
   - Enable firewall rules

3. **Updates**
   - Keep Node.js updated
   - Update dependencies regularly
   - Monitor security advisories

4. **Monitoring**
   - Set up alerts for validator downtime
   - Monitor validator reputation
   - Track validation success rate

## Backup & Recovery

### Backup Configuration

```bash
# Backup .env (without sensitive data)
cp .env .env.backup
```

### Recovery Steps

1. Deploy validator node to new server
2. Restore configuration
3. Register with same private key (will detect existing registration)
4. Start validation

## Troubleshooting

### Validator Not Starting

- Check logs: `pm2 logs` or `journalctl -u incrypt-validator`
- Verify environment variables are set
- Check RPC endpoint is accessible
- Verify contract addresses

### High Memory Usage

- Reduce validation interval
- Limit number of feeds validated
- Upgrade server resources

### Network Issues

- Test RPC endpoint connectivity: `curl RPC_URL`
- Check firewall rules
- Verify network security groups

## Performance Tuning

- **Validation Interval**: Adjust based on feed requirements (60s default)
- **Concurrent Validations**: Currently sequential, can be parallelized
- **Data Source Timeouts**: Increase for slow APIs
- **Gas Price**: Configure optimal gas price for faster confirmations

## Cost Estimation

**Monthly costs** (approximate):
- Server: $10-50/month (depending on provider)
- Gas fees: ~$5-20/month (depending on validation frequency)
- Data source APIs: $0-50/month (if using premium APIs)

**Total**: ~$15-120/month per validator node

## Support

For issues or questions:
- GitHub Issues: https://github.com/GHX5T-SOL/IncryptOracle/issues
- Discord: https://discord.gg/XPSCUYVM65
- Email: incryptinvestments@protonmail.com

