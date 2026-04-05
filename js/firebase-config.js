/**
 * Firebase Configuration for TradeOS
 * Scoped and initialized with user credentials.
 * Enhanced with Offline Persistence and Real-time Capabilities.
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, query, where, deleteDoc, onSnapshot, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB83DrMKd64wxHkR9Qh5ZL2LGBfh5BU-GE",
  authDomain: "tradeos-43117.firebaseapp.com",
  projectId: "tradeos-43117",
  storageBucket: "tradeos-43117.firebasestorage.app",
  messagingSenderId: "692653878118",
  appId: "1:692653878118:web:eaba1a37fbdb930dd736a7",
  measurementId: "G-J9C3HZF5DQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable Offline Persistence
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        console.warn("Firestore Persistence: Failed (Multiple Tabs)");
    } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        console.warn("Firestore Persistence: Unimplemented");
    }
});

export { auth, db, onAuthStateChanged, signOut, doc, setDoc, getDoc, getDocs, collection, query, where, deleteDoc, onSnapshot };
