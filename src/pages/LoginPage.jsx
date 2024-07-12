import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/Login.css";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="lg-container">
      <div className="lg-form">
        <h2>로그인</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
