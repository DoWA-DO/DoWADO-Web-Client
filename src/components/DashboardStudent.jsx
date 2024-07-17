import React from "react";
import { useNavigate } from "react-router-dom";
import "../ui/DashboardStudent.css";

const DashboardStudent = () => {
    const navigate = useNavigate();
    
    return (
        <div className="dashboard-faculty">
          <div className="main-content">
            <div className="content">
              {/* 여기에 메인 컨텐츠를 추가 */}
            </div>
          </div>
        </div>
      );
  };

export default DashboardStudent;
