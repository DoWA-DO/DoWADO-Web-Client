// ReportPage 컴포넌트는 학생 또는 교사가 상담 후 생성된 직업 추천 보고서를 볼 수 있도록 합니다.
// 사용자는 이전 화면으로 돌아갈 수 있으며, 보고서에는 추천된 직업군이 표시됩니다.

import React from "react";
import "../ui/Report.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const ReportPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportData } = location.state || {}; // 상담 결과 데이터를 가져옴
  const { userType } = useAuth();

  const handleBackClick = async () => {
    try {
      console.log("back click");
    } catch (error) {
      console.error("Error saving chat log on back click:", error);
    } finally {
      // 사용자 타입에 따라 다른 화면으로 이동
      if (userType === "faculty") {
        navigate("/studentlog");
      } else if (userType === "student") {
        navigate("/studentchat");
      }
    }
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <button className="back-btn" onClick={handleBackClick}>
          <FaArrowLeft size="20" />
        </button>
      </div>
      <div className="report-content">
        <div className="sentences-container">
          {/* 추천된 직업군을 화면에 표시 */}
          {reportData.prediction.map((item, index) => (
            <div key={index} className="sentences">
              ***님께 추천드리는 직업군은 <span className="job">{item}</span>
              입니다.
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
