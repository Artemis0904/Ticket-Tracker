# 🚀 Vercel Deployment Guide

## Prerequisites
- [Vercel Account](https://vercel.com/signup)
- [GitHub/GitLab Account](https://github.com)
- Node.js 18+ installed locally

## 🎯 Quick Deployment Steps

### 1. **Push to GitHub/GitLab**

```bash
# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Ticket Tide Track application"

# Add your remote repository (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to main branch
git push -u origin main
```

### 2. **Deploy on Vercel**

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your Git repository**
4. **Configure project settings:**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. **Set Environment Variables**

In your Vercel project dashboard, go to **Settings > Environment Variables** and add:

```
VITE_SUPABASE_URL=https://rutokqmmosbthbnhiwam.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1dG9rcW1tb3NidGhibmhpd2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5OTg2OTQsImV4cCI6MjA3MDU3NDY5NH0.hVyLYIjI0s2IZ_mRCDLCmNVzf1OntiFF_qW5nsRTO3M
```

### 4. **Deploy!**

Click **Deploy** and wait for the build to complete.

## 🔧 **Manual Deployment (Alternative)**

If you prefer to deploy manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts to configure your project
```

## 📱 **Features Ready for Production**

✅ **Real-time Status Synchronization** across all dashboards  
✅ **Email Notifications** for status changes  
✅ **Responsive Design** for mobile and desktop  
✅ **Role-based Access Control** (Engineer, Regional Manager, Store Manager)  
✅ **Material Request Workflow** with approval system  
✅ **Shipment Tracking** with real-time updates  

## 🌐 **Post-Deployment**

1. **Test all user roles** and workflows
2. **Verify email notifications** are working
3. **Check mobile responsiveness**
4. **Monitor performance** in Vercel Analytics

## 🆘 **Troubleshooting**

### Build Errors
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility
- Verify environment variables are set correctly

### Runtime Errors
- Check browser console for JavaScript errors
- Verify Supabase connection
- Ensure all API endpoints are accessible

### Performance Issues
- Enable Vercel Analytics
- Check bundle size with `npm run build`
- Optimize images and assets

## 📞 **Support**

For deployment issues:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Supabase Documentation](https://supabase.com/docs)

---

**🎉 Your Ticket Tide Track application will be live at: `https://your-project.vercel.app`**
