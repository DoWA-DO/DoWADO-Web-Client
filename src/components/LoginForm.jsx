import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate, useLocation } from 'react-router-dom';

Modal.setAppElement('#root'); // 접근성을 위해 루트 엘리먼트를 설정합니다.

const LoginForm = () => {
  const [userType, setUserType] = useState('faculty'); // 기본값을 'faculty'로 설정
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [email, setEmail] = useState('');
  const location = useLocation();

  useEffect(() => {
    setUserType('faculty'); // 페이지가 로드될 때 기본값으로 초기화
  }, [location.pathname]); // location.pathname이 변경될 때마다 실행

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const openModal = () => {
    setModalIsOpen(true);
    setVerificationRequested(false); // 모달을 열 때 인증 요청 상태를 초기화
    setEmail(''); // 모달을 열 때 이메일 입력 필드를 빈칸으로 설정
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setVerificationRequested(false);
  };

  const handleSendVerificationCode = (e) => {
    e.preventDefault();
    setVerificationRequested(true);
    setTimer(180); // 3분 타이머 시작
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    let countdown;
    if (verificationRequested && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [verificationRequested, timer]);

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
          <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" className="login-button">Login</button>
        <div className="signup-link">
          처음이신가요? {userType === 'student' ? <a href="/signup">회원가입</a> : <button type="button" onClick={openModal} className="link-button">이메일 인증</button>}
        </div>
        <div className="findpassword-link">
          <a href="/findpassword">비밀번호 찾기</a>
        </div>
      </form>

      {/* 이메일 인증 모달 */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Email Verification"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>이메일 인증</h2>
        {!verificationRequested ? (
          <form onSubmit={handleSendVerificationCode}>
            <div className="form-group">
              <label htmlFor="verification-email">Email</label>
              <input type="email" id="verification-email" name="verification-email" value={email} onChange={handleEmailChange} required />
            </div>
            <button type="submit" className="verification-button">인증 메일 보내기</button>
          </form>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="verification-email">Email</label>
              <input type="email" id="verification-email" name="verification-email" value={email} onChange={handleEmailChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="verification-code">인증번호</label>
              <div className="input-container">
                <input type="text" id="verification-code" name="verification-code" required />
                <span className="timer">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
            <button className="verification-button">확인</button>
          </>
        )}
        <button onClick={closeModal} className="close-button">닫기</button>
      </Modal>
    </>
  );
};

export default LoginForm;
