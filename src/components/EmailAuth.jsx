import React, { useState } from "react";
import axios from "axios";

const EmailAuthComponent = ({ email, setEmail }) => {
  const [inputVerificationCode, setInputVerificationCode] = useState("");
  const [generatedVerificationCode, setGeneratedVerificationCode] = useState("");

  const handleEmailAuth = async () => {
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
    } catch (error) {
      console.error("Email Auth Error:", error);
      alert("이메일 인증 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const handleVerificationCodeChange = (e) => {
    setInputVerificationCode(e.target.value);
  };

  const handleVerificationCodeSubmit = (e) => {
    e.preventDefault();
    if (inputVerificationCode === generatedVerificationCode) {
      alert("이메일 인증이 완료되었습니다.");
    } else {
      alert("인증 코드가 올바르지 않습니다.");
    }
  };

  return (
    <div className="lg-form-group" id="email-form">
      <label htmlFor="teacher_email">이메일</label>
      <div className="email-input">
        <input
          type="email"
          id="teacher_email"
          name="teacher_email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="button" onClick={handleEmailAuth}>
          이메일 인증
        </button>
      </div>
      <div className="lg-form-group">
        <label htmlFor="verification-code">인증번호</label>
        <div className="email-input">
          <input
            type="text"
            id="verification-code"
            name="verification-code"
            value={inputVerificationCode}
            onChange={handleVerificationCodeChange}
          />
          <button type="button" onClick={handleVerificationCodeSubmit}>
            인증 확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailAuthComponent;
