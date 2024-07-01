import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ui/style.css';
import LoginForm from '../components/LoginForm';


const LoginPage = () => {
  return (
    <div className="container">
      <div className="rectangle-2">
        <h1>ALLIDO</h1>
      </div>
      <div className="rectangle-1">
        <h2>Sign-in</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
