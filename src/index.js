import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
// import "./ui/style.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/* 페이지 */
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import FindPasswordPage from "./pages/FindPasswordPage";
import DashboardStudentPage from "./pages/DashboadStudentPage";
import DashboardFacultyPage from "./pages/DashboardFacultyPage";
import FacultyDocumentPage from "./pages/FacultyDocumentPage";
import StudentManagementPage from "./pages/StudentManagementPage";
import MainPage from "./pages/MainPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/findpassword" element={<FindPasswordPage />} />
        <Route path="/dashboardstudent" element={<DashboardStudentPage />} />
        <Route path="/dashboardfaculty" element={<DashboardFacultyPage />} />
        <Route path="/facultydocument" element={<FacultyDocumentPage />} />
        <Route path="/studentmanagement" element={<StudentManagementPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
