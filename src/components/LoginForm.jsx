import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginForm = () => {
  const [userType, setUserType] = useState('faculty'); // 기본값을 'faculty'로 설정
  const [email, setEmail] = useState('');
  const location = useLocation();

  useEffect(() => {
    setUserType('faculty'); // 페이지가 로드될 때 기본값으로 초기화
  }, [location.pathname]); // location.pathname이 변경될 때마다 실행

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <form>
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
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={email} onChange={handleEmailChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" className="login-button">Login</button>
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
