import React from "react";
import SignupForm from "../components/SignupForm";
import "../ui/Login.css";

const SignupPage = () => {
  return (
    <div className="container">
      <div className="rectangle-2">
        <h1>DoWA:DO</h1>
      </div>
      <div className="rectangle-1">
        <h2>회원가입</h2>
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
