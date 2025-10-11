# Heroku Deployment Guide for Proty Real Estate App

## Prerequisites
1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Create a Heroku account: https://heroku.com
3. Login to Heroku: `heroku login`

## Deployment Options

### Option 1: Deploy Backend API Only
This is recommended if you want to deploy your API to Heroku and keep your frontend on a different service.

```bash
# Navigate to the API directory
cd api

# Initialize git repository (if not already done)
git init

# Add Heroku remote
heroku create your-api-app-name

# Add environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloudinary_name
heroku config:set CLOUDINARY_API_KEY=your_cloudinary_key
heroku config:set CLOUDINARY_API_SECRET=your_cloudinary_secret

# Deploy
git add .
git commit -m "Initial deployment"
git push heroku main
```

### Option 2: Deploy Frontend Only
Deploy your Next.js frontend to Heroku.

```bash
# Navigate to the frontend directory
cd proty-nextjs

# Initialize git repository (if not already done)
git init

# Add Heroku remote
heroku create your-frontend-app-name

# Add environment variables
heroku config:set NODE_ENV=production
heroku config:set NEXT_PUBLIC_API_URL=https://your-api-app-name.herokuapp.com

# Deploy
git add .
git commit -m "Initial deployment"
git push heroku main
```

### Option 3: Deploy Both (Recommended)
Deploy both backend and frontend as separate Heroku apps.

```bash
# Deploy Backend
cd api
git init
heroku create proty-api-production
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloudinary_name
heroku config:set CLOUDINARY_API_KEY=your_cloudinary_key
heroku config:set CLOUDINARY_API_SECRET=your_cloudinary_secret
git add .
git commit -m "Backend deployment"
git push heroku main

# Deploy Frontend
cd ../proty-nextjs
git init
heroku create proty-frontend-production
heroku config:set NODE_ENV=production
heroku config:set NEXT_PUBLIC_API_URL=https://proty-api-production.herokuapp.com
git add .
git commit -m "Frontend deployment"
git push heroku main
```

## Environment Variables Setup

### Backend Environment Variables:
- `NODE_ENV=production`
- `MONGODB_URI` - Your MongoDB connection string (use MongoDB Atlas for production)
- `JWT_SECRET` - Your JWT secret key
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

### Frontend Environment Variables:
- `NODE_ENV=production`
- `NEXT_PUBLIC_API_URL` - Your backend API URL (e.g., https://your-api.herokuapp.com)

## Database Setup

1. **MongoDB Atlas** (Recommended for production):
   - Create a MongoDB Atlas account
   - Create a cluster
   - Get your connection string
   - Add it to Heroku config variables

2. **Heroku Postgres** (Alternative):
   - Add Heroku Postgres addon: `heroku addons:create heroku-postgresql:hobby-dev`
   - This will automatically set `DATABASE_URL` environment variable

## Post-Deployment Steps

1. **Check logs**: `heroku logs --tail`
2. **Open app**: `heroku open`
3. **Run database seeds** (if needed): `heroku run npm run seed`

## Useful Heroku Commands

```bash
# View logs
heroku logs --tail

# Open app in browser
heroku open

# Run commands on Heroku
heroku run npm run seed

# Scale dynos
heroku ps:scale web=1

# Check app status
heroku ps

# View config variables
heroku config

# Restart app
heroku restart
```

## Troubleshooting

1. **Build fails**: Check that all dependencies are in `package.json`
2. **App crashes**: Check logs with `heroku logs --tail`
3. **Database connection issues**: Verify `MONGODB_URI` is correct
4. **Environment variables**: Ensure all required variables are set

## Cost Considerations

- Heroku Free Tier is no longer available
- Basic dyno: $7/month per dyno
- Consider using other platforms like Vercel (for frontend) + Railway/Render (for backend) for free alternatives
