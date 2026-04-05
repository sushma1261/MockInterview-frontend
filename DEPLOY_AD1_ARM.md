# Oracle Free Tier Deployment Guide — AD-1 (Ampere A1)

> **VM:** VM.Standard.A1.Flex — ARM64 (aarch64) / Always Free
>
> **Why AD-1 is significantly better:**

| | AD-2 (what you have) | AD-1 (what you want) |
|---|---|---|
| Shape | VM.Standard.E2.1.Micro | VM.Standard.A1.Flex |
| OCPUs | 1 | **Up to 4** (free) |
| RAM | 1 GB | **Up to 24 GB** (free) |
| Architecture | AMD x86_64 | **ARM64 (Ampere)** |
| Boot Volume | 200 GB shared | 200 GB shared |

> Oracle gives **4 OCPUs + 24 GB RAM total** free across all A1 instances in your tenancy.
> Recommended allocation: **2 OCPU / 8 GB RAM** for a single VM running the full stack.

---

## ⚠️ Critical Difference: ARM64 Architecture

The A1 VM runs ARM64. Your Docker images **must be built for `linux/arm64`**, not `linux/amd64`.
This affects how you build the backend image on your Mac.

- **Apple Silicon Mac (M1/M2/M3):** You're already on ARM64 — builds natively, no extra flags needed.
- **Intel Mac:** You must cross-compile using Docker Buildx (instructions below).

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

Commit and push this change.

### 2. Build and push backend Docker image for ARM64

#### If you are on Apple Silicon Mac (M1/M2/M3):
```bash
# In your backend project folder:
docker login

docker build -f Dockerfile.prod \
  --platform linux/arm64 \
  -t <your-dockerhub-username>/mockinterview-backend:arm64 .

docker push <your-dockerhub-username>/mockinterview-backend:arm64
```

#### If you are on Intel Mac:
```bash
# Set up buildx for cross-compilation (one-time setup):
docker buildx create --name arm-builder --use
docker buildx inspect --bootstrap

# Build and push in one command:
docker buildx build \
  --platform linux/arm64 \
  -f Dockerfile.prod \
  -t <your-dockerhub-username>/mockinterview-backend:arm64 \
  --push .
```

> Cross-compilation from Intel is slower (~2–3x) but works correctly.

### 3. Update docker-compose.prod.yaml

Since AD-1 has plenty of RAM, you don't need to reduce memory limits like on the E2.1.Micro.
Just replace the `build:` block with `image:` in the backend service:

```yaml
backend:
  image: <your-dockerhub-username>/mockinterview-backend:arm64
  container_name: mockinterview-backend
  restart: always
  # remove the build: block entirely
```

Commit and push.

---

## Step 1 — Create the VM on Oracle Cloud

1. Go to **Compute → Instances → Create Instance**
2. **Name:** `mockinterview-vm`
3. **Availability Domain:** Select **AD-1**
4. **Image:** `Ubuntu 22.04 LTS` (Canonical) — click *Change Image*
5. **Shape:** Click *Change Shape* → Under **Ampere** tab → select `VM.Standard.A1.Flex`
   - Set **OCPUs: 2** and **RAM: 8 GB** (within the free 4 OCPU / 24 GB allowance)
6. **Networking:** Public subnet, assign a **Reserved Public IP** (won't change if VM restarts)
7. **SSH Keys:** Paste your public key
   ```bash
   # On your Mac:
   cat ~/.ssh/id_rsa.pub
   ```
8. **Boot Volume:** Set to **50 GB**
9. Click **Create** — wait ~2 minutes for **Running** state
10. Copy the **Public IP Address**

> **Reserved IP vs Ephemeral:** Always choose Reserved. Ephemeral IPs can change when the VM stops, which would break any domain A record you set up.

---

## Step 2 — Open Ports in OCI Security List

Go to **Networking → Virtual Cloud Networks → Your VCN → Security Lists → Default Security List → Add Ingress Rules:**

| Source CIDR | Protocol | Port | Purpose |
|---|---|---|---|
| 0.0.0.0/0 | TCP | 22 | SSH |
| 0.0.0.0/0 | TCP | 80 | HTTP |
| 0.0.0.0/0 | TCP | 443 | HTTPS |

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
sudo apt install -y git curl wget nginx certbot python3-certbot-nginx iptables-persistent htop
```

### Open VM-level firewall ports

```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

---

## Step 5 — Swap File (Optional but Recommended)

With 8 GB RAM you have ample headroom, but a small swap acts as a safety net:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## Step 6 — Install Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
newgrp docker

# Verify — architecture must show "aarch64" or "arm64"
docker --version
docker compose version
uname -m    # should print: aarch64
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
node -v
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
# OCI Vault keys (see OCI Vault section below if applicable)
```

```bash
# Pull the ARM64 image and start all services
docker compose -f docker-compose.prod.yaml pull
docker compose -f docker-compose.prod.yaml up -d

# Run database migrations
docker compose -f docker-compose.prod.yaml exec backend npm run migrate

# Enable pgvector extension (if not handled in migrations)
docker compose -f docker-compose.prod.yaml exec postgres \
  psql -U system -d mockinterview -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Verify all containers are running
docker compose -f docker-compose.prod.yaml ps

# Check backend health
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

```env
NEXT_PUBLIC_API_URL=http://<YOUR_VM_PUBLIC_IP>/api
# Add any other NEXT_PUBLIC_ variables your app uses
# Firebase config, etc.
```

```bash
# Install dependencies and build
# With 8 GB RAM this will complete in ~1–2 minutes without swap
npm install
npm run build

# Confirm standalone output
ls .next/standalone

# Start with PM2
pm2 start npm --name "frontend" -- start
pm2 save
pm2 startup
# ⚠️  Copy-paste and run the sudo command it prints
```

---

## Step 10 — Configure Nginx

```bash
sudo rm /etc/nginx/sites-enabled/default
sudo nano /etc/nginx/sites-available/mockinterview
```

```nginx
server {
    listen 80;
    server_name your-domain.com;    # or your VM's public IP

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
sudo ln -s /etc/nginx/sites-available/mockinterview /etc/nginx/sites-enabled/
sudo nginx -t        # must say "syntax is ok"
sudo systemctl enable nginx
sudo systemctl reload nginx
```

---

## Step 11 — Verify Everything Works

```bash
docker compose -f /home/ubuntu/backend/docker-compose.prod.yaml ps
pm2 status
sudo systemctl status nginx

curl http://localhost:8080/health    # backend direct
curl http://localhost:3000           # frontend direct
curl http://localhost/api/health     # backend via Nginx
curl http://localhost                # frontend via Nginx
```

Open `http://YOUR_VM_PUBLIC_IP` in your browser.

---

## Step 12 — (Optional) SSL with Let's Encrypt

Point your domain's A record to the VM's Reserved IP first, then:

```bash
sudo certbot --nginx -d your-domain.com
sudo certbot renew --dry-run    # verify auto-renewal
```

---

## Redeployment Workflow

### Backend changes
```bash
# On your Mac (Apple Silicon):
docker build -f Dockerfile.prod --platform linux/arm64 \
  -t <dockerhub-username>/mockinterview-backend:arm64 . && \
docker push <dockerhub-username>/mockinterview-backend:arm64

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
pm2 reload frontend
```

---

## OCI Vault / Instance Principal (if your backend uses oci-secrets)

### Option A — Instance Principal (recommended)
1. **Identity → Dynamic Groups** → Create group with rule:
   ```
   ALL {instance.id = 'ocid1.instance.oc1...<your-instance-ocid>'}
   ```
2. **Identity → Policies** → Create policy:
   ```
   Allow dynamic-group <your-group-name> to read secret-family in compartment <your-compartment>
   ```
3. No credentials needed in `.env` — SDK auto-detects instance credentials.

### Option B — API Key in .env
```env
OCI_TENANCY_ID=ocid1.tenancy.oc1..xxx
OCI_USER_ID=ocid1.user.oc1..xxx
OCI_FINGERPRINT=xx:xx:xx:...
OCI_PRIVATE_KEY_PATH=/home/ubuntu/.oci/private_key.pem
OCI_REGION=us-ashburn-1
```
```bash
# Upload private key from your Mac:
scp /path/to/key.pem ubuntu@<VM_IP>:/home/ubuntu/.oci/private_key.pem
```

---

## Troubleshooting

| Problem | Command / Fix |
|---|---|
| `exec format error` on container start | Image was built for wrong arch — rebuild with `--platform linux/arm64` |
| Site not loading on port 80 | Check OCI Security List AND `sudo iptables -L` |
| Nginx 502 Bad Gateway | `pm2 status` and `docker ps` — one of them is down |
| Container keeps restarting | `docker compose logs backend` — likely missing `.env` variable |
| PM2 not auto-starting on reboot | Re-run `pm2 startup` and execute the printed `sudo` command |
| pgvector extension missing | `docker compose exec postgres psql -U system -d mockinterview -c "CREATE EXTENSION IF NOT EXISTS vector;"` |
| `newgrp docker` didn't work | Log out of SSH and back in — group membership needs a fresh session |

---

## Key Differences vs AD-2 Guide

| | AD-2 (DEPLOY_FULL.md) | AD-1 (this guide) |
|---|---|---|
| Swap required | Yes — mandatory | Optional safety net |
| Build time (FE) | 3–5 min (uses swap) | 1–2 min |
| Docker image tag | `:latest` (amd64) | `:arm64` |
| Build flag needed | None | `--platform linux/arm64` |
| Postgres memory limits | Must be reduced | Can use defaults |
| Redis memory limit | 64mb | Can use defaults |
