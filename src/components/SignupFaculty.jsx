import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InfoCheck from "./InfoCheckModal";

const SignupFaculty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    teacher_name: "",
    teacher_email: "",
    teacher_password: "",
    teacher_password2: "",
    teacher_school: "",
    teacher_grade: "",
    teacher_class: "",
  });

  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const [agree, setAgree] = useState(false);
  const [terms, setTerms] = useState(false);
  const [agreeError, setAgreeError] = useState("");
  const [termsError, setTermsError] = useState("");

  const [emailVerified, setEmailVerified] = useState(false); // 이메일 인증 상태 추가
  const [inputVerificationCode, setInputVerificationCode] = useState("");
  const [generatedVerificationCode, setGeneratedVerificationCode] =
    useState("");
  const [emailError, setEmailError] = useState(""); // 이메일 오류 메시지
  const [verificationError, setVerificationError] = useState("");

  const validateKorean = (value) => /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/.test(value);
  const validateEmail = (value) =>
    /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);
  const validatePassword = (value) =>
    /^(?=.*\d)(?=.*[a-z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/.test(value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value.replace(/\s/g, ""); // 공백 제거

    if (name === "teacher_name" || name === "teacher_school") {
      filteredValue = filteredValue.replace(/[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, ""); // 한글만 허용
    }

    setFormData((prev) => ({ ...prev, [name]: filteredValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    switch (name) {
      case "teacher_name":
        if (!validateKorean(filteredValue)) {
          setErrors((prev) => ({
            ...prev,
            teacher_name: "한글로 된 이름을 입력해 주세요.",
          }));
        }
        break;
      case "teacher_email":
        if (!validateEmail(filteredValue)) {
          setErrors((prev) => ({
            ...prev,
            teacher_email: "유효한 이메일 주소를 입력해 주세요.",
          }));
        }
        break;
      case "teacher_password":
        if (!validatePassword(filteredValue)) {
          setErrors((prev) => ({
            ...prev,
            teacher_password:
              "비밀번호는 숫자, 소문자, 특수문자를 포함하여 8자리 이상이어야 합니다.",
          }));
        }
        break;
      case "teacher_password2":
        if (filteredValue !== formData.teacher_password) {
          setErrors((prev) => ({
            ...prev,
            teacher_password2: "비밀번호가 일치하지 않습니다.",
          }));
        }
        break;
      default:
        break;
    }
  };

  const handleAgreeChange = (e) => {
    setAgree(e.target.checked);
    if (e.target.checked) {
      setAgreeError("");
    }
  };

  const handleTermsChange = (e) => {
    setTerms(e.target.checked);
    if (e.target.checked) {
      setTermsError("");
    }
  };

  const handleEmailAuth = async () => {
    const email = formData.teacher_email;

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
    if (!inputVerificationCode) {
      setVerificationError("인증번호를 입력해 주세요.");
      return;
    }
    e.preventDefault();
    if (inputVerificationCode === generatedVerificationCode) {
      setEmailVerified(true);
      setVerificationError(""); 
      alert("이메일 인증이 완료되었습니다.");
    } else {
      setEmailVerified(false);
      setVerificationError("인증 코드가 올바르지 않습니다.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!formData.teacher_name)
      newErrors.teacher_name = "이름을 입력해 주세요.";
    if (!formData.teacher_email)
      newErrors.teacher_email = "이메일을 입력해 주세요.";
    if (!formData.teacher_password)
      newErrors.teacher_password = "비밀번호를 입력해 주세요.";
    if (!formData.teacher_password2)
      newErrors.teacher_password2 = "비밀번호를 확인해 주세요.";
    if (formData.teacher_password !== formData.teacher_password2)
      newErrors.teacher_password2 = "비밀번호가 일치하지 않습니다.";
    if (!formData.teacher_school)
      newErrors.teacher_school = "학교 이름을 입력해 주세요.";
    if (!formData.teacher_grade)
      newErrors.teacher_grade = "학년을 입력해 주세요.";
    if (!formData.teacher_class)
      newErrors.teacher_class = "반을 입력해 주세요.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    if (!emailVerified) {
      setErrors((prev) => ({
        ...prev,
        verification_code: "인증번호를 인증해 주세요.",
      }));
      return;
    } else {
      setErrors((prev) => ({
        ...prev,
        verification_code: "",
      }));
    }

    if (!agree) {
      setAgreeError("개인정보수집 및 이용에 동의해 주세요.");
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

    try {
      const endpoint = "http://localhost:8000/api/v1/teacher/signup";

      const response = await axios.post(endpoint, formData);

      if (response.status !== 200) {
        throw new Error("회원가입에 실패했습니다.");
      }

      alert("회원가입이 성공적으로 완료되었습니다.");
      navigate("/login");

      setFormData({
        teacher_name: "",
        teacher_email: "",
        teacher_password: "",
        teacher_password2: "",
        teacher_school: "",
        teacher_grade: "",
        teacher_class: "",
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("이미 가입된 이메일입니다.");
      } else {
        console.error("Error:", error);
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    }
  };

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent("");
  };

  return (
    <div className="signup-form-container">
      <form onSubmit={handleSubmit}>
        <div className="lg-form-group">
          <label htmlFor="teacher_name">이름</label>
          <input
            type="text"
            id="teacher_name"
            name="teacher_name"
            value={formData.teacher_name}
            onChange={handleChange}
            placeholder="이름(한글)"
          />
          {errors.teacher_name && (
            <div className="error-message">{errors.teacher_name}</div>
          )}
        </div>
        <div className="lg-form-group" id="email-form">
          <label htmlFor="teacher_email">이메일</label>
          <div className="email-input">
            <input
              type="email"
              id="teacher_email"
              name="teacher_email"
              value={formData.teacher_email}
              placeholder="user@example.com"
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  teacher_email: e.target.value,
                }));
                if (!validateEmail(e.target.value)) {
                  setEmailError("유효한 이메일 주소를 입력해 주세요.");
                } else {
                  setEmailError("");
                }
              }}
              onBlur={() => {
                if (!formData.teacher_email) {
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
        {errors.verification_code && (
          <div className="error-message">{errors.verification_code}</div>
        )}
        <div className="lg-form-group">
          <label htmlFor="teacher_password">비밀번호</label>
          <input
            type="password"
            id="teacher_password"
            name="teacher_password"
            placeholder="영문, 숫자, 특수문자 포함 8자 이상 입력"
            value={formData.teacher_password}
            onChange={handleChange}
          />
          {errors.teacher_password && (
            <div className="error-message">{errors.teacher_password}</div>
          )}
        </div>
        <div className="lg-form-group">
          <label htmlFor="teacher_password2">비밀번호 확인</label>
          <input
            type="password"
            id="teacher_password2"
            name="teacher_password2"
            value={formData.teacher_password2}
            placeholder="비밀번호 확인"
            onChange={handleChange}
          />
          {errors.teacher_password2 && (
            <div className="error-message">{errors.teacher_password2}</div>
          )}
        </div>
        <div className="lg-form-group">
          <label htmlFor="teacher_school">학교 이름</label>
          <input
            type="text"
            id="teacher_school"
            name="teacher_school"
            value={formData.teacher_school}
            placeholder="학교 이름(한글)"
            onChange={handleChange}
          />
          {errors.teacher_school && (
            <div className="error-message">{errors.teacher_school}</div>
          )}
        </div>
        <div className="lg-form-group">
          <label htmlFor="teacher_grade">학년</label>
          <input
            type="number"
            id="teacher_grade"
            name="teacher_grade"
            value={formData.teacher_grade}
            placeholder="학년"
            min={1}
            max={6}
            onChange={handleChange}
          />
          {errors.teacher_grade && (
            <div className="error-message">{errors.teacher_grade}</div>
          )}
        </div>
        <div className="lg-form-group">
          <label htmlFor="teacher_class">반</label>
          <input
            type="number"
            id="teacher_class"
            name="teacher_class"
            value={formData.teacher_class}
            placeholder="반"
            min={1}
            onChange={handleChange}
          />
          {errors.teacher_class && (
            <div className="error-message">{errors.teacher_class}</div>
          )}
        </div>
        <div className="info-check">
          <label htmlFor="privacy">
            <input
              type="checkbox"
              checked={agree}
              onChange={handleAgreeChange}
            />
            개인정보 수집이용 동의
            <a href="#" onClick={() => openModal("privacy")}>
              확인
            </a>
          </label>
          {agreeError && <div className="error-message">{agreeError}</div>}
        </div>
        <div className="info-check">
          <label htmlFor="terms">
            <input
              type="checkbox"
              checked={terms}
              onChange={handleTermsChange}
            />
            이용약관 동의
            <a href="#" onClick={() => openModal("terms")}>
              확인
            </a>
          </label>
          {termsError && <div className="error-message">{termsError}</div>}
        </div>

        <button type="submit" className="login-button">
          회원가입
        </button>
        <div className="signup-link">
          계정이 있나요? <a href="/login">로그인</a>
        </div>
      </form>

      <InfoCheck
        isOpen={modalOpen}
        closeModal={closeModal}
        content={modalContent}
      />
    </div>
  );
};

export default SignupFaculty;
