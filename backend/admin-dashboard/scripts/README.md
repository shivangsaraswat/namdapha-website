# Populate Events Script

## Setup

1. Update Firebase config in `populate-events.ts` with your actual Firebase credentials
2. Install dependencies: `npm install`
3. Run: `npx tsx scripts/populate-events.ts`

This will add 3 upcoming events and 10 past events to your Firebase database.

## Alternative: Use Admin Dashboard

Instead of running the script, you can manually add events through the admin dashboard:

1. Go to `/events` in admin dashboard
2. Click "Add Upcoming Event" or "Add Past Event"
3. Fill in the form with event details
4. Upload poster image
5. Save

The events will automatically sync to the frontend!
