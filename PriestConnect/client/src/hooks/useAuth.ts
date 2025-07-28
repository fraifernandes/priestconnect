import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth, onAuthStateChanged, loginWithEmail, registerWithEmail, logout, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User, InsertUser } from '@shared/schema';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        // Get user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await loginWithEmail(email, password);
    return result;
  };

  const register = async (email: string, password: string, userData: InsertUser) => {
    const result = await registerWithEmail(email, password);
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      ...userData,
      email,
      createdAt: new Date(),
    });

    return result;
  };

  const signOut = async () => {
    await logout();
    setUser(null);
    setFirebaseUser(null);
  };

  return {
    user,
    firebaseUser,
    loading,
    login,
    register,
    signOut,
  };
}
