# 🚀 Deployment Guide - Bang Perp Exchange

This guide covers how to deploy Bang Perp Exchange to various platforms.

## 📋 Pre-Deployment Checklist

### 1. Environment Configuration
Ensure you have the following environment variables configured:

```ini
VITE_RPC_ENDPOINT=<Your RPC endpoint>
VITE_DRIFT_ENV=<devnet or mainnet-beta>
VITE_DRIFT_BUILDER_CODE=<Your Drift Builder Code>
```

### 2. Testing
- [ ] Test all features on Devnet
- [ ] Verify wallet connections work
- [ ] Test trade execution
- [ ] Verify Builder Code attribution
- [ ] Check mobile responsiveness

### 3. Production Preparation
- [ ] Update RPC endpoint to mainnet (if deploying to mainnet)
- [ ] Update Drift environment to mainnet-beta
- [ ] Add your Drift Builder Code
- [ ] Review Terms of Service
- [ ] Ensure risk warnings are prominent

## 🌐 GitHub Pages Deployment

### Option 1: Manual Deployment

1. **Update vite.config.ts**
   
   Add the base path for your repository:
   ```typescript
   export default defineConfig({
     base: '/trading-perpetual-futures/',
     // ... rest of config
   })
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy to gh-pages**
   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

4. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Select `gh-pages` branch
   - Save

### Option 2: Automated Deployment (CI/CD)

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to `main`.

1. **Setup GitHub Secrets**
   
   Go to Settings → Secrets and variables → Actions, and add:
   - `VITE_RPC_ENDPOINT`: Your Solana RPC endpoint
   - `VITE_DRIFT_ENV`: `devnet` or `mainnet-beta`
   - `VITE_DRIFT_BUILDER_CODE`: Your Drift Builder Code

2. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: GitHub Actions

3. **Push to main branch**
   ```bash
   git push origin main
   ```

The workflow will automatically build and deploy your site.

## ▲ Vercel Deployment

Vercel provides fast, global CDN deployment with zero configuration.

### Method 1: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add VITE_RPC_ENDPOINT
   vercel env add VITE_DRIFT_ENV
   vercel env add VITE_DRIFT_BUILDER_CODE
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Method 2: Vercel Dashboard

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**
   - Add `VITE_RPC_ENDPOINT`
   - Add `VITE_DRIFT_ENV`
   - Add `VITE_DRIFT_BUILDER_CODE`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy on every git push

## 🌊 Netlify Deployment

### Method 1: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Initialize**
   ```bash
   netlify init
   ```

4. **Build and Deploy**
   ```bash
   npm run build
   netlify deploy --prod
   ```

### Method 2: Netlify Dashboard

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add your environment variables

4. **Deploy**
   - Netlify will automatically deploy

### Create netlify.toml

Create a `netlify.toml` file in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

## 🐳 Docker Deployment

### Create Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_RPC_ENDPOINT
ARG VITE_DRIFT_ENV
ARG VITE_DRIFT_BUILDER_CODE

ENV VITE_RPC_ENDPOINT=$VITE_RPC_ENDPOINT
ENV VITE_DRIFT_ENV=$VITE_DRIFT_ENV
ENV VITE_DRIFT_BUILDER_CODE=$VITE_DRIFT_BUILDER_CODE

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Create nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Build and Run

```bash
# Build
docker build -t bang-perp-exchange \
  --build-arg VITE_RPC_ENDPOINT=https://api.devnet.solana.com \
  --build-arg VITE_DRIFT_ENV=devnet \
  --build-arg VITE_DRIFT_BUILDER_CODE=your_code \
  .

# Run
docker run -p 8080:80 bang-perp-exchange
```

## 🔧 Custom Server Deployment

### Using Node.js with serve

1. **Install serve**
   ```bash
   npm install -g serve
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Serve**
   ```bash
   serve -s dist -p 3000
   ```

### Using Apache

1. Build the project
2. Copy `dist/` contents to your Apache web root
3. Configure `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 🔐 Security Considerations

### HTTPS
- **Always use HTTPS in production**
- Most platforms (Vercel, Netlify, GitHub Pages) provide automatic HTTPS
- For custom servers, use Let's Encrypt certificates

### Environment Variables
- **Never commit `.env.local` to git**
- Use platform-specific secrets management
- Rotate RPC endpoints and Builder Codes if compromised

### Content Security Policy

Add to your `index.html`:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-eval'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' https://*.solana.com https://drift.trade;">
```

## 📊 Monitoring

### Recommended Tools
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, LogRocket
- **Analytics**: Google Analytics, Plausible
- **Performance**: Lighthouse CI

### Setup Example (Sentry)

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.VITE_DRIFT_ENV,
  tracesSampleRate: 1.0,
});
```

## 🚀 Post-Deployment

### 1. Verify Deployment
- [ ] Site loads correctly
- [ ] Wallet connections work
- [ ] Trading functions properly
- [ ] All links work
- [ ] Mobile responsiveness

### 2. Setup Monitoring
- [ ] Configure uptime monitoring
- [ ] Setup error tracking
- [ ] Enable analytics

### 3. Promote Your Site
- [ ] Share on Twitter
- [ ] Post in Solana communities
- [ ] Submit to Drift Protocol showcase

### 4. Maintenance
- [ ] Monitor Drift SDK updates
- [ ] Update dependencies regularly
- [ ] Review security advisories
- [ ] Backup configuration

## 📈 Scaling

### Performance Optimization
- Use a premium RPC endpoint (QuickNode, Helius)
- Implement caching strategies
- Use CDN for static assets
- Enable compression

### High Availability
- Use multiple RPC endpoints with fallback
- Deploy to multiple regions
- Implement health checks
- Setup automated failover

## 🆘 Troubleshooting

### Build Fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`
- Check Node.js version: `node --version` (should be 18+)

### Environment Variables Not Working
- Prefix must be `VITE_` for Vite
- Restart dev server after changes
- Check `.env.local` is in project root

### Wallet Connection Issues
- Ensure HTTPS in production
- Check wallet extension is installed
- Verify RPC endpoint is correct

### Trading Fails
- Check Drift user account exists
- Verify sufficient USDC balance
- Ensure correct network (devnet/mainnet)

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [Drift Protocol Docs](https://docs.drift.trade/)

---

**Happy Deploying! 🚀**

For issues or questions, open an issue on GitHub or join the Drift Protocol Discord.