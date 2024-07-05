import React from "react";
import "../ui/FormContainer.css"; // 스타일을 별도의 CSS 파일로 분리

const FormContainer = ({ children }) => {
  return <div className="form-container">{children}</div>;
};

export default FormContainer;