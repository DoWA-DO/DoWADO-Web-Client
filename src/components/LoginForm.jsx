import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useCookies } from "react-cookie";
import UserTypeSelector from "./UserTypeSelector";

const LoginForm = () => {
  const [userType, setUserType] = useState("faculty");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [pwErrorMessage, setPwErrorMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserType: setAuthUserType } = useAuth();
  const [cookies, setCookie, removeCookie] = useCookies([
    "rememberedEmail",
    "rememberedUserType",
    "rememberMe",
  ]);

  useEffect(() => {
    const rememberedUserType = cookies.rememberedUserType;
    if (rememberedUserType) {
      setUserType(rememberedUserType);
    } else {
      setUserType("faculty");
    }
  }, [location.pathname, cookies.rememberedUserType]);

  useEffect(() => {
    const rememberedEmail = cookies.rememberedEmail;
    const rememberedUserType = cookies.rememberedUserType;
    if (rememberedEmail && rememberedUserType === userType) {
      setEmail(rememberedEmail);
    } else {
      setEmailErrorMessage("");
      setPwErrorMessage("");
      setEmail("");
    }
    const rememberedRememberMe = cookies.rememberMe === "true";
    setRememberMe(rememberedRememberMe);
  }, [cookies.rememberedEmail, cookies.rememberedUserType, userType]);

  const handleUserTypeChange = useCallback((e) => {
    setUserType(e.target.value);
    setEmail(""); // 사용자 유형 변경 시 이메일 초기화
  }, []);

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    setEmailErrorMessage(""); // 이메일 입력 시 오류 메시지 초기화
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    setPwErrorMessage(""); // 비밀번호 입력 시 오류 메시지 초기화
  }, []);

  const handleRememberMeChange = useCallback((e) => {
    setRememberMe(e.target.checked);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailErrorMessage(""); // 제출 시 오류 메시지 초기화
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
      // 입력되지 않은 경우 handleSubmit 실행 중지
      return;
    }

    try {
      const endpoint =
        userType === "faculty"
          ? "http://localhost:5000/api/login/faculty"
          : "http://localhost:5000/api/login/student";

      const response = await axios.post(endpoint, {
        email,
        password,
        userType,
      });

      console.log("Login response:", response.data);

      if (response.status === 200) {
        if (rememberMe) {
          setCookie("rememberedEmail", email, { path: "/" });
          setCookie("rememberedUserType", userType, { path: "/" });
          setCookie("rememberMe", "true", { path: "/" });
        } else {
          removeCookie("rememberedEmail", { path: "/" });
          removeCookie("rememberedUserType", { path: "/" });
          removeCookie("rememberMe", { path: "/" });
        }

        setAuthUserType(userType);

        if (userType === "faculty") {
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
