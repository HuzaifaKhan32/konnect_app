"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  hasUsername: boolean;
  checkingUsername: boolean;
  emailVerified: boolean;
  setHasUsername: (has: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  hasUsername: false,
  checkingUsername: true,
  emailVerified: false,
  setHasUsername: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasUsername, setHasUsername] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setCheckingUsername(true);
      setUser(user);
      setEmailVerified(user?.emailVerified || false);

      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUserProfile({ id: userDoc.id, ...userData });
            if (userData.username) {
              setHasUsername(true);
            } else {
              setHasUsername(false);
            }
          } else {
            setHasUsername(false);
            setUserProfile(null);
          }
        } catch (error) {
          console.error("Error checking for username:", error);
          setHasUsername(false);
          setUserProfile(null);
        }
      } else {
        setHasUsername(false);
        setUserProfile(null);
      }
      
      setLoading(false);
      setCheckingUsername(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, hasUsername, checkingUsername, emailVerified, setHasUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
