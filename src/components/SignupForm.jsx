import React, { useState } from "react";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPasswod] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [emailSent, setEmailSent] = useState(false); // 이메일 인증 상태 관리
  const [verificationCode, setVerificationCode] = useState(""); // 사용자가 입력한 인증 코드
  const [inputVerificationCode, setInputVerificationCode] = useState(""); // 서버에서 받은 인증 코드
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 유효성 검사 에러 메시지
  const [emailError, setEmailError] = useState(""); // 이메일 유효성 검사 에러 메시지

  const validatePassword = (value) => {
    const pwRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/;
    if (!pwRegex.test(value)) {
      setPasswordError(
        "비밀번호는 숫자, 소문자, 특수문자를 포함하여 8자리 이상이어야 합니다."
      );
    } else {
      setPasswordError("");
    }
  };

  const validateEmail = (value) => {
    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("유효한 이메일 주소를 입력해주세요.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 비밀번호 확인
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 회원가입 데이터
    const userData = {
      email: email,
      password: password,
      schoolName: schoolName,
    };

    try {
      // 서버로 데이터 전송
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/Json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("회원가입에 실패했습니다.");
      }

      alert("회원가입이 성공적으로 완료되었습니다.");
      // 회원가입 완료되면 로그인 페이지로 이동

      setEmail("");
      setPassword("");
      setConfirmPasswod("");
      setSchoolName("");
      setVerificationCode("");
      setEmailSent(false);
      setInputVerificationCode("");
    } catch (error) {
      console.error("Error:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const handleEmailAuth = async () => {
    try {
      // 서버로 이메일 인증 요청
      console.log("이메일 인증");
      const response = await fetch(
        "http://localhost:8000/send-verification-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("이메일 인증에 실패했습니다.");
      }

      const data = await response.json();
      setVerificationCode(data.verificationCode);
      setEmailSent(true);
      alert("인증 이메일이 발송되었습니다.");
    } catch (error) {
      console.error("Error:", error);
      alert("이메일 인증 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const handleVerificationCodeChange = (e) => {
    setInputVerificationCode(e.target.value);
  };

  const handleVerificationCodeSubmit = (e) => {
    e.preventDefault();
    if (inputVerificationCode === verificationCode) {
      alert("이메일 인증이 완료되었습니다.");
      // 인증 완료 후 필요한 로직 추가
    } else {
      alert("인증 코드가 올바르지 않습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <div className="email-input">
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
            required
          />
          <button id="email-Auth-btn" onClick={handleEmailAuth}>
            이메일 인증
          </button>
        </div>
        {emailError && <div className="error-message">{emailError}</div>}
      </div>
      {emailSent && (
        <div className="form-group">
          <label htmlFor="verification-code">Verification Code</label>
          <input
            type="text"
            id="verification-code"
            name="verification-code"
            value={verificationCode}
            onChange={handleVerificationCodeChange}
            required
          />
        </div>
      )}
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
          required
        />
        {passwordError && <div className="error-message">{passwordError}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPasswod(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="school-name">School Name</label>
        <input
          type="text"
          id="school-name"
          name="school-name"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="login-button">
        Sign Up
      </button>
      <div className="signup-link">
        Already have an account? <a href="/">Login Here</a>
      </div>
    </form>
  );
};

export default SignupForm;
