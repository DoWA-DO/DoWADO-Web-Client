import React from "react";
import StudentLog from "../components/Studentlog.jsx";
import PageLayout from "../components/PageLayout.jsx";
import "../ui/StudentLog.css";

const StudentLogPage = () => {
  return (
    <PageLayout>
      <div className="sl-page-name">학생 상담 기록</div>
      <div className="sl-line"></div>
      <StudentLog />
    </PageLayout>
  );
};

export default StudentLogPage;
