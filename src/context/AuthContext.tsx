import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  AuthError,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface ExtendedUser extends User {
  role: "Maitre" | "Etudiant";
  anime?: string;
  classe?: string;
  xpTotal: number;
  level: number;
  createdAt: number;
}

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  error: string | null;
  signUp: (
    email: string,
    password: string,
    displayName: string,
    role: "Maitre" | "Etudiant",
    anime?: string,
    classe?: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const firestoreData = userSnap.data();

            const extendedUser = {
              ...firebaseUser,
              ...firestoreData,
            } as ExtendedUser;

            setUser(extendedUser);
          } else {
            setUser(firebaseUser as ExtendedUser);
          }
        } catch (err) {
          console.error("Erreur lors du chargement Firestore :", err);
          setUser(firebaseUser as ExtendedUser);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    role: "Maitre" | "Etudiant",
    anime?: string,
    classe?: string
  ) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;

      await updateProfile(newUser, { displayName });

      await setDoc(doc(db, "users", newUser.uid), {
        uid: newUser.uid,
        displayName,
        role,
        anime: role === "Etudiant" ? anime : null,
        classe: role === "Etudiant" ? classe : null,
        xpTotal: 0,
        level: 1,
        createdAt: Date.now(),
      });

      // Pas besoin de setUser ici, onAuthStateChanged se déclenche
    } catch (err) {
      const authErr = err as AuthError;
      setError(authErr.message);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const authErr = err as AuthError;
      setError(authErr.message);
      throw err;
    }
  };

  const logOut = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      const authErr = err as AuthError;
      setError(authErr.message);
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, signUp, signIn, logOut, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
