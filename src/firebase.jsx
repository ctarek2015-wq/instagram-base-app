// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_SOME_API_KEY,
  authDomain: import.meta.env.VITE_SOME_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_SOME_DATABASE_URL,
  projectId: import.meta.env.VITE_SOME_PROJECT_ID,
  storageBucket: import.meta.env.VITE_SOME_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_SOME_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_SOME_APP_ID,
};

const requiredEnvVars = [
  "VITE_SOME_API_KEY",
  "VITE_SOME_AUTH_DOMAIN",
  "VITE_SOME_DATABASE_URL",
  "VITE_SOME_PROJECT_ID",
  "VITE_SOME_STORAGE_BUCKET",
  "VITE_SOME_MESSAGE_SENDER_ID",
  "VITE_SOME_APP_ID",
];

const isTemplateValue = (value) => {
  return (
    typeof value !== "string" ||
    !value.trim() ||
    value.includes("YOUR_") ||
    value.toLowerCase().includes("placeholder") ||
    value === "undefined" ||
    value === "null"
  );
};

const missingEnvVars = requiredEnvVars.filter((varName) =>
  isTemplateValue(import.meta.env[varName])
);

let firebaseApp = null;
let database = null;
let storage = null;
let auth = null;
let firebaseConfigError = "";

if (missingEnvVars.length === 0) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    database = getDatabase(firebaseApp);
    storage = getStorage(firebaseApp);
    auth = getAuth(firebaseApp);
  } catch (error) {
    firebaseConfigError = error.message || "Firebase failed to initialize.";
    console.error("Firebase initialization error:", error);
  }
} else {
  firebaseConfigError = `Missing Firebase env values: ${missingEnvVars.join(", ")}`;
  console.warn("Firebase not initialized:", firebaseConfigError);
}

export const isFirebaseConfigured =
  missingEnvVars.length === 0 && firebaseApp !== null && !firebaseConfigError;
export { database, storage, auth, firebaseConfigError, firebaseApp };
