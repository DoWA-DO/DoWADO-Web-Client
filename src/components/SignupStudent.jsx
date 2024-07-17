import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import InfoCheck from "./InfoCheckModal";

const SignupStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_name: "",
    student_email: "",
    student_password: "",
    student_password2: "",
    student_school: "",
    student_grade: "",
    student_class: "",
    student_number: "",
    teacher_email: "",
  });

  const [errors, setErrors] = useState({});
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

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

    if (name === "student_name" || name === "student_school") {
      filteredValue = filteredValue.replace(/[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, ""); // 한글만 허용
    }

    setFormData((prev) => ({ ...prev, [name]: filteredValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    switch (name) {
      case "student_name":
        if (!validateKorean(filteredValue)) {
          setErrors((prev) => ({
            ...prev,
            student_name: "한글로 된 이름을 입력해 주세요.",
          }));
        }
        break;
      case "student_email":
        if (!validateEmail(filteredValue)) {
          setErrors((prev) => ({
            ...prev,
            student_email: "유효한 이메일 주소를 입력해 주세요.",
          }));
        }
        break;
      case "student_password":
        if (!validatePassword(filteredValue)) {
          setErrors((prev) => ({
            ...prev,
            student_password:
              "비밀번호는 숫자, 소문자, 특수문자를 포함하여 8자리 이상이어야 합니다.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, student_password: "" }));
        }
        if (filteredValue !== formData.student_password2) {
          setErrors((prev) => ({
            ...prev,
            student_password2: "비밀번호가 일치하지 않습니다.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, student_password2: "" }));
        }
        break;
      case "student_password2":
        if (filteredValue !== formData.student_password) {
          setErrors((prev) => ({
            ...prev,
            student_password2: "비밀번호가 일치하지 않습니다.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, student_password2: "" }));
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!formData.student_name)
      newErrors.student_name = "이름을 입력해 주세요.";
    if (!formData.student_email)
      newErrors.student_email = "이메일을 입력해 주세요.";
    if (!formData.student_password)
      newErrors.student_password = "비밀번호를 입력해 주세요.";
    if (!formData.student_password2)
      newErrors.student_password2 = "비밀번호를 확인해 주세요.";
    if (formData.student_password !== formData.student_password2)
      newErrors.student_password2 = "비밀번호가 일치하지 않습니다.";
    if (!formData.student_school)
      newErrors.student_school = "학교 이름을 입력해 주세요.";
    if (!formData.student_grade)
      newErrors.student_grade = "학년을 입력해 주세요.";
    if (!formData.student_class)
      newErrors.student_class = "반을 입력해 주세요.";
    if (!formData.student_number)
      newErrors.student_number = "번호를 입력해 주세요.";
    if (!formData.teacher_email)
      newErrors.teacher_email = "담임 선생님 이메일을 입력해 주세요.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

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
      const endpoint = "http://localhost:8000/api/v1/student/signup";

      const response = await axios.post(endpoint, formData);

      if (response.status !== 200) {
        throw new Error("회원가입에 실패했습니다.");
      }

      alert("회원가입이 성공적으로 완료되었습니다.");
      navigate("/login");

      setFormData({
        student_name: "",
        student_email: "",
        student_password: "",
        student_password2: "",
        student_school: "",
        student_grade: "",
        student_class: "",
        student_number: "",
        teacher_email: "",
      });
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

  return (
    <div className="signup-form-container">
      <form onSubmit={handleSubmit}>
        <div className="lg-form-group">
          <label htmlFor="student_name">이름</label>
          <input
            type="text"
            id="student_name"
            name="student_name"
            value={formData.student_name}
            onChange={handleChange}
          />
          {errors.student_name && (
            <div className="error-message">{errors.student_name}</div>
          )}
        </div>
        <div className="lg-form-group" id="email-form">
          <label htmlFor="student_email">이메일</label>
          <input
            type="email"
            id="student_email"
            name="student_email"
            value={formData.student_email}
            onChange={handleChange}
          />
          {errors.student_email && (
            <div className="error-message">{errors.student_email}</div>
          )}
        </div>
        <div className="lg-form-group">
          <label htmlFor="student_password">비밀번호</label>
          <input
            type="password"
            id="student_password"
            name="student_password"
            value={formData.student_password}
            onChange={handleChange}
          />
          {errors.student_password && (
            <div className="error-message">{errors.student_password}</div>
          )}
        </div>
        <div className="lg-form-group">
          <label htmlFor="student_password2">비밀번호 확인</label>
          <input
            type="password"
            id="student_password2"
            name="student_password2"
            value={formData.student_password2}
            onChange={handleChange}
          />
          {errors.student_password2 && (
            <div className="error-message">{errors.student_password2}</div>
          )}
        </div>
        <div className="lg-form-group">
          <label htmlFor="student_school">학교 이름</label>
          <input
            type="text"
            id="student_school"
            name="student_school"
            value={formData.student_school}
            onChange={handleChange}
          />
          {errors.student_school && (
            <div className="error-message">{errors.student_school}</div>
          )}
        </div>
        <div className="lg-form-group row">
          <label htmlFor="student_grade">학년</label>
          <input
            type="number"
            id="student_grade"
            name="student_grade"
            value={formData.student_grade}
            onChange={handleChange}
          />
          {errors.student_grade && (
            <div className="error-message">{errors.student_grade}</div>
          )}
        </div>
        <div className="lg-form-group row">
          <label htmlFor="student_class">반</label>
          <input
            type="number"
            id="student_class"
            name="student_class"
            value={formData.student_class}
            onChange={handleChange}
          />
          {errors.student_class && (
            <div className="error-message">{errors.student_class}</div>
          )}
        </div>
        <div className="lg-form-group row">
          <label htmlFor="student_number">번호</label>
          <input
            type="number"
            id="student_number"
            name="student_number"
            value={formData.student_number}
            onChange={handleChange}
          />
          {errors.student_number && (
            <div className="error-message">{errors.student_number}</div>
          )}
        </div>
        <div className="lg-form-group">
          <label htmlFor="teacher_email">담임 선생님 이메일</label>
          <input
            type="email"
            id="teacher_email"
            name="teacher_email"
            value={formData.teacher_email}
            onChange={handleChange}
          />
          {errors.teacher_email && (
            <div className="error-message">{errors.teacher_email}</div>
          )}
        </div>
        <div className="info-check">
          <label>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            개인정보수집 및 이용 동의
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

export default SignupStudent;
