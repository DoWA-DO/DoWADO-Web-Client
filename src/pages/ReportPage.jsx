import React, { useEffect, useState } from "react";
import axios from "axios";
import "../ui/Report.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const ReportPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { chat_id, chat_student_email, report_id } = location.state || {};
  const [reportContent, setReportContent] = useState("");

  useEffect(() => {
    if (report_id) {
      fetchReportContent(report_id);
    }
  }, [report_id]);

  const fetchReportContent = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/report/content`, // 레포트 내용 호출
        {
          params: { report_id: id },
        }
      );
      setReportContent(response.data.report_content);
    } catch (error) {
      console.error("Error fetching report content:", error);
    }
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <button className="back-btn" onClick={() => navigate("/studentchat")}>
          <FaArrowLeft size="20" />
        </button>
      </div>
      <div className="report-content">
        {reportContent ? (
          <pre>{reportContent}</pre>
        ) : (
          <p>레포트 내용을 불러오는 중...</p>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
