@echo off
echo Building the project...
npm run build
echo.
echo Build completed! 
echo.
echo To deploy your project:
echo 1. Go to https://app.netlify.com/drop
echo 2. Drag and drop the 'build' folder from this directory
echo 3. Your site will be live in seconds!
echo.
echo Opening build folder...
start build
pause 