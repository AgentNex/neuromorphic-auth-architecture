#!/bin/bash
set -e

echo "Starting build process..."
npm run build
echo "Build successful!"

echo "Deploying application..."
# By default we use Vercel CLI for deployment. 
# If you are deploying to InsForge hosting, you can replace this with:
# npx @insforge/cli deploy
vercel --prod

echo "Deployment complete!"
