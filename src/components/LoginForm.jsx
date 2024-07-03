import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext'; // AuthContext 사용

const LoginForm = () => {
  const [userType, setUserType] = useState('faculty'); // 기본값을 'faculty'로 설정
  const [email, setEmail] = useState(localStorage.getItem('rememberedEmail') || ''); // 로컬 저장소에서 이메일 가져오기
  const [password, setPassword] = useState('');  // Added state for password
  const [emailLabel, setEmailLabel] = useState('Email'); // Email 라벨 상태 추가
  const [errorMessage, setErrorMessage] = useState(''); // Error message 상태 추가
  const [rememberMe, setRememberMe] = useState(localStorage.getItem('rememberMe') === 'true'); // 아이디 기억하기 상태 추가
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserType: setAuthUserType } = useAuth(); // AuthContext에서 setUserType 가져오기

  useEffect(() => {
    setUserType('faculty'); // 페이지가 로드될 때 기본값으로 초기화
    const rememberedUserType = localStorage.getItem('rememberedUserType');
    if (rememberedUserType) {
      setUserType(rememberedUserType);
      if (rememberedUserType === 'student') {
        setEmailLabel('ID');
      } else {
        setEmailLabel('E-mail');
      }
    }
  }, [location.pathname]);

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    if (e.target.value === 'student') {
      setEmailLabel('ID'); // 학생일 때 라벨을 'ID'로 변경
    } else {
      setEmailLabel('E-mail'); // 교직원일 때 라벨을 'E-mail'로 변경
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);
    if (isChecked) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberedUserType', userType);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedUserType');
      localStorage.removeItem('rememberMe');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
        userType,
      });

      if (response.status === 200) {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedUserType', userType);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedUserType');
          localStorage.removeItem('rememberMe');
        }

        setAuthUserType(userType); // AuthContext에 사용자 유형 설정

        if (userType === 'faculty') {
          navigate('/dashboardfaculty');
        } else if (userType === 'student') {
          navigate('/dashboardstudent');
        }
      }
    } catch (error) {
      setPassword(''); // 비밀번호 입력 칸 비우기
      setErrorMessage('아이디와 비밀번호를 확인해주세요!'); // 로그인 실패 시 에러 메시지 설정
      console.error('Login failed', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="user-type-group">
          <label>
            <input
              type="radio"
              value="faculty"
              checked={userType === 'faculty'}
              onChange={handleUserTypeChange}
            />
            교직원
          </label>
          <label>
            <input
              type="radio"
              value="student"
              checked={userType === 'student'}
              onChange={handleUserTypeChange}
            />
            학생
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="email">{emailLabel}</label>
          <input type="email" id="email" name="email" value={email} onChange={handleEmailChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <div className="user-type-group">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            아이디 기억하기
          </label>
        </div>
        <button type="submit" className="login-button">Login</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* 경고 메시지 표시 */}
        <div className={`signup-link ${userType === 'student' ? 'hidden' : ''}`}>
          처음이신가요? <a href="/signup">회원가입</a>
        </div>
        <div className="findpassword-link">
          <a href="/findpassword">비밀번호 찾기</a>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
