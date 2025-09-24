#!/bin/bash

# Vercel Deployment Script for Second Brain Application
# This script helps prepare and deploy to Vercel

echo "🚀 Preparing for Vercel deployment..."
echo "====================================="

# Check if we have a clean git status
echo "📋 Checking git status..."
git status

# Check if we're on the main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "⚠️  You're on branch '$current_branch'. Switching to main..."
    git checkout main
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Check if we have all necessary files
echo "🔍 Checking deployment files..."
required_files=("package.json" "next.config.ts" "vercel.json" ".vercelignore")
missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo "❌ Missing required files:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    exit 1
fi

echo "✅ All required files are present"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project to test locally
echo "🏗️  Testing build locally..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🎯 Deployment Options:"
echo "===================="
echo "1. Deploy via Vercel Dashboard (Recommended)"
echo "2. Deploy via Vercel CLI"
echo "3. Set up GitHub auto-deployment"
echo ""

read -p "Choose your deployment method (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "📋 Vercel Dashboard Deployment Steps:"
        echo "===================================="
        echo "1. Go to https://vercel.com"
        echo "2. Click 'New Project'"
        echo "3. Select 'second-brain-concept-1' from your GitHub repositories"
        echo "4. Click 'Import'"
        echo "5. Configure environment variables:"
        echo "   - NODE_ENV=production"
        echo "   - DATABASE_URL=your_database_url"
        echo "   - NEXTAUTH_URL=https://your-app.vercel.app"
        echo "   - NEXTAUTH_SECRET=your_secret"
        echo "   - ZAI_API_KEY=your_zai_api_key"
        echo "6. Click 'Deploy'"
        echo ""
        echo "📖 Full guide available in VERCEL_DEPLOYMENT_GUIDE.md"
        ;;
    2)
        echo ""
        echo "🚀 Deploying via Vercel CLI..."
        echo "============================="
        
        # Check if logged in to Vercel
        vercel whoami > /dev/null 2>&1
        if [ $? -ne 0 ]; then
            echo "🔐 Please login to Vercel..."
            vercel login
        fi
        
        echo "📤 Deploying to Vercel..."
        vercel --prod
        
        if [ $? -eq 0 ]; then
            echo "✅ Deployment successful!"
        else
            echo "❌ Deployment failed."
        fi
        ;;
    3)
        echo ""
        echo "🔗 GitHub Auto-Deployment Setup:"
        echo "================================"
        echo "1. Go to https://vercel.com"
        echo "2. Navigate to your account settings"
        echo "3. Click 'GitHub' under 'Integrations'"
        echo "4. Click 'Configure' and install Vercel for GitHub"
        echo "5. Go to your Vercel project dashboard"
        echo "6. Click 'Settings' → 'Git'"
        echo "7. Enable 'Auto-Deploy' for the main branch"
        echo ""
        echo "🔄 Future pushes to main will auto-deploy!"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment preparation complete!"
echo "=================================="
echo "📖 Refer to VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions"
echo "🔧 Don't forget to set up environment variables in Vercel!"
echo "🚀 Your Second Brain app will be live soon!"