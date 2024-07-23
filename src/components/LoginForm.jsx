import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import UserTypeSelector from "./UserTypeSelector";

const LoginForm = () => {
  const [userType, setUserType] = useState("teacher"); // 초기값을 "teacher"로 설정
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [pwErrorMessage, setPwErrorMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserType: setAuthUserType, setAuthToken } = useAuth();

  useEffect(() => {
    const rememberedUserType = localStorage.getItem("rememberedUserType");
    if (rememberedUserType) {
      setUserType(rememberedUserType);
    } else {
      setUserType("teacher");
    }
  }, [location.pathname]);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedUserType = localStorage.getItem("rememberedUserType");
    if (rememberedEmail && rememberedUserType === userType) {
      setEmail(rememberedEmail);
    } else {
      setEmailErrorMessage("");
      setPwErrorMessage("");
      setEmail("");
    }
    const rememberedRememberMe = localStorage.getItem("rememberMe") === "true";
    setRememberMe(rememberedRememberMe);
  }, [userType]);

  const handleUserTypeChange = useCallback((e) => {
    setUserType(e.target.value);
    setEmail(""); // 사용자 유형 변경 시 이메일 초기화
    setErrorMessage("");
  }, []);

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    setEmailErrorMessage("");
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    setPwErrorMessage("");
  }, []);

  const handleRememberMeChange = useCallback((e) => {
    setRememberMe(e.target.checked);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailErrorMessage("");
    setPwErrorMessage("");
    setErrorMessage("");

    let hasError = false;

    if (!email) {
      setEmailErrorMessage("이메일을 입력해주세요.");
      hasError = true;
    }

    if (!password) {
      setPwErrorMessage("비밀번호를 입력해주세요.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        new URLSearchParams({
          email: email,
          password: password,
          user_type: userType
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedUserType", userType);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedUserType");
          localStorage.removeItem("rememberMe");
        }

        setAuthUserType(userType);
        setAuthToken({ access_token, refresh_token });

        if (userType === "teacher") {
          navigate("/dashboardfaculty");
        } else if (userType === "student") {
          navigate("/dashboardstudent");
        }
      }
    } catch (error) {
      setPassword("");
      setErrorMessage("이메일과 비밀번호를 확인해주세요!");
      console.error("Login failed", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <UserTypeSelector userType={userType} onChange={handleUserTypeChange} />
      <div className="lg-form-group">
        <label htmlFor="email">이메일</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="user@example.com"
          value={email}
          onChange={handleEmailChange}
        />
        {emailErrorMessage && (
          <p className="error-message">{emailErrorMessage}</p>
        )}
      </div>
      <div className="lg-form-group">
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
        />
        {pwErrorMessage && <p className="error-message">{pwErrorMessage}</p>}
      </div>
      <div className="user-type-group">
        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={handleRememberMeChange}
          />
          이메일 기억하기
        </label>
      </div>
      <button type="submit" className="login-button">
        Login
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="signup-link">
        처음이신가요? <a href="/signup">회원가입</a>
      </div>
    </form>
  );
};

export default LoginForm;
