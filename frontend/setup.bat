@echo off
echo Setting up Tabdeel Frontend...

echo.
echo Installing dependencies...
call npm install

echo.
echo Building Docker image...
docker build -t tabdeel-frontend .

echo.
echo Setup complete!
echo.
echo To run in development mode:
echo   npm run docker:dev
echo.
echo To run in production mode:
echo   npm run docker:prod
echo.
pause