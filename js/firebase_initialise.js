const Firebase = new Object();

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js";
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject, updateMetadata, getMetadata, list, listAll } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
Firebase.config = {
  apiKey: "[SECRET]",
  authDomain: "[SECRET]",
  databaseURL: "https://mjnotes-b35a6-default-rtdb.firebaseio.com",
  projectId: "mjnotes-b35a6",
  storageBucket: "mjnotes-b35a6.appspot.com",
  messagingSenderId: "546481387789",
  appId: "1:546481387789:web:906dc84c228f92f768d844"
};

// Initialize Firebase
Firebase.app = initializeApp(Firebase.config);
Firebase.analytics = getAnalytics(Firebase.app);
Firebase.storage = getStorage(Firebase.app);
Firebase.auth = getAuth(Firebase.app);
Firebase.database = getDatabase(Firebase.app);

// Firebase storage primitives
Firebase.storage.primitives = new Object();
Firebase.storage.primitives.ref = ref;
Firebase.storage.primitives.uploadBytes = uploadBytes;
Firebase.storage.primitives.uploadBytesResumable = uploadBytesResumable;
Firebase.storage.primitives.getDownloadURL = getDownloadURL;
Firebase.storage.primitives.deleteObject = deleteObject;
Firebase.storage.primitives.updateMetadata = updateMetadata;
Firebase.storage.primitives.getMetadata = getMetadata;
Firebase.storage.primitives.list = list;
Firebase.storage.primitives.listAll = listAll;

// Firebase RTDB primitives


// Firebase auth primitives
Firebase.auth.primitives = new Object();
Firebase.auth.primitives.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
Firebase.auth.primitives.signInWithEmailAndPassword = signInWithEmailAndPassword;
Firebase.auth.primitives.GoogleAuthProvider = GoogleAuthProvider;
Firebase.auth.provider = new GoogleAuthProvider();
Firebase.auth.primitives.signInWithRedirect = signInWithRedirect;
Firebase.auth.primitives.signInWithPopup = signInWithPopup;
Firebase.auth.primitives.getRedirectResult = getRedirectResult;
Firebase.auth.primitives.onAuthStateChanged = onAuthStateChanged;

window.Firebase = Firebase;
