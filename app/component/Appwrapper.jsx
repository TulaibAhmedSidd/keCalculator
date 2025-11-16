'use client';
'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import BothViewFB from './BothViewFB';
// import BothView from './BothView';

// Your Firebase config
const USER_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDm50HWS-3YX54bbkmkFVFYtY5SPInMnew",
  authDomain: "kecalculator.firebaseapp.com",
  projectId: "kecalculator",
  storageBucket: "kecalculator.firebasestorage.app",
  messagingSenderId: "711512678802",
  appId: "1:711512678802:web:abe5de59da89f65db0614b",
  measurementId: "G-EV7SLDZS1J"
};

// Initialize Firebase
const app = initializeApp(USER_FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Login/Register Component ---
const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-center">Login / Register</h2>
      <form onSubmit={handleEmailLogin} className="space-y-2">
        <input type="email" placeholder="Email" className="w-full p-3 border rounded" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <input type="password" placeholder="Password" className="w-full p-3 border rounded" value={password} onChange={e=>setPassword(e.target.value)} required/>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" className="flex-1 p-3 bg-indigo-600 text-white rounded">Login</button>
          <button type="button" onClick={handleEmailRegister} className="flex-1 p-3 bg-green-600 text-white rounded">Register</button>
        </div>
      </form>
      <button onClick={handleGoogleLogin} className="w-full p-3 bg-red-500 text-white rounded">Login with Google</button>
    </div>
  )
};

// --- Firebase KE Data functions ---
const saveUserDataToFirestore = async (user, data) => {
  if (!user) return;
  const docRef = doc(db, "users", user.uid);
  await setDoc(docRef, data, { merge: true }); // merge:true keeps previous data
};

const loadUserDataFromFirestore = async (user) => {
  if (!user) return null;
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// --- Main App with BothView + Firebase ---
const FirebaseKECalculatorApp = () => {
  const [user, setUser] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Track auth state
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        setLoadingUserData(true);
        const data = await loadUserDataFromFirestore(u);
        setUserData(data);
        setLoadingUserData(false);
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

//   if (!user) return <LoginForm onLogin={setUser} />;

//   if (loadingUserData) return <p>Loading user data...</p>;

  return (
    <div>
      {/* <button
        className="absolute top-4 right-4 bg-gray-200 p-2 rounded"
        onClick={() => signOut(auth)}
      >
        Logout
      </button> */}

      <BothViewFB
        user={user}
        initialData={userData} // pass firestore-loaded data
        onDataChange={(data) => saveUserDataToFirestore(user, data)}
      />
    </div>
  )
};

export default FirebaseKECalculatorApp;
