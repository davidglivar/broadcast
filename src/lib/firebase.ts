import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  PUBLIC_FB_API_KEY,
  PUBLIC_FB_APP_ID,
  PUBLIC_FB_AUTH_DOMAIN,
  PUBLIC_FB_MESSAGING_SENDER_ID,
  PUBLIC_FB_PROJECT_ID,
  PUBLIC_FB_STORAGE_BUCKET
} from '$env/static/public';

const firebaseConfig = {
  apiKey: PUBLIC_FB_API_KEY,
  authDomain: PUBLIC_FB_AUTH_DOMAIN,
  projectId: PUBLIC_FB_PROJECT_ID,
  storageBucket: PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_FB_MESSAGING_SENDER_ID,
  appId: PUBLIC_FB_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
