# MannMitra - Netlify Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prepare Your Repository

Ensure your project is in a Git repository:

```bash
git init
git add .
git commit -m "Initial commit for deployment"
```

Push to GitHub, GitLab, or Bitbucket:

```bash
git remote add origin https://github.com/yourusername/mannmitra.git
git push -u origin main
```

### 2. Deploy to Netlify

#### Option A: Netlify CLI (Recommended)

1. Install Netlify CLI:

   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:

   ```bash
   netlify login
   ```

3. Deploy your site:
   ```bash
   netlify deploy --prod
   ```

#### Option B: Netlify Dashboard

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider (GitHub/GitLab/Bitbucket)
4. Select your MannMitra repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

### 3. Configure Environment Variables

In your Netlify dashboard, go to:
**Site settings** → **Environment variables** → **Add variable**

Add these required variables:

#### 🔴 Required Variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

#### 🟡 Optional Variables:

```
VITE_ASSEMBLYAI_API_KEY=your_assemblyai_api_key
VITE_HUGGING_FACE_API_KEY=your_huggingface_api_key
```

### 4. Get Your API Keys

#### Supabase Setup:

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing
3. Go to **Settings** → **API**
4. Copy your **Project URL** and **anon public** key

#### Google Gemini API:

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create an API key
3. Copy the API key

#### AssemblyAI (Optional):

1. Go to [assemblyai.com](https://assemblyai.com)
2. Sign up and get your API key

### 5. Verify Deployment

After deployment:

1. Visit your Netlify site URL
2. Test all features:
   - ✅ Homepage loads
   - ✅ Chat functionality works
   - ✅ Authentication works
   - ✅ Routing works (refresh any page)
   - ✅ Mobile responsiveness

### 6. Custom Domain (Optional)

To use your own domain:

1. In Netlify dashboard: **Domain settings** → **Add custom domain**
2. Add your domain name
3. Update DNS records as instructed by Netlify
4. SSL certificate will be automatically provisioned

## 🔧 Troubleshooting

### Build Errors:

- Check all environment variables are set correctly
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally to test

### Runtime Errors:

- Check browser console for errors
- Verify API keys are valid and have correct permissions
- Check Netlify function logs if using serverless functions

### 404 Errors:

- The `netlify.toml` file includes SPA redirects
- If still having issues, check the redirect rules

## 📱 Features Enabled

Your deployed MannMitra app includes:

- ✅ Mental health chatbot with Google Gemini AI
- ✅ Mood tracking and analytics
- ✅ Voice analysis (if AssemblyAI key provided)
- ✅ Teletherapy booking system
- ✅ Admin dashboard
- ✅ User authentication via Supabase
- ✅ Responsive design for all devices
- ✅ PWA-ready (Progressive Web App)

## 🛡️ Security Features

- CSP headers configured
- XSS protection enabled
- Frame protection
- Secure environment variable handling
- HTTPS enforced

## 📊 Performance Optimizations

- Code splitting implemented
- Static asset caching
- Optimized bundle sizes
- CDN delivery via Netlify

---

**Need help?** Check the Netlify documentation or open an issue in the repository.
