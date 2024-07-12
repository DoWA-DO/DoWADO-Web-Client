import React from "react";

const UserTypeSelector = ({ userType, onChange }) => {
  return (
    <div className="user-type-group">
      <label>
        <input
          type="radio"
          value="faculty"
          checked={userType === "faculty"}
          onChange={onChange}
        />
        교직원
      </label>
      <label>
        <input
          type="radio"
          value="student"
          checked={userType === "student"}
          onChange={onChange}
        />
        학생
      </label>
    </div>
  );
};

export default UserTypeSelector;
