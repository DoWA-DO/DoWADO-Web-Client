import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // 'faculty' 또는 'student'
  const [authToken, setAuthToken] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 로컬 스토리지에서 토큰을 가져와서 설정하는 useEffect
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail");
    const type = localStorage.getItem("userType"); // userType 가져오기
    if (token) {
      setAuthToken(token);
    }
    if (email) {
      setUserEmail(email);
    }
    if (type) {
      setUserType(type); // userType 설정
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

  // userType이 변경될 때마다 로컬 스토리지에 저장하는 useEffect
  useEffect(() => {
    if (userType) {
      localStorage.setItem("userType", userType);
    } else {
      localStorage.removeItem("userType");
    }
  }, [userType]);

  // 로그아웃 함수 정의
  const logout = () => {
    setAuthToken("");
    setUserEmail("");
    setUserType(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userType");
    navigate("/"); // 로그아웃 후 로그인 페이지로 이동
  };

  return (
    <AuthContext.Provider
      value={{
        userType,
        setUserType,
        authToken,
        setAuthToken,
        userEmail,
        setUserEmail,
        logout, // 로그아웃 함수 제공
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
