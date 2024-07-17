import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // 'faculty' 또는 'student'
  const [authToken, setAuthToken] = useState("");

  return (
    <AuthContext.Provider value={{ userType, setUserType, authToken, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
