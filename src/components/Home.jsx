import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(""); // 타이핑 애니메이션을 위한 상태 추가

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
도와도와 함께 진로 상담을 해보세요!`);
  }, []);

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="inner">
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
          <button className="start-btn" onClick={handleClick}>
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
