import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

  const LoginForm = () => {

    const navigate = useNavigate();

    const handleSignupClick = () => {
      navigate('/signup');
    };
    
    return (
      <form>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        
        <button type="submit" className="login-button">Login</button>
        <div className="signup-link">
          Don't have an account? <a href="/signup">Signup Here</a>
        </div>
      </form>
    );
  };
  
  export default LoginForm;