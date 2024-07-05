import React from "react";
import TopBar from "./TopBar";
import FormContainer from "./FormContainer";
import "../ui/PageLayout.css"; // 스타일을 별도의 CSS 파일로 분리

const PageLayout = ({ children }) => {
  return (
    <div className="page-layout">
      <TopBar />
      <FormContainer>{children}</FormContainer>
    </div>
  );
};

export default PageLayout;
