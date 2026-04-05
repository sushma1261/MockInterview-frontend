# Full Stack Deployment Guide — Oracle Free Tier

> **VM:** VM.Standard.E2.1.Micro — 1 OCPU / 1 GB RAM / AMD x86_64 / AD-2
>
> **Stack:**
> - **Backend** — PostgreSQL (pgvector) + Redis + Node.js API — all in Docker
> - **Frontend** — Next.js 15 — managed by PM2 (native, no Docker)
> - **Nginx** — reverse proxy for both, handles all public traffic

---

## Memory Budget

| Service | Target RAM |
|---|---|
| OS + system overhead | ~150 MB |
| Docker daemon | ~100 MB |
| PostgreSQL (pgvector) | ~150 MB |
| Redis | ~50 MB |
| Node.js backend (Docker) | ~250 MB |
| Next.js frontend (PM2) | ~150 MB |
| Nginx | ~20 MB |
| **Total** | **~870 MB** + 2 GB swap buffer |

> The swap file is not optional — it's what keeps the VM stable under peak load.

---

## Before You Start — Do This on Your Mac

### 1. Enable Next.js standalone output

Edit `next.config.ts` and add `output: 'standalone'`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
```

Commit and push this change to your frontend repo.

### 2. Build and push your backend Docker image

> **Do NOT build on the VM** — 1 GB RAM + build tools = OOM crash.
> Build locally and push to Docker Hub (free tier is sufficient).

```bash
# In your backend project folder:

# Log in to Docker Hub (create account at hub.docker.com if needed)
docker login

# Build the production image
docker build -f Dockerfile.prod -t <your-dockerhub-username>/mockinterview-backend:latest .

# Push to Docker Hub
docker push <your-dockerhub-username>/mockinterview-backend:latest
```

### 3. Update docker-compose.prod.yaml for 1 GB RAM

Make these changes to your backend's `docker-compose.prod.yaml` before pushing:

**Reduce postgres memory settings:**
```yaml
environment:
  POSTGRES_USER: ${POSTGRES_USER:-system}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme}
  POSTGRES_DB: ${POSTGRES_DB:-mockinterview}
  POSTGRES_MAX_CONNECTIONS: 50
  POSTGRES_SHARED_BUFFERS: 128MB
  POSTGRES_EFFECTIVE_CACHE_SIZE: 256MB
  POSTGRES_WORK_MEM: 4MB
```

**Reduce redis memory limit:**
```yaml
command: >
  redis-server
  --maxmemory 64mb
  --maxmemory-policy allkeys-lru
  --save 900 1
  --save 300 10
```

**Replace `build:` with `image:` in the backend service:**
```yaml
backend:
  image: <your-dockerhub-username>/mockinterview-backend:latest
  container_name: mockinterview-backend
  restart: always
  # remove the build: block entirely
```

Commit and push these changes to your backend repo.

---

## Step 1 — Create the VM on Oracle Cloud

1. Go to **Compute → Instances → Create Instance**
2. **Name:** `mockinterview-vm`
3. **Availability Domain:** Select **AD-2** (the one available to you)
4. **Image:** `Ubuntu 22.04 LTS` (Canonical) — click *Change Image* to select it
5. **Shape:** `VM.Standard.E2.1.Micro` (confirm it shows AMD / AD-2)
6. **Networking:** Public subnet, assign a **Reserved Public IP**
7. **SSH Keys:** Paste your public key
   ```bash
   # On your Mac:
   cat ~/.ssh/id_rsa.pub
   ```
8. **Boot Volume:** Set to **50 GB**
9. Click **Create** — wait ~2 minutes for it to reach **Running** state
10. Copy the **Public IP Address** from the instance details

---

## Step 2 — Open Ports in OCI Security List

Go to **Networking → Virtual Cloud Networks → Your VCN → Security Lists → Default Security List → Add Ingress Rules:**

| Source CIDR | Protocol | Port | Purpose |
|---|---|---|---|
| 0.0.0.0/0 | TCP | 22 | SSH |
| 0.0.0.0/0 | TCP | 80 | HTTP |
| 0.0.0.0/0 | TCP | 443 | HTTPS |

> Backend (8080) and frontend (3000) ports do NOT need to be public — Nginx proxies them internally.

---

## Step 3 — SSH into the VM

```bash
ssh ubuntu@<YOUR_VM_PUBLIC_IP>
```

> All remaining steps are run **on the VM** unless stated otherwise.

---

## Step 4 — System Setup

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install essentials
sudo apt install -y git curl wget nginx certbot python3-certbot-nginx iptables-persistent
```

### Open VM-level firewall ports

OCI Ubuntu blocks ports at the OS iptables level even after the VCN Security List allows them:

```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

---

## Step 5 — Create Swap File (Critical)

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Persist across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Only use swap when RAM is nearly full (important for performance)
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Verify — should show ~2 GB swap
free -h
```

---

## Step 6 — Install Docker (for Backend)

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
newgrp docker

# Verify
docker --version
docker compose version
```

---

## Step 7 — Install Node.js + PM2 (for Frontend)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

# Install Node 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node -v    # v20.x.x
npm -v

# Install PM2
npm install -g pm2
```

---

## Step 8 — Deploy the Backend

```bash
# Clone your backend repo
git clone <YOUR_BACKEND_REPO_URL> /home/ubuntu/backend
cd /home/ubuntu/backend

# Create production environment file
nano .env
```

Paste all required environment variables:

```env
NODE_ENV=production
POSTGRES_USER=system
POSTGRES_PASSWORD=<strong-password-here>
POSTGRES_DB=mockinterview
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
REDIS_URL=redis://redis:6379

# All your API keys — Gemini, Firebase, etc.
# OCI Vault keys (see OCI Vault section at the bottom if applicable)
```

```bash
# Pull the pre-built image and start all services
docker compose -f docker-compose.prod.yaml pull
docker compose -f docker-compose.prod.yaml up -d

# Run database migrations
docker compose -f docker-compose.prod.yaml exec backend npm run migrate

# Enable pgvector extension (if not handled in migrations)
docker compose -f docker-compose.prod.yaml exec postgres \
  psql -U system -d mockinterview -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Verify all containers are running
docker compose -f docker-compose.prod.yaml ps

# Check backend is responding (adjust port if yours is different)
curl http://localhost:8080/health
```

---

## Step 9 — Deploy the Frontend

```bash
# Clone your frontend repo
git clone <YOUR_FRONTEND_REPO_URL> /home/ubuntu/frontend
cd /home/ubuntu/frontend

# Create environment file
nano .env.local
```

Add your frontend environment variables:

```env
NEXT_PUBLIC_API_URL=http://<YOUR_VM_PUBLIC_IP>/api
# Add any other NEXT_PUBLIC_ variables your app uses
# Firebase config, etc.
```

```bash
# Install dependencies
npm install

# Build — this will use swap and take 3–5 minutes
npm run build

# Confirm standalone output was created
ls .next/standalone

# Start with PM2
pm2 start npm --name "frontend" -- start

# Save process list and enable auto-start on reboot
pm2 save
pm2 startup
# ⚠️  Copy-paste and run the sudo command it prints, e.g.:
# sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.x.x/bin pm2 startup ...

# Verify it's running
pm2 status
```

---

## Step 10 — Configure Nginx

```bash
# Remove the default site
sudo rm /etc/nginx/sites-enabled/default

# Create the app config
sudo nano /etc/nginx/sites-available/mockinterview
```

Paste the following (replace `your-domain.com` with your domain or VM public IP):

```nginx
server {
    listen 80;
    server_name your-domain.com;    # or your VM's public IP

    # Increase body size limit for resume/file uploads
    client_max_body_size 20M;

    # ── Frontend — Next.js via PM2 on port 3000 ──────────────────────────────
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # ── Backend API — Node.js via Docker on port 8080 ────────────────────────
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Required for SSE / streaming (interview chat responses)
        proxy_buffering off;
        proxy_read_timeout 300s;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/mockinterview /etc/nginx/sites-enabled/

# Test config — must print "syntax is ok"
sudo nginx -t

# Enable and start Nginx
sudo systemctl enable nginx
sudo systemctl reload nginx
```

---

## Step 11 — Verify Everything Works

```bash
# All containers running?
docker compose -f /home/ubuntu/backend/docker-compose.prod.yaml ps

# Next.js running?
pm2 status

# Nginx running?
sudo systemctl status nginx

# Test each service individually
curl http://localhost:8080/health    # backend direct
curl http://localhost:3000           # frontend direct
curl http://localhost/api/health     # backend via Nginx
curl http://localhost                # frontend via Nginx
```

Open `http://YOUR_VM_PUBLIC_IP` in your browser — the app should load.

---

## Step 12 — (Optional) SSL with Let's Encrypt

Only possible if you have a domain name with an A record pointing to your VM's IP.

```bash
sudo certbot --nginx -d your-domain.com

# Verify auto-renewal works
sudo certbot renew --dry-run
```

Certbot automatically updates your Nginx config to redirect HTTP → HTTPS.

---

## Redeployment Workflow

### Backend changes

```bash
# On your Mac:
docker build -f Dockerfile.prod -t <dockerhub-username>/mockinterview-backend:latest .
docker push <dockerhub-username>/mockinterview-backend:latest

# On the VM:
cd /home/ubuntu/backend
docker compose -f docker-compose.prod.yaml pull
docker compose -f docker-compose.prod.yaml up -d --no-deps backend
```

### Frontend changes

```bash
# On the VM:
cd /home/ubuntu/frontend
git pull
npm install          # only if package.json changed
npm run build
pm2 reload frontend  # zero-downtime reload
```

---

## Updating Domain Name Later

### 1. Update Nginx config
```bash
sudo nano /etc/nginx/sites-available/mockinterview
# Change: server_name YOUR_VM_PUBLIC_IP;
# To:     server_name your-domain.com;
sudo nginx -t && sudo systemctl reload nginx
```

### 2. Update frontend env
```bash
nano /home/ubuntu/frontend/.env.local
# Change: NEXT_PUBLIC_API_URL=http://<IP>/api
# To:     NEXT_PUBLIC_API_URL=https://your-domain.com/api
cd /home/ubuntu/frontend && npm run build && pm2 reload frontend
```

### 3. Add SSL
```bash
sudo certbot --nginx -d your-domain.com
```

> Use a **Reserved IP** (not Ephemeral) in OCI so the IP never changes when the VM restarts.

---

## OCI Vault / Instance Principal Setup (if your backend uses oci-secrets)

### Option A — Instance Principal (recommended, no secrets in .env)

1. In OCI Console → **Identity → Dynamic Groups** → Create a group with rule:
   ```
   ALL {instance.id = 'ocid1.instance.oc1...<your-instance-ocid>'}
   ```
2. In **Identity → Policies** → Create policy:
   ```
   Allow dynamic-group <your-group-name> to read secret-family in compartment <your-compartment>
   ```
3. The OCI SDK on the VM will automatically detect instance credentials — no keys needed in `.env`.

### Option B — API Key in .env

1. In OCI Console → **Profile → API Keys** → Add API Key → Download private key
2. Add to your `.env`:
   ```env
   OCI_TENANCY_ID=ocid1.tenancy.oc1..xxx
   OCI_USER_ID=ocid1.user.oc1..xxx
   OCI_FINGERPRINT=xx:xx:xx:...
   OCI_PRIVATE_KEY_PATH=/home/ubuntu/.oci/private_key.pem
   OCI_REGION=us-ashburn-1
   ```
3. Upload the private key to the VM:
   ```bash
   # On your Mac:
   scp /path/to/downloaded_key.pem ubuntu@<VM_IP>:/home/ubuntu/.oci/private_key.pem
   ```

---

## Useful Commands Reference

```bash
# ── PM2 (Frontend) ────────────────────────────────────────────
pm2 status                   # list all processes and status
pm2 logs frontend            # tail frontend logs
pm2 reload frontend          # zero-downtime reload after build
pm2 restart frontend         # full restart

# ── Docker (Backend) ──────────────────────────────────────────
docker compose -f /home/ubuntu/backend/docker-compose.prod.yaml ps
docker compose -f /home/ubuntu/backend/docker-compose.prod.yaml logs -f backend
docker compose -f /home/ubuntu/backend/docker-compose.prod.yaml restart backend
docker stats --no-stream     # snapshot of container memory usage

# ── Nginx ─────────────────────────────────────────────────────
sudo nginx -t                # test config
sudo systemctl reload nginx  # apply config changes
sudo tail -f /var/log/nginx/error.log

# ── System Health ─────────────────────────────────────────────
free -h                      # RAM + swap usage
df -h                        # disk usage
sudo apt install -y htop && htop    # interactive process viewer
dmesg | grep -i oom          # check for out-of-memory kills
```

---

## Troubleshooting

| Problem | Command / Fix |
|---|---|
| Site not loading on port 80 | Check both OCI Security List AND `sudo iptables -L` |
| Nginx 502 Bad Gateway | Backend or frontend not running — check `pm2 status` and `docker ps` |
| Container keeps restarting | `docker compose logs backend` — likely missing `.env` variable |
| Next.js build OOM crash | Confirm swap is active: `free -h`, then retry `npm run build` |
| PM2 not starting on reboot | Re-run `pm2 startup` and execute the printed `sudo` command |
| pgvector extension missing | `docker compose exec postgres psql -U system -d mockinterview -c "CREATE EXTENSION IF NOT EXISTS vector;"` |
| OCI vault auth failing | Verify Instance Principal policy or check API key path in `.env` |
| `newgrp docker` didn't work | Log out of SSH and log back in — group membership needs a fresh session |
