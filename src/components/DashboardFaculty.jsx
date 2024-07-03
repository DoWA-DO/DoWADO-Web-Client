import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import SideBar from './SideBar';
import '../ui/DashboardFaculty.css';

const DashboardFaculty = () => {
  return (
    <div className="dashboard-faculty">
      <TopBar />
      <div className="main-content">
        <SideBar />
        <div className="content">
          {/* 여기에 메인 컨텐츠를 추가 */}
        </div>
      </div>
    </div>
  );
};

export default DashboardFaculty;