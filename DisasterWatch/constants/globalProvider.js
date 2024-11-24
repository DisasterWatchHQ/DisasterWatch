import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../firebaseConfig'; // Make sure the path to your Firebase config is correct

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle loading state

  // Function to load user from secure storage
  const loadUser = async () => {
    const session = await SecureStore.getItemAsync('userSession');
    if (session) {
      const parsedUser = JSON.parse(session);
      signIn(parsedUser.email, parsedUser.password); // Auto sign in the user if session exists
    } else {
      setLoading(false); // If no session, stop loading
    }
  };

  // Function to sign in the user using Firebase credentials
  const signIn = async (email, password) => {
    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); // Set the user in the context
    } catch (error) {
      console.log('Error signing in:', error.message);
      setUser(null); // If sign-in fails, reset user
    } finally {
      setLoading(false); // Stop loading once sign-in is complete
    }
  };

  // Function to log out
  const logout = async () => {
    const auth = getAuth(app);
    await auth.signOut();
    await SecureStore.deleteItemAsync('userSession');
    setUser(null);
  };

  // Load the user when the component mounts
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
