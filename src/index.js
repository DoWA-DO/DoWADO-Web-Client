import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
// import "./ui/style.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext"; // AuthProvider 추가

/* 페이지 */
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import FindPasswordPage from "./pages/FindPasswordPage";
import DashboardStudentPage from "./pages/DashboardStudentPage";
import DashboardFacultyPage from "./pages/DashboardFacultyPage";
import ChatbotPage from "./pages/ChatbotPage";
import Mypage from "./pages/Mypage";
import HomePage from "./pages/HomePage";
import StudentLogPage from "./pages/StudentLogPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      {" "}
      {/* AuthProvider를 추가하여 컨텍스트를 제공 */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/findpassword" element={<FindPasswordPage />} />
          <Route path="/dashboardstudent" element={<DashboardStudentPage />} />
          <Route path="/dashboardfaculty" element={<DashboardFacultyPage />} />
          <Route path="/studentlog" element={<StudentLogPage />} />
          <Route path="/studentlog/:id" element={<StudentLogPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/mypage" element={<Mypage />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
