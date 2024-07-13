import React from "react";
import TopBar from "./TopBar";
import "../ui/PageLayout.css";

const PageLayout = ({ children }) => {
  return (
    <div className="page-layout">
      <TopBar />
      <div className="page-content">
        <div className="form-container">{children}</div>
      </div>
    </div>
  );
};

export default PageLayout;
