@echo off
echo ========================================
echo GitHub Pages Deployment Script
echo ========================================
echo.

echo Step 1: Building the project...
npm run build
if %errorlevel% neq 0 (
    echo Build failed! Exiting...
    pause
    exit /b 1
)
echo Build completed successfully!
echo.

echo Step 2: Creating gh-pages branch...
git checkout --orphan gh-pages
if %errorlevel% neq 0 (
    echo Failed to create gh-pages branch! Exiting...
    pause
    exit /b 1
)
echo.

echo Step 3: Removing all files except build...
git rm -rf .
echo.

echo Step 4: Copying build files to root...
xcopy /E /I /Y build\* .
echo.

echo Step 5: Adding files to git...
git add .
echo.

echo Step 6: Committing changes...
git commit -m "Deploy to GitHub Pages"
echo.

echo Step 7: Pushing to GitHub...
git push origin gh-pages --force
echo.

echo Step 8: Switching back to main branch...
git checkout main
echo.

echo ========================================
echo Deployment completed!
echo ========================================
echo.
echo Your site should be available at:
echo https://vishwapratap777.github.io/AlgoVisual
echo.
echo Note: It may take a few minutes for the changes to appear.
echo.
pause 