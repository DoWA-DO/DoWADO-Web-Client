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
        <h1>진로 추천 보고서</h1>
      </div>

      <div className="report-content">
        {/* 추천된 직업군 */}
        <div className="section">
          <h2>추천 직업군</h2>
          <p className="job-title">{reportData.prediction}</p>
        </div>

        {/* 연관 직업 */}
        <div className="section">
          <h2>연관 직업</h2>
          {reportData.relatedJobs?.map((job, index) => (
            <div key={index} className="related-job">
              <p className="job-title">{job.title}</p>
              <p className="job-info">{job.info}</p>
            </div>
          ))}
        </div>

        {/* 연관 전공 */}
        <div className="section">
          <h2>연관 전공</h2>
          {reportData.relatedMajors?.map((major, index) => (
            <div key={index} className="related-major">
              <p className="major-title">{major.major}</p>
              <p className="major-info">{major.info}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
