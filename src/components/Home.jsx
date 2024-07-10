import React, { useState, useEffect, useRef } from "react";
import "../ui/Home.css";
import { useNavigate } from "react-router-dom";
import { BsChevronCompactDown } from "react-icons/bs";

const Home = () => {
  const navigate = useNavigate();
  const DIVIDER_HEIGHT = 5;
  const outerDivRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [content, setContent] = useState(""); // typing animation을 위한 상태 추가

  useEffect(() => {
    const writeText = (text) => {
      let lines = text.split("\n");
      let currentLine = 0;
      let currentText = "";

      const interval = setInterval(() => {
        if (currentLine < lines.length) {
          currentText += lines[currentLine].charAt(0);
          setContent(currentText);
          lines[currentLine] = lines[currentLine].substring(1);
          if (lines[currentLine].length === 0) {
            currentLine++;
            currentText += "\n"; // 줄바꿈 추가
          }
        } else {
          clearInterval(interval);
        }
      }, 80);

      return () => clearInterval(interval);
    };

    writeText(`
도와도 설명
상담 도우미
선생님 돕다`);
  }, []);

  const handleClick = () => {
    navigate("/login");
  };

  useEffect(() => {
    const wheelHandler = (e) => {
      e.preventDefault();
      const { deltaY } = e;
      const { scrollTop } = outerDivRef.current; // 스크롤 위쪽 끝부분 위치
      const pageHeight = window.innerHeight; // 화면 세로길이, 100vh와 같습니다.

      if (deltaY > 0) {
        // 스크롤 내릴 때
        if (scrollTop >= 0 && scrollTop < pageHeight) {
          console.log("현재 1페이지, down");
          outerDivRef.current.scrollTo({
            top: pageHeight + DIVIDER_HEIGHT,
            left: 0,
            behavior: "smooth",
          });
          setCurrentPage(2);
        } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 2) {
          console.log("현재 2페이지, down");
          outerDivRef.current.scrollTo({
            top: pageHeight * 2 + DIVIDER_HEIGHT * 2,
            left: 0,
            behavior: "smooth",
          });
          setCurrentPage(3);
        } else {
          console.log("현재 3페이지, down");
          outerDivRef.current.scrollTo({
            top: pageHeight * 2 + DIVIDER_HEIGHT * 2,
            left: 0,
            behavior: "smooth",
          });
        }
      } else {
        // 스크롤 올릴 때
        if (scrollTop >= 0 && scrollTop < pageHeight) {
          console.log("현재 1페이지, up");
          outerDivRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 2) {
          console.log("현재 2페이지, up");
          outerDivRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          setCurrentPage(1);
        } else {
          console.log("현재 3페이지, up");
          outerDivRef.current.scrollTo({
            top: pageHeight + DIVIDER_HEIGHT,
            left: 0,
            behavior: "smooth",
          });
          setCurrentPage(2);
        }
      }
    };

    const outerDivRefCurrent = outerDivRef.current;
    outerDivRefCurrent.addEventListener("wheel", wheelHandler);
    return () => {
      outerDivRefCurrent.removeEventListener("wheel", wheelHandler);
    };
  }, []);

  return (
    <div ref={outerDivRef} className="outer">
      <div className="inner home-1">
        <div className="home-logo-container">
          <img
            src={`${process.env.PUBLIC_URL}/DoWADo_logo.png`}
            alt="Logo"
            className="home-logo"
          />
        </div>
        <div className="home-content-container">
          <h2 className="home-title">DoWA:DO</h2>
          <div className="home-content">{content}|</div>
          <BsChevronCompactDown className="blinking-cursor" />
        </div>
      </div>
      <div className="divider"></div>
      <div className="inner home-2"></div>
      <div className="divider"></div>
      <div className="inner home-3">
        <button className="start-btn" onClick={handleClick}>
          시작하기
        </button>
      </div>
    </div>
  );
};

export default Home;
