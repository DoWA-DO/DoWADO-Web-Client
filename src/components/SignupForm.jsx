import React, { useState } from "react";
import Modal from 'react-modal';

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [emailSent, setEmailSent] = useState(false); // 이메일 인증 상태 관리
  const [verificationCode, setVerificationCode] = useState(""); // 사용자가 입력한 인증 코드
  const [inputVerificationCode, setInputVerificationCode] = useState(""); // 서버에서 받은 인증 코드
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 유효성 검사 에러 메시지
  const [emailError, setEmailError] = useState(""); // 이메일 유효성 검사 에러 메시지
  const [agree, setAgree] = useState(false); // 개인정보 수집 동의 상태 관리
  const [agreeError, setAgreeError] = useState(""); // 개인정보 수집 동의 체크박스 에러 메시지
  const [terms, setTerms] = useState(false); // 약관 동의 상태 관리
  const [termsError, setTermsError] = useState(""); // 약관 동의 체크박스 에러 메시지
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태 관리
  const [modalContent, setModalContent] = useState(""); // 모달 내용 상태 관리
  const [modalTitle, setModalTitle] = useState(""); // 모달 제목 상태 관리

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

    if (!agree) {
      setAgreeError("개인정보 수집에 동의해 주세요.");
      return;
    } else {
      setAgreeError("");
    }

    if (!terms) {
      setTermsError("이용약관에 동의해 주세요.");
      return;
    } else {
      setTermsError("");
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
          "Content-Type": "application/json",
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
      setConfirmPassword("");
      setSchoolName("");
      setVerificationCode("");
      setEmailSent(false);
      setInputVerificationCode("");
      setAgree(false); // 동의 상태 초기화
      setTerms(false); // 약관 동의 상태 초기화
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

  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const privacyPolicy = `
    '도와도'(이하 "회사" 또는 "도와도"라고 함) 는 개인정보 보호법에 따라 이용자의 개인정보를 보호하고 이를 위하여 개인정보 수집 및 이용에 대한 동의를 받고자 합니다. 본 동의서는 회사의 서비스를 이용함에 있어 개인정보를 제공받고, 이용하는 목적, 항목, 보유 및 이용기간 등을 명시하고 있습니다.

    1. 개인정보의 수집 및 이용 목적
    회사는 다음과 같은 목적으로 개인정보를 수집하고 이용합니다.
    - 회원 가입 및 관리
    - 서비스 제공 및 운영
    - 고객 문의 및 불만 처리
    - 마케팅 및 광고 활용
    - 법적 의무 이행

    2. 수집하는 개인정보의 항목
    회사는 회원 가입, 서비스 제공을 위하여 다음과 같은 개인정보를 수집합니다.
    - 필수 항목: 이메일 주소, 비밀번호, 학교명

    3. 개인정보의 보유 및 이용기간
    회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 다만, 관계 법령에 따라 일정 기간 보관해야 하는 경우에는 해당 기간 동안 보관합니다.

    4. 동의를 거부할 권리 및 동의 거부에 따른 불이익
    이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 동의를 거부할 경우 서비스 제공이 제한될 수 있습니다.
  `;

  const termsOfService = `
    '도와도'(이하 "회사" 또는 "도와도"라고 함)의 서비스 이용약관은 회사가 제공하는 모든 서비스의 이용과 관련하여 이용자의 권리, 의무 및 책임사항을 규정하고 있습니다. 회사의 서비스를 이용하기 위해서는 본 약관에 동의하여야 합니다.

    1. 약관의 목적
    본 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

    2. 서비스의 제공 및 변경
    회사는 이용자에게 다음과 같은 서비스를 제공합니다:
    - 회원 가입 및 관리
    - 정보 제공
    - 기타 회사가 정하는 서비스

    3. 이용자의 의무
    이용자는 서비스 이용 시 다음의 행위를 하여서는 안 됩니다:
    - 허위 정보의 등록
    - 타인의 개인정보 도용
    - 서비스의 부정한 이용
    - 회사 및 제3자의 권리 침해

    4. 개인정보 보호
    회사는 이용자의 개인정보를 보호하기 위하여 관련 법령에 따라 개인정보 처리방침을 수립하고 이를 준수합니다.

    5. 약관의 개정
    회사는 필요한 경우 관련 법령을 위반하지 않는 범위 내에서 본 약관을 개정할 수 있습니다. 약관이 개정될 경우 회사는 개정 내용과 시행일을 명시하여 서비스 초기 화면에 공지합니다.
  `;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <div className="email-input-wrapper">
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
            <button
              type="button"
              className="verification-button-inline"
              onClick={handleEmailAuth}
            >
              이메일 인증
            </button>
          </div>
          {emailError && <div className="error-message">{emailError}</div>}
        </div>
        {emailSent && (
          <div className="form-group">
            <label htmlFor="verification-code">인증 코드</label>
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
            required
          />
          {passwordError && <div className="error-message">{passwordError}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">비밀번호 확인</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="school-name">학교명</label>
          <input
            type="text"
            id="school-name"
            name="school-name"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            required
          />
        </div>
        <div className="consent-group">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            required
          />
          <label>(필수) 개인정보수집 동의</label>
          <button
            type="button"
            className="link-button"
            onClick={() => openModal('개인정보 수집 및 이용 동의서', privacyPolicy)}
          >
            보기
          </button>
          {agreeError && <div className="error-message">{agreeError}</div>}
        </div>
        <div className="consent-group">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            required
          />
          <label>(필수) 이용약관 동의</label>
          <button
            type="button"
            className="link-button"
            onClick={() => openModal('이용약관 동의서', termsOfService)}
          >
            보기
          </button>
          {termsError && <div className="error-message">{termsError}</div>}
        </div>
        <button type="submit" className="login-button">
          회원가입
        </button>
        <div className="signup-link">
          이미 계정이 있으신가요? <a href="/">로그인 가기</a>
        </div>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="동의서"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>{modalTitle}</h2>
        <div className="modal-content">{modalContent}</div>
        <button onClick={closeModal} className="modal-close-button">
          닫기
        </button>
      </Modal>
    </>
  );
};

export default SignupForm;
