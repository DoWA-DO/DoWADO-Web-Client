import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import InfoCheck from "./InfoCheckModal";

const SignupForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [emailSent, setEmailSent] = useState(false); // 이메일 인증 상태 관리
  const [verificationCode, setVerificationCode] = useState(""); // 사용자가 입력한 인증 코드
  const [inputVerificationCode, setInputVerificationCode] = useState(""); // 서버에서 받은 인증 코드
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 유효성 검사 에러 메시지
  const [confirmPwError, setConfirmPwError] = useState(""); // 비밀번호 일치 확인 에러 메시지
  const [emailError, setEmailError] = useState(""); // 이메일 유효성 검사 에러 메시지
  const [isEmailValid, setIsEmailValid] = useState(false); // 이메일 유효성 상태
  const [modalOpen, setModalOpen] = useState(false); // 모달 창 상태 관리
  const [schoolNameError, setSchoolNameError] = useState(""); // 학교 이름 필드 에러 메시지

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

  const checkPassword = (pw, confirmPw) => {
    // 비밀번호 확인
    console.log(pw, confirmPw);
    if (pw !== confirmPw) {
      setConfirmPwError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmPwError("");
    }
  };

  const validateEmail = (value) => {
    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("유효한 이메일 주소를 입력해주세요.");
      setIsEmailValid(false);
    } else {
      setEmailError("");
      setIsEmailValid(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 이전 에러 초기화
    setEmailError("");
    setPasswordError("");
    setConfirmPwError("");
    setSchoolNameError("");

    // 빈칸, 이메일 인증 완료 확인
    if (!email) {
      setEmailError("이메일을 입력해 주세요.");
      return;
    }
    if (!password) {
      setPasswordError("비밀번호를 입력해 주세요.");
      return;
    }
    if (!confirmPassword) {
      setConfirmPwError("비밀번호를 확인해 주세요.");
      return;
    }
    if (!schoolName) {
      setSchoolNameError("학교 이름을 입력해 주세요.");
      return;
    }
    if (!isEmailValid || !emailSent) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    // 체크박스 체크 여부 확인
    const checkboxChecked = document.getElementById("checkbox").checked;
    if (!checkboxChecked) {
      alert("개인정보 수집 및 이용 동의에 체크해주세요.");
      return;
    }

    // 오류가 없으면 회원가입 진행
    if (emailError || passwordError || confirmPwError || schoolNameError) {
      return;
    }

    const userData = {
      email: email,
      password: password,
      schoolName: schoolName,
    };

    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("회원가입에 실패했습니다.");
      }

      alert("회원가입이 성공적으로 완료되었습니다.");
      navigate("/LoginPage");

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSchoolName("");
      setVerificationCode("");
      setEmailSent(false);
      setInputVerificationCode("");
      setModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
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
    <div className="signup-form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group" id="email-form">
          <label htmlFor="email">이메일</label>
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
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
          />
          {passwordError && (
            <div className="error-message">{passwordError}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">비밀번호 확인</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              checkPassword(password, e.target.value);
            }}
          />
          {confirmPwError && (
            <div className="error-message">{confirmPwError}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="school-name">학교 이름</label>
          <input
            type="text"
            id="school-name"
            name="school-name"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
          />
        </div>
        <div className="info-check">
          <label>
            <input type="checkbox" />
            개인정보 수집 및 이용 동의
            <a href="#" onClick={openModal}>
              확인
            </a>
          </label>
        </div>
        <button type="submit" className="login-button">
          회원가입
        </button>
        <div className="signup-link">
          계정이 있나요? <a href="/">로그인</a>
        </div>
      </form>

      {/* 개인정보 이용 동의 모달 */}
      <InfoCheck isOpen={modalOpen} closeModal={closeModal} />
    </div>
  );
};

export default SignupForm;
