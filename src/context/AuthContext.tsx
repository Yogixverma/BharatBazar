import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile } from '../types/ecommerce';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  demoAdminOverride: boolean;
  toggleDemoAdmin: () => void;
  loading: boolean;
  authModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot';
  openAuthModal: (mode?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin email configured for the application
const PRIMARY_ADMIN_EMAIL = 'yogeshverma232003@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoAdminOverride, setDemoAdminOverride] = useState<boolean>(() => {
    return localStorage.getItem('bb_demo_admin') === 'true';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');

  const openAuthModal = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const toggleDemoAdmin = () => {
    setDemoAdminOverride((prev) => {
      const next = !prev;
      localStorage.setItem('bb_demo_admin', String(next));
      return next;
    });
  };

  // Sync user profile in Firestore
  const syncUserProfile = async (firebaseUser: User, customName?: string) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userRef);

      const isDevAdmin = firebaseUser.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();

      if (!snap.exists()) {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: customName || firebaseUser.displayName || 'Customer',
          photoURL: firebaseUser.photoURL || '',
          role: isDevAdmin ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, {
          ...newProfile,
          createdAtServer: serverTimestamp(),
        });
        setProfile(newProfile);
      } else {
        const data = snap.data() as UserProfile;
        if (isDevAdmin && data.role !== 'admin') {
          await setDoc(userRef, { role: 'admin' }, { merge: true });
          data.role = 'admin';
        }
        setProfile(data);
      }
    } catch (err) {
      console.error('Error syncing user profile:', err);
      // Fallback local profile if offline or restricted
      setProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: customName || firebaseUser.displayName || 'Customer',
        photoURL: firebaseUser.photoURL || '',
        role: firebaseUser.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer',
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    await syncUserProfile(cred.user);
    closeAuthModal();
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
    await syncUserProfile(cred.user, name);
    closeAuthModal();
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    await syncUserProfile(cred.user);
    closeAuthModal();
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  const isAdmin = Boolean(
    demoAdminOverride ||
    user?.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase() ||
    profile?.role === 'admin'
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        demoAdminOverride,
        toggleDemoAdmin,
        loading,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
