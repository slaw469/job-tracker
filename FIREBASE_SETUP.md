# Firebase Setup Guide

This project has been migrated from Supabase to Firebase for authentication and database. Follow these steps to set up Firebase:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Enable the following sign-in methods:
   - **Email/Password**: Click to enable
   - **Google**: Click to enable and add your domain to authorized domains

## 3. Set up Firestore Database ⚠️ **CRITICAL**

1. Go to **Firestore Database**
2. Click "Create database"  
3. **Choose "Start in test mode"** (this is required for the app to work)
4. Select a location closest to your users
5. Click "Done"

**⚠️ IMPORTANT**: If you get `WebChannelConnection` errors, it means:
- Firestore database is not created yet, OR
- Security rules are blocking writes

## 4. Get Configuration Keys

1. Go to **Project Settings** (gear icon) > **General** tab
2. Scroll down to "Your apps" section
3. Click on the web icon (`</>`) to add a web app
4. Register your app name
5. Copy the config object values

## 5. Environment Variables

Create a `.env.local` file in your project root and add:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

# Optional: Restrict access to specific Google accounts
VITE_ALLOWED_GOOGLE_EMAILS=user1@example.com,user2@example.com
```

## 6. Configure Google OAuth (Optional)

If you want to use Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** > **Credentials**
4. Find your OAuth 2.0 client ID (created by Firebase)
5. Add your domains to authorized origins:
   - `http://localhost:5173` (for development)
   - `https://yourdomain.com` (for production)

## 7. Security Rules (Optional)

To secure your Firestore database, go to **Firestore Database** > **Rules** and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Add more rules as needed for your collections
  }
}
```

## What Changed

- **Authentication**: Replaced Supabase Auth with Firebase Authentication
- **Database**: Ready to use Firestore (previously used Supabase database)
- **OAuth**: Google OAuth now handled through Firebase Auth
- **Session Management**: All session handling moved to Firebase
- **User Profiles**: User data stored in Firestore `/users/{uid}` collection

## File Changes Made

1. **Added Firebase config**: `src/lib/firebase.ts`
2. **Updated auth service**: `src/lib/firebaseAuth.ts`
3. **Updated main app**: `src/App.tsx`
4. **Updated auth page**: `src/components/Auth/AuthPage.tsx`
5. **Updated router**: `src/routes/router.tsx`
6. **Updated onboarding**: Onboarding screens now use Firebase
7. **Removed Supabase dependencies**: Cleaned up package.json

## Benefits of Firebase

- **Free tier**: Generous limits for small to medium apps
- **Real-time database**: Firestore provides real-time updates
- **Google integration**: Better Google OAuth support
- **Scalability**: Automatically scales with your app
- **Security**: Built-in security rules
- **Analytics**: Easy integration with Google Analytics
