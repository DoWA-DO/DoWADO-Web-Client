import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // 'faculty' 또는 'student'
  const [authToken, setAuthToken] = useState("");
  const [userEmail, setUserEmail] = useState(""); 

  // 로컬 스토리지에서 토큰을 가져와서 설정하는 useEffect
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail"); 
    if (token) {
      setAuthToken(token);
    }
    if (email) {
      setUserEmail(email);
    }
  }, []);

  // 토큰이 변경될 때마다 로컬 스토리지에 저장하는 useEffect
  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [authToken]);

  // 이메일이 변경될 때마다 로컬 스토리지에 저장하는 useEffect
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem("userEmail", userEmail);
    } else {
      localStorage.removeItem("userEmail");
    }
  }, [userEmail]);

  return (
    <AuthContext.Provider
      value={{
        userType,
        setUserType,
        authToken,
        setAuthToken,
        userEmail,
        setUserEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
