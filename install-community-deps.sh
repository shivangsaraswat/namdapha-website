#!/bin/bash

echo "Installing Community Feature Dependencies..."

# Frontend dependencies
cd frontend
npm install date-fns sonner
echo "✅ Frontend dependencies installed"

# Backend admin dashboard dependencies  
cd ../backend/admin-dashboard
npm install date-fns
echo "✅ Backend dependencies installed"

echo ""
echo "🎉 All dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Configure Google OAuth credentials in .env.local"
echo "2. Update authorized domains in frontend/lib/googleSheetAuth.ts"
echo "3. Run 'npm run dev' in frontend directory"
echo "4. Visit http://localhost:3001/community"
