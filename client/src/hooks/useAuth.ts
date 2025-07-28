import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUserDocument, createUserDocument } from '../lib/firestore';
import type { User, Patient, Doctor } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      setError(null);

      if (firebaseUser) {
        try {
          // Get user document from Firestore
          const userDoc = await getUserDocument(firebaseUser.uid);
          if (userDoc) {
            setUser(userDoc);
          } else {
            // User exists in Auth but not in Firestore, this shouldn't happen in normal flow
            console.warn('User exists in Auth but not in Firestore');
            setUser(null);
          }
        } catch (error: any) {
          console.error('Error getting user document:', error);
          // If permission denied or Firestore not setup, sign out the user
          if (error.code === 'permission-denied' || error.code === 'unavailable') {
            console.warn('Firestore access denied - signing out user');
            await signOut(auth);
          }
          setError('Failed to load user data. Please check Firestore setup.');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (
    email: string,
    password: string,
    userData: (Omit<Patient, 'uid' | 'email'> | Omit<Doctor, 'uid' | 'email'>)
  ): Promise<User> => {
    setError(null);
    setLoading(true);

    try {
      console.log('Starting registration for:', email, userData);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log('Firebase user created:', firebaseUser.uid);

      // Create user document in Firestore
      const newUser = await createUserDocument({
        uid: firebaseUser.uid,
        email,
        ...userData,
      });

      console.log('User registration completed successfully');
      setUser(newUser);
      return newUser;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // If user was created but Firestore failed, clean up auth
      if (error.code === 'permission-denied' && auth.currentUser) {
        console.log('Cleaning up auth user due to Firestore permission error');
        await auth.currentUser.delete();
      }
      
      const errorMessage = error.code === 'auth/email-already-in-use' 
        ? 'Email already in use' 
        : error.code === 'auth/weak-password'
        ? 'Password should be at least 6 characters'
        : error.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : error.code === 'permission-denied'
        ? 'Database access denied. Please enable Firestore and set security rules.'
        : error.message || 'Registration failed. Please try again.';
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user document from Firestore
      const userDoc = await getUserDocument(firebaseUser.uid);
      if (!userDoc) {
        throw new Error('User data not found');
      }

      setUser(userDoc);
      return userDoc;
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'
        ? 'Invalid email or password'
        : error.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : error.code === 'auth/too-many-requests'
        ? 'Too many failed attempts. Please try again later.'
        : error.code === 'permission-denied'
        ? 'Database access denied. Please enable Firestore and set security rules.'
        : error.message || 'Login failed. Please try again.';
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
    } catch (error: any) {
      setError('Logout failed. Please try again.');
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
  };
};
