# Rocket Academy Coding Bootcamp: Instagram Bootcamp

## Setup

In the project directory, run:

- `npm install`
- `npm run dev`

Then open:

- `http://localhost:5173`

## Routing and Features Added

- `react-router-dom` is used for routing.
- Added routes:
  - `/` for the news feed
  - `/authform` for authentication form
  - `/post/:postId` for post detail pages
  - `/chat` for chat page

## Firebase

Create a `.env` file with your Firebase environment values (not committed):

- `VITE_SOME_API_KEY`
- `VITE_SOME_AUTH_DOMAIN`
- `VITE_SOME_DATABASE_URL`
- `VITE_SOME_PROJECT_ID`
- `VITE_SOME_STORAGE_BUCKET`
- `VITE_SOME_MESSAGE_SENDER_ID`
- `VITE_SOME_APP_ID`

## Firebase Hosting deploy (optional)

1. Install Firebase CLI: `npm install -g firebase-tools`
2. `firebase login`
3. `firebase use YOUR_FIREBASE_PROJECT_ID`
4. `npm run build`
5. `firebase deploy`

If your app is hosted on Firebase, keep browser routes working by serving `index.html` for all non-asset paths.
