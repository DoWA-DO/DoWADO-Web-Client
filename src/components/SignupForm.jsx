import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import InfoCheck from "./InfoCheckModal";
import UserTypeSelector from "./UserTypeSelector";

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    schoolName: "",
    schoolGrade: "",
    schoolClass: "",
    schoolNumber: "",
    teacherEmail: "",
  });

  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [inputVerificationCode, setInputVerificationCode] = useState("");

  const [errors, setErrors] = useState({});
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [userType, setUserType] = useState("faculty");

  const [agree, setAgree] = useState(false);
  const [terms, setTerms] = useState(false);
  const [agreeError, setAgreeError] = useState("");
  const [termsError, setTermsError] = useState("");

  const validateKorean = (value) => /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/.test(value);
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePassword = (value) =>
    /^(?=.*\d)(?=.*[a-z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/.test(value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value.replace(/\s/g, ""); // 공백 제거

    if (name === "name" || name === "schoolName") {
      filteredValue = filteredValue.replace(/[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, ""); // 한글만 허용
    }

    setFormData((prev) => ({ ...prev, [name]: filteredValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    switch (name) {
      case "name":
        if (!validateKorean(filteredValue)) {
          setErrors((prev) => ({
            ...prev,
            name: "한글로 된 이름을 입력해 주세요.",
          }));
        }
        break;
      case "email":
        if (!validateEmail(filteredValue)) {
          setErrors((prev) => ({
            ...prev,
            email: "유효한 이메일 주소를 입력해 주세요.",
          }));
          setIsEmailValid(false);
        } else {
          setIsEmailValid(true);
        }
        break;
      case "password":
        if (!validatePassword(filteredValue)) {
          setErrors((prev) => ({
            ...prev,
            password:
              "비밀번호는 숫자, 소문자, 특수문자를 포함하여 8자리 이상이어야 합니다.",
          }));
        }
        break;
      case "confirmPassword":
        if (filteredValue !== formData.password) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "비밀번호가 일치하지 않습니다.",
          }));
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!formData.name) newErrors.name = "이름을 입력해 주세요.";
    if (!formData.email) newErrors.email = "이메일을 입력해 주세요.";
    if (!formData.password) newErrors.password = "비밀번호를 입력해 주세요.";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "비밀번호를 확인해 주세요.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    if (!formData.schoolName)
      newErrors.schoolName = "학교 이름을 입력해 주세요.";
    if (!formData.schoolGrade) newErrors.schoolGrade = "학년을 입력해 주세요.";
    if (!formData.schoolClass) newErrors.schoolClass = "반을 입력해 주세요.";
    if (userType === "student" && !formData.schoolNumber)
      newErrors.schoolNumber = "번호를 입력해 주세요.";
    if (userType === "student" && !formData.teacherEmail)
      newErrors.teacherEmail = "담임 선생님 이메일을 입력해 주세요.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    if (!isEmailValid || !emailSent) {
      alert("이메일 인증을 완료해주세요.");
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

    try {
      const endpoint =
        userType === "faculty"
          ? "http://localhost:8000/signup/faculty"
          : "http://localhost:8000/signup/student";

      const response = await axios.post(endpoint, { ...formData, userType });

      if (response.status !== 200) {
        throw new Error("회원가입에 실패했습니다.");
      }

      alert("회원가입이 성공적으로 완료되었습니다.");
      navigate("/LoginPage");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        schoolName: "",
        schoolGrade: "",
        schoolClass: "",
        schoolNumber: "",
        teacherEmail: "",
      });
      setVerificationCode("");
      setEmailSent(false);
      setInputVerificationCode("");
      setModalOpen(false);
      setAgree(false);
      setTerms(false);
    } catch (error) {
      console.error("Error:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.");
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

  const handleEmailAuth = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/send-verification-code",
        { email: formData.email }
      );

      if (response.status !== 200) {
        throw new Error("이메일 인증에 실패했습니다.");
      }

      setVerificationCode(response.data.verificationCode);
      setEmailSent(true);
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
    if (inputVerificationCode === verificationCode) {
      alert("이메일 인증이 완료되었습니다.");
    } else {
      alert("인증 코드가 올바르지 않습니다.");
    }
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  return (
    <div className="signup-form-container">
      <form onSubmit={handleSubmit}>
        <UserTypeSelector userType={userType} onChange={handleUserTypeChange} />
        <div className="lg-form-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        <div className="lg-form-group" id="email-form">
          <label htmlFor="email">이메일</label>
          <div className="email-input">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <button id="email-Auth-btn" type="button" onClick={handleEmailAuth}>
              이메일 인증
            </button>
          </div>
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        <div className="lg-form-group">
          <label htmlFor="verification-code">인증번호</label>
          <input
            type="text"
            id="verification-code"
            name="verification-code"
            value={inputVerificationCode}
            onChange={handleVerificationCodeChange}
          />
        </div>
        <div className="lg-form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>
        <div className="lg-form-group">
          <label htmlFor="confirm-password">비밀번호 확인</label>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <div className="error-message">{errors.confirmPassword}</div>
          )}
        </div>
        <div className="lg-form-group">
          <label htmlFor="school-name">학교 이름</label>
          <input
            type="text"
            id="school-name"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleChange}
          />
          {errors.schoolName && (
            <div className="error-message">{errors.schoolName}</div>
          )}
        </div>
        <div className="lg-form-group row">
          <label htmlFor="school-grade">학년</label>
          <input
            type="number"
            id="school-grade"
            name="schoolGrade"
            value={formData.schoolGrade}
            onChange={handleChange}
          />
          {errors.schoolGrade && (
            <div className="error-message">{errors.schoolGrade}</div>
          )}
        </div>
        <div className="lg-form-group row">
          <label htmlFor="school-class">반</label>
          <input
            type="number"
            id="school-class"
            name="schoolClass"
            value={formData.schoolClass}
            onChange={handleChange}
          />
          {errors.schoolClass && (
            <div className="error-message">{errors.schoolClass}</div>
          )}
        </div>
        <div className="lg-form-group row">
          {userType === "student" && (
            <>
              <label htmlFor="school-number">번호</label>
              <input
                type="number"
                id="school-number"
                name="schoolNumber"
                value={formData.schoolNumber}
                onChange={handleChange}
              />
              {errors.schoolNumber && (
                <div className="error-message">{errors.schoolNumber}</div>
              )}
            </>
          )}
        </div>
        {userType === "student" && (
          <>
            <div className="lg-form-group">
              <label htmlFor="teacher-email">담임 선생님 이메일</label>
              <input
                type="email"
                id="teacher-email"
                name="teacherEmail"
                value={formData.teacherEmail}
                onChange={handleChange}
              />
              {errors.teacherEmail && (
                <div className="error-message">{errors.teacherEmail}</div>
              )}
            </div>
          </>
        )}
        <div className="info-check">
          <label>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            개인정보수집 및 이용 동의
            <a href="#" onClick={() => openModal("privacy")}>
              확인
            </a>
          </label>
          {agreeError && <div className="error-message">{agreeError}</div>}
        </div>
        <div className="info-check">
          <label>
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
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

export default SignupForm;
