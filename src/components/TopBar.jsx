import React, { useState, useEffect } from "react";
import "../ui/TopBar.css"; // 별도의 CSS 파일로 스타일링
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { IoPersonCircleOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";

const TopBar = () => {
  const navigate = useNavigate();
  const { userType: authUserType } = useAuth();
  const [isMobile, setIsMobile] = useState(false); // 모바일 여부 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 메뉴 상태 관리

  const userType = authUserType || "student"; /// 삭제 예정

  // 화면 너비가 768px 이하일 때 모바일로 판단
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // 컴포넌트가 마운트될 때 초기 체크
    window.addEventListener("resize", handleResize); // 리사이즈 이벤트 감지

    return () => {
      window.removeEventListener("resize", handleResize); // 컴포넌트 언마운트 시 이벤트 제거
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="top-bar">
      <div className="top-logo-container">
        <img
          src={`${process.env.PUBLIC_URL}/DoWADo_logo.png`}
          alt="Logo"
          className="top-logo"
        />
      </div>
      <div className={`topbar-links ${isMenuOpen ? "open" : ""}`}>
        {userType === "faculty" ? (
          <>
            <div
              className="topbar-link"
              onClick={() => {
                navigate("/dashboardfaculty");
                setIsMenuOpen(false);
              }}
            >
              홈
            </div>
            <div
              className="topbar-link"
              onClick={() => {
                navigate("/mypage");
                setIsMenuOpen(false);
              }}
            >
              마이페이지
            </div>
            <div
              className="topbar-link"
              onClick={() => {
                navigate("/studentlog");
                setIsMenuOpen(false);
              }}
            >
              학생 상담 기록
            </div>
            <div
              className="topbar-link"
              onClick={() => {
                navigate("/studentmanagement");
                setIsMenuOpen(false);
              }}
            >
              학생 관리
            </div>
          </>
        ) : (
          <>
            <div
              className="topbar-link"
              onClick={() => {
                navigate("/dashboardstudent");
                setIsMenuOpen(false);
              }}
            >
              홈
            </div>
            <div
              className="topbar-link"
              onClick={() => {
                navigate("/mypage");
                setIsMenuOpen(false);
              }}
            >
              마이페이지
            </div>
            <div
              className="topbar-link"
              onClick={() => {
                navigate("/chatbot");
                setIsMenuOpen(false);
              }}
            >
              상담하기
            </div>
            <div
              className="topbar-link"
              onClick={() => {
                navigate("/consultationrecords");
                setIsMenuOpen(false);
              }}
            >
              상담 기록 보기
            </div>
          </>
        )}
        {isMobile && ( // 모바일일 때만 표시되는 로그아웃 버튼
          <button
            className="checkout"
            onClick={() => {
              navigate("/");
              setIsMenuOpen(false);
            }}
          >
            로그아웃
            <AiOutlineLogout className="logout-img" />
          </button>
        )}
      </div>
      {!isMobile && ( // 모바일이 아닐 때만 표시되는 프로필과 로그아웃 버튼
        <div className="top-right-container">
          <IoPersonCircleOutline className="profile" />
          <button
            className="checkout"
            onClick={() => {
              navigate("/");
              setIsMenuOpen(false);
            }}
          >
            로그아웃
            <AiOutlineLogout className="logout-img" />
          </button>
        </div>
      )}
      <div className="hamburger-menu" onClick={toggleMenu}>
        ☰
      </div>
    </div>
  );
};

export default TopBar;
