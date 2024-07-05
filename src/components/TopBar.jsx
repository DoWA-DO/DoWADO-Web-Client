import React from "react";
import "../ui/TopBar.css"; // 스타일을 별도의 CSS 파일로 분리
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const TopBar = () => {
  const navigate = useNavigate();
  const { userType } = useAuth(); // 학생, 교직원에 따라 사이드바 나눠서 출력
  
  return (
    <div className="top-bar">
      <div className="top-logo-container">
        <img
          src={`${process.env.PUBLIC_URL}/DoWADo_logo.png`}
          alt="Logo"
          className="top-logo"
        />
      </div>
      <div className="topbar-links">
        {userType === "faculty" ? (
          <>
            <div
              className="topbar-link"
              onClick={() => navigate("/dashboardfaculty")}
            >
              홈
            </div>
            <div className="topbar-link" onClick={() => navigate("/mypage")}>
              마이페이지
            </div>
            <div
              className="topbar-link"
              onClick={() => navigate("/facultydocument")}
            >
              공문서 작성
            </div>
            <div
              className="topbar-link"
              onClick={() => navigate("/studentmanagement")}
            >
              학생 관리
            </div>
          </>
        ) : (
          <>
            <div
              className="topbar-link"
              onClick={() => navigate("/dashboardstudent")}
            >
              홈
            </div>
            <div className="topbar-link" onClick={() => navigate("/mypage")}>
              마이페이지
            </div>
            <div className="topbar-link" onClick={() => navigate("/chatbot")}>
              상담하기
            </div>
            <div
              className="topbar-link"
              onClick={() => navigate("/consultationrecords")}
            >
              상담 기록 보기
            </div>
          </>
        )}
      </div>
      <div className="top-right-container">
        <div className="profile" onClick={() => navigate("/mypage")}>
          <img
            src={`${process.env.PUBLIC_URL}/profile.png`}
            alt="Profile"
            className="profile-img"
          />
        </div>
        <button className="checkout" onClick={() => navigate("/")}>
          로그아웃
          <img
            src={`${process.env.PUBLIC_URL}/logout.png`}
            alt="logout-img"
            className="logout-img"
          />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
