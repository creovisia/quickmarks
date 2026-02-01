// Firebase Configuration
// Replace with your Firebase project configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOhi3PBZug4GiwHgac4R-A2qJPD2-BHi8",
  authDomain: "quick-marks.firebaseapp.com",
  projectId: "quick-marks",
  storageBucket: "quick-marks.firebasestorage.app",
  messagingSenderId: "261680755049",
  appId: "1:261680755049:web:56b8ac250cbe87a7d7cdf8",
  measurementId: "G-5T08F74VW1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Initialize Firebase Admin (for Cloud Functions)
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "YOUR_PROJECT_ID",
    "private_key_id": "YOUR_PRIVATE_KEY_ID",
    "private_key": "YOUR_PRIVATE_KEY",
    "client_email": "YOUR_CLIENT_EMAIL",
    "client_id": "YOUR_CLIENT_ID",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "YOUR_CLIENT_X509_CERT_URL"
  })
});