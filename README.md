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

## Firebase Storage CORS fix (image upload on GitHub Pages)

If image upload fails with:

`Access to XMLHttpRequest ... has been blocked by CORS policy: Response to preflight request doesn't pass access control check`

this is usually a Firebase Storage CORS rule issue for the bucket.

1. Confirm the bucket name in `.env` is correct (`VITE_SOME_STORAGE_BUCKET`).
2. Update CORS on the bucket from a machine with Google Cloud credentials:

```bash
cat > storage-cors.json <<'EOF'
[
  {
    "origin": ["https://ctarek2015-wq.github.io", "http://localhost:5173"],
    "method": ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"],
    "responseHeader": [
      "Content-Type",
      "x-goog-resumable",
      "Authorization",
      "Content-Encoding",
      "x-goog-upload-protocol",
      "x-goog-upload-command",
      "x-goog-upload-offset",
      "x-goog-upload-header-content-length",
      "x-goog-upload-header-content-type",
      "x-firebase-storage-version"
    ],
    "maxAgeSeconds": 3600
  }
]
EOF

# replace with your actual bucket if needed
gsutil cors set storage-cors.json gs://insta-227e0.appspot.com
```

3. Make sure Storage rules allow authenticated uploads:

```text
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

4. Redeploy/reload your app and retry.

## Firebase Hosting deploy (optional)

1. Install Firebase CLI: `npm install -g firebase-tools`
2. `firebase login`
3. `firebase use YOUR_FIREBASE_PROJECT_ID`
4. `npm run build`
5. `firebase deploy`

If your app is hosted on Firebase, keep browser routes working by serving `index.html` for all non-asset paths.
