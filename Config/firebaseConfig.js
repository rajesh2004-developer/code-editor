// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'code-editor-70d35.firebaseapp.com',
  projectId: 'code-editor-70d35',
  storageBucket: 'code-editor-70d35.firebasestorage.app',
  messagingSenderId: '498860292379',
  appId: '1:498860292379:web:b16b63d6764f1091633bbe',
  measurementId: 'G-YXHD9W390R',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
