# 🚀 Vercel Deployment Guide

This guide will help you deploy your Second Brain application to Vercel directly from your GitHub repository.

## 📋 Prerequisites

- ✅ GitHub repository with your code (already done)
- ✅ Vercel account (free at [vercel.com](https://vercel.com))
- ✅ GitHub account connected to Vercel

## 🎯 Deployment Methods

### Method 1: Vercel Dashboard (Recommended)

#### Step 1: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Select "Import Git Repository"

#### Step 2: Import Your Repository
1. Find and select `second-brain-concept-1` from your GitHub repositories
2. Click "Import"

#### Step 3: Configure Project
Vercel will automatically detect your Next.js project. Configure the following:

**Build Settings:**
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

**Environment Variables:**
Add these environment variables in Vercel:
```bash
# Database (if using)
DATABASE_URL="your_database_url_here"

# NextAuth (if using)
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your_nextauth_secret_here"

# AI SDK (if using)
ZAI_API_KEY="your_zai_api_key_here"

# Node Environment
NODE_ENV="production"
```

#### Step 4: Deploy
1. Click "Deploy"
2. Vercel will build and deploy your application
3. Wait for the deployment to complete (usually 2-5 minutes)

### Method 2: Vercel CLI

#### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
vercel --prod
```

Follow the prompts to link your project and deploy.

### Method 3: GitHub Integration (Automatic Deployments)

#### Step 1: Install Vercel for GitHub
1. Go to [vercel.com](https://vercel.com)
2. Navigate to your account settings
3. Click "GitHub" under "Integrations"
4. Click "Configure" and install Vercel for your GitHub account

#### Step 2: Configure Auto-Deploy
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Git"
4. Enable "Auto-Deploy" for the `main` branch
5. Configure any build hooks if needed

## 🔧 Environment Variables Setup

### Required Environment Variables

Create these environment variables in your Vercel project settings:

```bash
# Application Settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Database (Prisma)
DATABASE_URL="your_production_database_url"

# Authentication (NextAuth)
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET="generate_a_secure_secret_here"

# AI SDK (Z.ai)
ZAI_API_KEY="your_zai_api_key_here"

# Optional: Additional Services
REDIS_URL="your_redis_url_here"  # If using Redis
```

### How to Add Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Click "Settings" tab
3. Select "Environment Variables"
4. Add each variable with its value
5. Click "Add" and then "Save"

## 🏗️ Build Configuration

### Vercel Configuration (`vercel.json`)

Your project includes a pre-configured `vercel.json`:

```json
{
  "version": 2,
  "name": "second-brain-concept-1",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "framework": "nextjs"
}
```

### Build Script Updates

Your `package.json` already has the correct build scripts:

```json
{
  "scripts": {
    "build": "next build",
    "start": "NODE_ENV=production tsx server.ts",
    "db:push": "prisma db push",
    "db:generate": "prisma generate"
  }
}
```

## 🌐 Domain Configuration

### Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `yourapp.com`)
4. Follow the DNS configuration instructions

### Automatic HTTPS

Vercel automatically provides:
- ✅ Free SSL certificates
- ✅ Automatic HTTPS redirection
- ✅ CDN acceleration

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Go to "Analytics" tab in your Vercel dashboard
2. Enable Vercel Analytics
3. Track performance, visitors, and usage

### Logging

Vercel provides built-in logging:
- **Build Logs**: Available during deployment
- **Function Logs**: For serverless functions
- **Runtime Logs**: For application errors

## 🔍 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs in Vercel dashboard
# Common solutions:
- Ensure all dependencies are in package.json
- Check TypeScript errors
- Verify environment variables are set
```

#### 2. Database Connection Issues
```bash
# Verify DATABASE_URL is correct
# Ensure database is accessible from Vercel
# Check Prisma schema compatibility
```

#### 3. Environment Variables Missing
```bash
# Double-check all required env vars are set in Vercel
# Ensure no typos in variable names
# Verify values are correct
```

#### 4. NextAuth Issues
```bash
# Verify NEXTAUTH_URL matches your Vercel URL
# Ensure NEXTAUTH_SECRET is properly set
# Check callback URLs in your OAuth provider settings
```

### Debug Commands

```bash
# Local build test
npm run build

# Check environment variables locally
npm run start

# Database migration (if needed)
npm run db:migrate
```

## 🚀 Post-Deployment Checklist

### ✅ After Deployment

1. **Test Your Application**
   - Visit your Vercel URL
   - Test all major features
   - Check mobile responsiveness

2. **Verify Database**
   - Test database connections
   - Run any necessary migrations
   - Verify data persistence

3. **Check Authentication**
   - Test login/logout functionality
   - Verify OAuth callbacks work
   - Check session management

4. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor load times
   - Test API endpoints

5. **Set Up Monitoring**
   - Configure error tracking
   - Set up uptime monitoring
   - Enable alerts

## 🔄 Continuous Deployment

### Automatic Deployments

With GitHub integration, every push to `main` will automatically deploy:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel will automatically deploy!
```

### Deployment Hooks

Set up webhooks for:
- **Slack notifications** on deployment success/failure
- **Email alerts** for build failures
- **Custom integrations** with your CI/CD pipeline

## 📈 Scaling Your Application

### Vercel Features

- **Automatic Scaling**: Handles traffic spikes automatically
- **Serverless Functions**: Scale individual functions independently
- **Edge Network**: Global CDN for fast content delivery
- **Zero-Configuration**: No server management required

### Performance Optimization

- **Image Optimization**: Automatic image processing
- **Code Splitting**: Automatic bundle optimization
- **Caching**: Built-in edge caching
- **Compression**: Automatic gzip/brotli compression

---

## 🎉 Ready to Deploy!

Your Second Brain application is now ready for Vercel deployment. Follow the steps above, and you'll have your application live in minutes!

**Next Steps:**
1. Choose your preferred deployment method
2. Set up environment variables
3. Deploy and test
4. Configure monitoring and analytics

Good luck with your deployment! 🚀