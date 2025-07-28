import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth helpers
export const loginWithEmail = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);

export const registerWithEmail = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

// Firestore helpers
export const createDocument = (collectionName: string, data: any) => 
  addDoc(collection(db, collectionName), data);

export const getDocument = (collectionName: string, docId: string) => 
  getDoc(doc(db, collectionName, docId));

export const updateDocument = (collectionName: string, docId: string, data: any) => 
  updateDoc(doc(db, collectionName, docId), data);

export const deleteDocument = (collectionName: string, docId: string) => 
  deleteDoc(doc(db, collectionName, docId));

export const queryDocuments = (collectionName: string, field: string, value: any) => 
  getDocs(query(collection(db, collectionName), where(field, "==", value)));

export const subscribeToCollection = (collectionName: string, callback: (data: any[]) => void) => 
  onSnapshot(collection(db, collectionName), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });

export const subscribeToDocument = (collectionName: string, docId: string, callback: (data: any) => void) => 
  onSnapshot(doc(db, collectionName, docId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });

export { onAuthStateChanged };
