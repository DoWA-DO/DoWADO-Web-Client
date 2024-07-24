import React from "react";
import "../ui/Report.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const ReportPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportData } = location.state || {};
  const { userType } = useAuth();

  const handleBackClick = async () => {
    try {
      console.log("back click");
    } catch (error) {
      console.error("Error saving chat log on back click:", error);
    } finally {
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
