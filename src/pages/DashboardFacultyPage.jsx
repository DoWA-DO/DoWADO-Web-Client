import React from "react";
import DashboardFaculty from "../components/DashboardFaculty.jsx";
import "../ui/DashboardFaculty.css";
import PageLayout from "../components/PageLayout.jsx";

const DashboardFacultyPage = () => {
  return (
    <PageLayout>
      <div className="dashboard">
        <DashboardFaculty />
      </div>
    </PageLayout>
  );
};

export default DashboardFacultyPage;
