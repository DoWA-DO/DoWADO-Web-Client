import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/Login.css";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="container">
      <div className="container">
        <div className="rectangle-2">
          <h1>DoWA:DO</h1>
        </div>
        <div className="rectangle-1">
          <h2>로그인</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
