import React, { createContext, useContext, useState } from 'react';

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <PreferencesContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </PreferencesContext.Provider>
  );
};