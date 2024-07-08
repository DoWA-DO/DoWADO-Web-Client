import React from "react";
import DashboardStudent from "../components/DashboardStudent.jsx";
import "../ui/DashboardStudent.css";
import PageLayout from "../components/PageLayout.jsx";

const DashboardStudentPage = () => {
  return (
    <PageLayout>
      <div className="dashboard">
        <DashboardStudent />
      </div>
    </PageLayout>
  );
};

export default DashboardStudentPage;
