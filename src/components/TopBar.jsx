// TopBar.jsx
import React from "react";
import "../ui/TopBar.css"; // 스타일을 별도의 CSS 파일로 분리
import { useNavigate } from "react-router-dom";

const TopBar = () => {
    const navigate = useNavigate();
    return (
      <div className="top-bar">
        <div className="left-content">
          <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="logo" />
          <span className="greeting"> OOO님, 오늘도 화이팅하세요!</span>
        </div>
        <span className="checkout" onClick={() => navigate("/")} >로그아웃</span>
      </div>
    );
  };
  
  export default TopBar;