import React from "react";
import "../ui/DashboardStudent.css";
import { useNavigate } from "react-router-dom";

const Feature1 = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        className="button button--winona button--border-thick button--round-l button--text-upper button--size-s button--text-thick"
        data-text="상담하기"
        onClick={() => navigate("/consulationChatbot")}
      >
      </button>
      <h2>상담을 해보세요!</h2>
    </div>
  );
};

const Feature2 = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        className="button button--winona button--border-thick button--round-l button--text-upper button--size-s button--text-thick"
        data-text="상담 기록 보기"
        onClick={() => navigate("/studentChatbotLog")}
      >
      </button>
      <h2>이전에 했던 상담 기록을 확인해 보세요!</h2>
    </div>
  );
};

const Dashboard_student = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform any logout logic here
    navigate('/');
  };
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <a className="logout-link" onClick={handleLogout}>로그아웃</a>
      </div>
      <div className="dashboard-content">
        <div className="feature feature1">
          <Feature1 />
        </div>
        <div className="feature feature2">
          <Feature2 />
        </div>
      </div>
    </div>
  );
};
  
export default Dashboard_student;

