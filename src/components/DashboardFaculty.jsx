import React from "react";
import { useNavigate } from "react-router-dom";
import "../ui/DashboardFaculty.css";

const Feature1 = () => {
  const navigate = useNavigate();
  return (
    <div className="feature feature1">
      <div className="content">
        <h2>공문서 작성을 쉽고 간편하게</h2>
        <button
          className="action-button"
          onClick={() => navigate("/facultydocument")}
        >
          바로가기
        </button>
      </div>
      <img
        src={`${process.env.PUBLIC_URL}/image.webp`}
        alt="Dynamic Typing Background"
        className="background-image"
      />
    </div>
  );
};

const Feature2 = () => {
  const navigate = useNavigate();
  return (
    <div className="feature feature2">
      <div className="feature2-header">
        <a className="logout-link" onClick={() => navigate("/")}>
          로그아웃
        </a>
      </div>
      <h2>학생 관리</h2>
      <button
        className="action-button"
        onClick={() => navigate("/studentmanagement")}
      >
        바로가기
      </button>
    </div>
  );
};

const DashboardFaculty = () => {
  return (
    <div className="dashboard-faculty">
      {/* <TopBar /> */}
      <div className="main-content">
        {/* <SideBar /> */}
        <div className="content">{/* 여기에 메인 컨텐츠를 추가 */}</div>
      </div>
    </div>
  );
};

export default DashboardFaculty;
