# 🚀 Deployment Guide for Cook Next Door

## Option 1: Deploy to Render (Recommended)

### Step 1: Connect to GitHub
1. Push your code to GitHub
2. Connect your GitHub repository to Render

### Step 2: Deploy Backend
1. **Create New Service** → **Web Service**
2. **Repository**: Select your GitHub repo
3. **Runtime**: `Node.js`
4. **Root Directory**: `src/src`
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. **Environment Variables**:
   - `NODE_ENV=production`
   - `MONGODB_URI` (your MongoDB connection string)
   - `JWT_SECRET` (generate a secure secret)

### Step 3: Deploy Frontend
1. **Create New Service** → **Static Site**
2. **Repository**: Select your GitHub repo
3. **Runtime**: `Node.js`
4. **Root Directory**: `frontend`
5. **Build Command**: `npm install && npm run build`
6. **Publish Directory**: `dist/frontend`
7. **Environment Variables**:
   - `API_URL=https://your-backend-service-name.onrender.com`

### Step 4: Update API Service
The frontend API service will automatically use the production URL when deployed.

## Option 2: Manual Deployment Fix

If you're still getting the "Service Root Directory missing" error:

### Check Your Current Render Configuration:
1. Go to your Render service dashboard
2. Click **Settings** → **Build & Deploy**
3. Ensure **Root Directory** is set to `src/src` for backend
4. Ensure **Build Command** is `npm install`
5. Ensure **Start Command** is `npm start`

### Alternative Single Service Approach:
If you want to deploy everything in one service:
1. **Root Directory**: `.` (empty)
2. **Build Command**: `cd src/src && npm install`
3. **Start Command**: `cd src/src && npm start`

## Environment Variables Required:

### Backend:
- `NODE_ENV=production`
- `MONGODB_URI=mongodb+srv://...` (your MongoDB Atlas connection string)
- `JWT_SECRET=your-secret-key-here`

### Frontend:
- `API_URL=https://your-backend-service.onrender.com`

## Troubleshooting:

1. **Port Issues**: Render uses port 10000, make sure your app listens on `process.env.PORT || 5000`

2. **MongoDB Connection**: Use MongoDB Atlas for production database

3. **CORS Issues**: Ensure your backend allows requests from your frontend domain

4. **Build Errors**: Make sure all dependencies are properly installed

## Quick Deploy Commands:

```bash
# Backend only
cd src/src
npm install
npm start

# Frontend only
cd frontend
npm install
npm run build
```

## Production URLs:
- **Backend**: `https://your-backend-service.onrender.com`
- **Frontend**: `https://your-frontend-service.onrender.com`

Make sure to update the API service URL in your frontend code to point to the production backend URL.
