@echo off
echo ========================================
echo Manual GitHub Pages Deployment
echo ========================================
echo.

echo Step 1: Building the project...
npm run build
echo Build completed!
echo.

echo Step 2: Creating deployment branch...
git checkout -b gh-pages-deploy
echo.

echo Step 3: Removing all files...
git rm -rf .
echo.

echo Step 4: Copying build files...
robocopy build . /E /MOVE
echo.

echo Step 5: Adding files...
git add .
echo.

echo Step 6: Committing deployment...
git commit -m "Deploy to GitHub Pages"
echo.

echo Step 7: Pushing to GitHub...
git push origin gh-pages-deploy --force
echo.

echo Step 8: Switching back to main...
git checkout main
git branch -D gh-pages-deploy
echo.

echo ========================================
echo Manual deployment completed!
echo ========================================
echo.
echo Next steps:
echo 1. Go to your GitHub repository
echo 2. Go to Settings > Pages
echo 3. Set Source to "Deploy from a branch"
echo 4. Select "gh-pages-deploy" branch
echo 5. Save
echo.
echo Your site will be available at:
echo https://vishwapratap777.github.io/AlgoVisual
echo.
pause 