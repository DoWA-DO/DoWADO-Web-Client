// Sidebar.jsx
import React from "react";
import "../ui/SideBar.css"; // 스타일을 별도의 CSS 파일로 분리
import {useNavigate} from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const SideBar = () => {
    const navigate = useNavigate();
    const { userType } = useAuth();
  
    return (
      <div className="sidebar">
        <div className="profile">
          <img src={`${process.env.PUBLIC_URL}/image.png`} alt="Profile" className="profile-image" />
        </div>
        {userType === 'faculty' ? (
          <>
            <span className="sidebar-link" onClick={() => navigate("/dashboardfaculty")}>홈</span>
            <span className="sidebar-link" onClick={() => navigate("/mypage")}>마이페이지</span>
            <span className="sidebar-link" onClick={() => navigate("/facultydocument")}>공문서 작성</span>
            <span className="sidebar-link" onClick={() => navigate("/studentmanagement")}>학생 관리</span>
          </>
        ) : (
          <>
            <span className="sidebar-link" onClick={() => navigate("/dashboardstudent")}>홈</span>
            <span className="sidebar-link" onClick={() => navigate("/mypage")}>마이페이지</span>
            <span className="sidebar-link" onClick={() => navigate("/chatbot")}>상담하기</span>
            <span className="sidebar-link" onClick={() => navigate("/consultationrecords")}>상담 기록 보기</span>
          </>
        )}
      </div>
    );
  };
  
  export default SideBar;