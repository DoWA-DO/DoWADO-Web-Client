import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../ui/DashboardFaculty.css';

const Feature1 = () => {
    const navigate = useNavigate();
    return (
      <div>
        <h2>공문서 작성을 쉽고 간편하게</h2>
        <button className="action-button" onClick={() => navigate('/facultydocument')}>바로가기</button>
      </div>
    );
  };
  
  const Feature2 = () => {
    const navigate = useNavigate();
    return (
      <div>
        <h2>학생 관리</h2>
        <button className="action-button" onClick={() => navigate('/studentmanagement')}>바로가기</button>
      </div>
    );
  };

const Dashboard_Faculty = () => {
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

export default Dashboard_Faculty;
