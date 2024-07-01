import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FindPassword = () => {
    const [email, setEmail] = useState('');
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // 여기에 비밀번호 찾기 로직을 추가하세요
      console.log('비밀번호 찾기 요청:', email);
    };
  
    return (
      <div className="find-password-container">
        <h2>비밀번호 찾기</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <button type="submit" className="find-password-button">비밀번호 찾기</button>
        </form>
      </div>
    );
  };
  
  export default FindPassword;