import React from "react";
import SignupForm from "../components/SignupForm";
import "../ui/Login.css";

const SignupPage = () => {
  return (
    <div className="lg-bg-container">
      <div className="lg-container">
        <div className="lg-logo">
          <h1>DoWA:DO</h1>
        </div>
        <div className="lg-form">
          <h2>회원가입</h2>
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
