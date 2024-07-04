import React from "react";
import SignupForm from "../components/SignupForm";
import FindPassword from "../components/FindPassword";

const FindPasswordPage = () => {
  return (
    <div className="lg-bg-container">
      <div className="lg-container">
        <div className="lg-logo">
          <h1>DoWA:DO</h1>
        </div>
        <div className="lg-form">
          <FindPassword />
        </div>
      </div>
    </div>
  );
};

export default FindPasswordPage;
