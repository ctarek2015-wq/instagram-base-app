// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const envOptions = [
  ["VITE_SOME_API_KEY", "VITE_FIREBASE_API_KEY"],
  ["VITE_SOME_AUTH_DOMAIN", "VITE_FIREBASE_AUTH_DOMAIN"],
  ["VITE_SOME_DATABASE_URL", "VITE_FIREBASE_DATABASE_URL"],
  ["VITE_SOME_PROJECT_ID", "VITE_FIREBASE_PROJECT_ID"],
  ["VITE_SOME_STORAGE_BUCKET", "VITE_FIREBASE_STORAGE_BUCKET"],
  ["VITE_SOME_MESSAGE_SENDER_ID", "VITE_FIREBASE_MESSAGING_SENDER_ID"],
  ["VITE_SOME_APP_ID", "VITE_FIREBASE_APP_ID"],
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

const envFromAliases = (keys) => {
  const found = keys.find((key) => {
    const value = import.meta.env[key];
    return !isTemplateValue(value);
  });

  return found ? import.meta.env[found] : undefined;
};

const firebaseConfig = {
  apiKey: envFromAliases(["VITE_SOME_API_KEY", "VITE_FIREBASE_API_KEY"]),
  authDomain: envFromAliases([
    "VITE_SOME_AUTH_DOMAIN",
    "VITE_FIREBASE_AUTH_DOMAIN",
  ]),
  databaseURL: envFromAliases([
    "VITE_SOME_DATABASE_URL",
    "VITE_FIREBASE_DATABASE_URL",
  ]),
  projectId: envFromAliases(["VITE_SOME_PROJECT_ID", "VITE_FIREBASE_PROJECT_ID"]),
  storageBucket: envFromAliases([
    "VITE_SOME_STORAGE_BUCKET",
    "VITE_FIREBASE_STORAGE_BUCKET",
  ]),
  messagingSenderId: envFromAliases([
    "VITE_SOME_MESSAGE_SENDER_ID",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
  ]),
  appId: envFromAliases(["VITE_SOME_APP_ID", "VITE_FIREBASE_APP_ID"]),
};

const missingEnvVars = envOptions
  .map(([primary, fallback]) => {
    if (envFromAliases([primary, fallback])) {
      return null;
    }

    return primary;
  })
  .filter(Boolean);

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
export const getFirebaseConfigDebug = () => ({
  missingEnvVars,
  firebaseConfig,
});
export { database, storage, auth, firebaseConfigError, firebaseApp };
