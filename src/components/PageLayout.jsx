import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { IoPersonCircleOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
import "../ui/PageLayout.css";
import InfoCheck from "./InfoCheckModal";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";

const PageLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로를 가져옴
  const { userType: authUserType } = useAuth();
  const [isMobile, setIsMobile] = useState(false); // 모바일 여부 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 메뉴 상태 관리
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const userType = authUserType || "student"; // 삭제 예정

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent("");
  };

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

  // 현재 경로와 일치하는 링크에 active 클래스를 추가하는 함수
  const getLinkClass = (path) => {
    return location.pathname === path ? "topbar-link active" : "topbar-link";
  };

  return (
    <div className="page-layout">
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
                className={getLinkClass("/dashboardfaculty")}
                onClick={() => {
                  navigate("/dashboardfaculty");
                  setIsMenuOpen(false);
                }}
              >
                홈
              </div>
              <div
                className={getLinkClass("/studentlog")}
                onClick={() => {
                  navigate("/studentlog");
                  setIsMenuOpen(false);
                }}
              >
                학생 상담 기록
              </div>
              <div
                className={getLinkClass("/mypagefaculty")}
                onClick={() => {
                  navigate("/mypagefaculty");
                  setIsMenuOpen(false);
                }}
              >
                마이페이지
              </div>
            </>
          ) : (
            <>
              <div
                className={getLinkClass("/dashboardstudent")}
                onClick={() => {
                  navigate("/dashboardstudent");
                  setIsMenuOpen(false);
                }}
              >
                홈
              </div>
              <div
                className={getLinkClass("/studentChat")}
                onClick={() => {
                  navigate("/studentChat");
                  setIsMenuOpen(false);
                }}
              >
                상담하기
              </div>
              <div
                className={getLinkClass("/mypagestudent")}
                onClick={() => {
                  navigate("/mypagestudent");
                  setIsMenuOpen(false);
                }}
              >
                마이페이지
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
            {/* <IoPersonCircleOutline className="profile" /> */}
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
          {isMenuOpen ? <IoClose /> : <RxHamburgerMenu />}
        </div>
      </div>
      <div className="page-content">{children}</div>
      <footer className="footer">
        <div className="footer-content">
          <a href="#" onClick={() => openModal("policy")}>
            개인정보 처리방침
          </a>
          <a href="#" onClick={() => openModal("terms")}>
            이용약관
          </a>
          <p>© 2024 DoWA:Do. All rights reserved.</p>
        </div>
      </footer>

      <InfoCheck
        isOpen={modalOpen}
        closeModal={closeModal}
        content={modalContent}
      />
    </div>
  );
};

export default PageLayout;
