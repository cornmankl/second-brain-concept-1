#!/bin/bash

# Script untuk deploy ke Vercel menggunakan token
# Token Vercel: ih7YymDO5tJEZBPr0D3hqGkT

echo "🚀 Memulai proses deployment ke Vercel..."
echo "====================================="

# Set token Vercel
export VERCEL_TOKEN="ih7YymDO5tJEZBPr0D3hqGkT"

# Cek apakah repository sudah siap
echo "📋 Memeriksa status repository..."
git status

# Pastikan kita di branch main
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "🔄 Beralih ke branch main..."
    git checkout main
fi

# Pull latest changes
echo "📥 Mengambil perubahan terbaru..."
git pull origin main

# Test build lokal
echo "🏗️  Menguji build lokal..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build lokal berhasil!"
else
    echo "❌ Build lokal gagal. Silakan perbaiki error terlebih dahulu."
    exit 1
fi

echo ""
echo "🎯 Metode Deployment yang Tersedia:"
echo "==================================="
echo "1. Vercel Dashboard (via browser) - RECOMMENDED"
echo "2. Vercel CLI (command line)"
echo "3. GitHub Integration (auto-deploy)"
echo ""

read -p "Pilih metode deployment (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "📋 Instruksi Deployment via Vercel Dashboard:"
        echo "==========================================="
        echo "1. Buka https://vercel.com di browser"
        echo "2. Login atau buat akun Vercel"
        echo "3. Klik 'New Project'"
        echo "4. Pilih repository 'second-brain-concept-1' dari GitHub"
        echo "5. Klik 'Import'"
        echo "6. Konfigurasi environment variables:"
        echo "   - NODE_ENV=production"
        echo "   - DATABASE_URL=your_database_url"
        echo "   - NEXTAUTH_URL=https://your-app.vercel.app"
        echo "   - NEXTAUTH_SECRET=your_secret"
        echo "   - ZAI_API_KEY=your_zai_api_key"
        echo "7. Klik 'Deploy'"
        echo ""
        echo "⏱️  Proses deployment biasanya memakan waktu 2-5 menit"
        echo "🎉 Aplikasi Anda akan live setelah deployment selesai!"
        ;;
    2)
        echo ""
        echo "🚀 Deployment via Vercel CLI..."
        echo "=============================="
        
        # Coba install Vercel CLI di lokal user
        if ! command -v vercel &> /dev/null; then
            echo "📦 Menginstall Vercel CLI..."
            npm config set prefix ~/.npm-global
            export PATH=~/.npm-global/bin:$PATH
            npm install -g vercel --user
        fi
        
        # Login ke Vercel dengan token
        echo "🔐 Login ke Vercel..."
        echo "$VERCEL_TOKEN" | vercel login --token
        
        # Deploy ke Vercel
        echo "📤 Mendeploy ke Vercel..."
        vercel --prod --token "$VERCEL_TOKEN"
        
        if [ $? -eq 0 ]; then
            echo "✅ Deployment berhasil!"
        else
            echo "❌ Deployment gagal."
        fi
        ;;
    3)
        echo ""
        echo "🔗 Setup GitHub Auto-Deployment:"
        echo "================================"
        echo "1. Buka https://vercel.com"
        echo "2. Pergi ke account settings"
        echo "3. Klik 'GitHub' di bawah 'Integrations'"
        echo "4. Klik 'Configure' dan install Vercel untuk GitHub"
        echo "5. Pergi ke Vercel project dashboard"
        echo "6. Klik 'Settings' → 'Git'"
        echo "7. Enable 'Auto-Deploy' untuk branch main"
        echo ""
        echo "🔄 Setiap push ke main akan auto-deploy!"
        ;;
    *)
        echo "❌ Pilihan tidak valid. Silakan jalankan script lagi."
        exit 1
        ;;
esac

echo ""
echo "🎉 Proses deployment siap!"
echo "=========================="
echo "📖 Panduan lengkap tersedia di VERCEL_DEPLOYMENT_GUIDE.md"
echo "🔧 Jangan lupa setup environment variables di Vercel!"
echo "🚀 Aplikasi Second Brain Anda akan segera live!"

# Buat file konfigurasi Vercel dengan token
cat > vercel-token-config.json << EOF
{
  "token": "ih7YymDO5tJEZBPr0D3hqGkT",
  "projectId": "",
  "orgId": ""
}
EOF

echo "💾 Token Vercel disimpan di vercel-token-config.json"
echo "🔐 Jangan bagikan file ini ke public repository!"