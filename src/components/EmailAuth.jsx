import React, { useState } from "react";
import axios from "axios";

const EmailAuthComponent = ({ email, setEmail, setIsVerified }) => {
  const [inputVerificationCode, setInputVerificationCode] = useState("");
  const [generatedVerificationCode, setGeneratedVerificationCode] =
    useState("");
  const [emailError, setEmailError] = useState(""); // 이메일 오류 메시지
  const [verificationError, setVerificationError] = useState("");

  const validateEmail = (value) =>
    /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);

  const handleEmailAuth = async () => {
    if (!email) {
      setEmailError("이메일을 입력해 주세요.");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("유효한 이메일 주소를 입력해 주세요.");
      return;
    }
    try {
      console.log("Sending email to:", email);
      const response = await axios.post(
        "http://localhost:8000/api/v1/mail/send_email",
        { to_email: email }
      );

      if (response.status !== 200) {
        throw new Error("이메일 인증에 실패했습니다.");
      }

      setGeneratedVerificationCode(response.data.verification_code);
      alert("인증 이메일이 발송되었습니다.");
      setEmailError(""); // 성공 시 에러 메시지 초기화
    } catch (error) {
      console.error("Email Auth Error:", error);
      setEmailError("이메일 인증 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const handleVerificationCodeChange = (e) => {
    setInputVerificationCode(e.target.value);
  };

  const handleVerificationCodeSubmit = (e) => {
    e.preventDefault();
    if (inputVerificationCode === generatedVerificationCode) {
      setIsVerified(true);
      setVerificationError(""); // 성공 시 에러 메시지 초기화
      alert("이메일 인증이 완료되었습니다.");
    } else {
      setIsVerified(false);
      setVerificationError("인증 코드가 올바르지 않습니다.");
    }
  };

  return (
    <>
      <div className="lg-form-group" id="email-form">
        <label htmlFor="teacher_email">이메일</label>
        <div className="email-input">
          <input
            type="email"
            id="teacher_email"
            name="teacher_email"
            value={email}
            placeholder="user@example.com"
            onChange={(e) => {
              setEmail(e.target.value);
              if (!validateEmail(e.target.value)) {
                setEmailError("유효한 이메일 주소를 입력해 주세요.");
              } else {
                setEmailError("");
              }
            }}
            onBlur={() => {
              if (!email) {
                setEmailError("이메일을 입력해 주세요.");
              }
            }}
          />
          <button type="button" onClick={handleEmailAuth}>
            이메일 인증
          </button>
        </div>
        {emailError && <div className="error-message">{emailError}</div>}
      </div>
      <div className="lg-form-group">
        <label htmlFor="verification-code">인증번호</label>
        <div className="email-input">
          <input
            type="text"
            id="verification-code"
            name="verification-code"
            value={inputVerificationCode}
            placeholder="인증번호"
            onChange={handleVerificationCodeChange}
          />
          <button type="button" onClick={handleVerificationCodeSubmit}>
            인증 확인
          </button>
        </div>
        {verificationError && (
          <div className="error-message">{verificationError}</div>
        )}
      </div>
    </>
  );
};

export default EmailAuthComponent;
