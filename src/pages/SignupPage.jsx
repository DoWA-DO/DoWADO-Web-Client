import React, { useState } from "react";
import UserTypeSelector from "../components/UserTypeSelector";
import SignupFaculty from "../components/SignupFaculty";
import SignupStudent from "../components/SignupStudent";

const SignupPage = () => {
  const [userType, setUserType] = useState("faculty");

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  return (
    <div className="lg-container">
      <div className="lg-form">
        <h2>회원가입</h2>
        <UserTypeSelector userType={userType} onChange={handleUserTypeChange} />
        {userType === "faculty" && <SignupFaculty />}
        {userType === "student" && <SignupStudent />}
      </div>
    </div>
  );
};

export default SignupPage;
