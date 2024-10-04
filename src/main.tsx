import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Import Firebase dependencies
import { initializeApp } from "firebase/app";
import {
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const container = document.getElementById("root");
const root = createRoot(container!);

// Your web app's Firebase configuration (replace with your config values)
const firebaseConfig = {
  apiKey: "AIzaSyATUNUeljQKBiDCAhzsliPjbvA9gLMROr0",
  authDomain: "huckleberry-sean.firebaseapp.com",
  databaseURL: "https://huckleberry-sean-default-rtdb.firebaseio.com",
  projectId: "huckleberry-sean",
  storageBucket: "huckleberry-sean.appspot.com",
  messagingSenderId: "423521545285",
  appId: "1:423521545285:web:6d5b3c886c3869c80c472c",
  measurementId: "G-DNBL8P0XQT",
};

let db: Firestore;

try {
  const app = initializeApp(firebaseConfig);
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Handle initialization errors appropriately
}

export { db };

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
