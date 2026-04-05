# Frontend Deployment Guide — GitHub Actions + Oracle VM

> **Approach:** GitHub Actions builds the Next.js app and deploys it to the VM automatically on every push to `main`. No building on the VM — saves RAM and eliminates manual steps.
>
> **VM runs:** Node.js + PM2 (to serve the app) + Nginx (reverse proxy)
> **GitHub Actions does:** `npm install` + `npm run build` + copies output to VM + restarts PM2

---

## How It Works

```
Push to main
     ↓
GitHub Actions (ubuntu-latest runner)
  - npm ci
  - npm run build
  - scp .next/standalone + static + public → VM
  - ssh → pm2 reload
     ↓
VM serves the app via PM2 + Nginx
```

---

## Part 1 — One-Time VM Setup

SSH into your VM and run these once:

### Install Node.js + PM2

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

# Install PM2
npm install -g pm2
```

### Create the frontend directory

```bash
mkdir -p /home/ubuntu/frontend/.next/standalone
mkdir -p /home/ubuntu/frontend/.next/static
mkdir -p /home/ubuntu/frontend/public
```

### Create the environment file

```bash
nano /home/ubuntu/frontend/.env.local
```

Add your frontend environment variables:
```env
NEXT_PUBLIC_API_URL=http://129.146.142.201/api
# Add all other NEXT_PUBLIC_ variables your app needs
# Firebase config variables, etc.
```

### Start PM2 with a placeholder (so it knows the process)

```bash
# Start the server (will fail first time since no build exists yet — that's ok)
pm2 start node --name "frontend" -- /home/ubuntu/frontend/.next/standalone/server.js 2>/dev/null || true

# Save and enable auto-start on reboot
pm2 save
pm2 startup
# ⚠️ Copy-paste and run the sudo command it prints
```

---

## Part 2 — Changes Required in Your Frontend Repo

### 1. Verify next.config.ts has standalone output

Your [next.config.ts](next.config.ts) already has this — no change needed:
```ts
const nextConfig: NextConfig = {
  output: 'standalone',   // ✓ already set
  ...
};
```

### 2. Create the GitHub Actions workflow

Create this file in your frontend repo:

**`.github/workflows/deploy-frontend.yml`**

```yaml
name: Deploy Frontend to VM

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
          # Add other NEXT_PUBLIC_ vars below as needed:
          # NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}

      - name: Copy standalone build to VM
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.VM_HOST }}
          username: ubuntu
          key: ${{ secrets.VM_SSH_KEY }}
          source: ".next/standalone/"
          target: "/home/ubuntu/frontend/"
          strip_components: 1

      - name: Copy static assets to VM
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.VM_HOST }}
          username: ubuntu
          key: ${{ secrets.VM_SSH_KEY }}
          source: ".next/static/"
          target: "/home/ubuntu/frontend/.next/"
          strip_components: 0

      - name: Copy public folder to VM
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.VM_HOST }}
          username: ubuntu
          key: ${{ secrets.VM_SSH_KEY }}
          source: "public/"
          target: "/home/ubuntu/frontend/"
          strip_components: 0

      - name: Reload PM2
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VM_HOST }}
          username: ubuntu
          key: ${{ secrets.VM_SSH_KEY }}
          script: |
            export NVM_DIR="$HOME/.nvm"
            source "$NVM_DIR/nvm.sh"
            pm2 reload frontend || pm2 start node --name "frontend" -- /home/ubuntu/frontend/server.js
            pm2 save
```

---

## Part 3 — Add GitHub Repository Secrets

Go to your **frontend repo on GitHub → Settings → Secrets and variables → Actions → Repository secrets → New repository secret**

Add these secrets:

| Secret Name | Value |
|---|---|
| `VM_HOST` | `129.146.142.201` |
| `VM_SSH_KEY` | Your private SSH key (see below) |
| `NEXT_PUBLIC_API_URL` | `http://129.146.142.201/api` |

> Add any other `NEXT_PUBLIC_` variables your app uses as secrets too.

### Getting your SSH private key

```bash
# On your Mac:
cat ~/.ssh/id_rsa
```

Copy the **entire output** including the header and footer:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

Paste the whole thing as the value for `VM_SSH_KEY`.

---

## Part 4 — Configure Nginx on the VM

```bash
# Remove the default site
sudo rm -f /etc/nginx/sites-enabled/default

# Create the app config
sudo nano /etc/nginx/sites-available/mockinterview
```

Paste this config:

```nginx
server {
    listen 80;
    server_name 129.146.142.201;    # replace with domain later

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

# Test config
sudo nginx -t    # must say "syntax is ok"

# Enable and start
sudo systemctl enable nginx
sudo systemctl reload nginx
```

---

## Part 5 — Trigger First Deployment

```bash
# In your frontend repo on your Mac:
git add .github/workflows/deploy-frontend.yml
git commit -m "Add GitHub Actions frontend deployment"
git push origin main
```

Watch it run at: `github.com/<your-username>/MockInterview-frontend/actions`

The workflow takes ~3–5 minutes. Once it shows green ✓, open `http://129.146.142.201` in your browser.

---

## Verify Everything is Working

On the VM:
```bash
# PM2 running?
pm2 status

# Nginx running?
sudo systemctl status nginx

# Frontend responding?
curl http://localhost:3000

# Full stack via Nginx?
curl http://localhost
curl http://localhost/api/health
```

---

## Every Future Deployment

Just push to `main` — GitHub Actions handles everything automatically:

```bash
git add .
git commit -m "your changes"
git push origin main
# GitHub Actions builds and deploys automatically
```

---

## Adding a Domain Later

### 1. Update Nginx config on the VM
```bash
sudo nano /etc/nginx/sites-available/mockinterview
# Change: server_name 129.146.142.201;
# To:     server_name your-domain.com;
sudo nginx -t && sudo systemctl reload nginx
```

### 2. Update GitHub secret
Go to repo → Settings → Secrets → update `NEXT_PUBLIC_API_URL`:
```
https://your-domain.com/api
```

### 3. Redeploy (push an empty commit to trigger Actions)
```bash
git commit --allow-empty -m "Update API URL for domain"
git push origin main
```

### 4. Add SSL
```bash
sudo certbot --nginx -d your-domain.com
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| GitHub Actions fails at SCP step | Check `VM_SSH_KEY` secret has the full private key including header/footer |
| PM2 not found in SSH step | The `source nvm.sh` line in the workflow loads nvm — check nvm is installed on VM |
| Site shows 502 Bad Gateway | PM2 process crashed — check `pm2 logs frontend` on VM |
| `server.js` not found | Build didn't copy correctly — re-run the workflow |
| Actions builds but site unchanged | Hard refresh browser (Cmd+Shift+R) — may be cached |
