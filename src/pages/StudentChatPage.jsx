import React from "react";
import ChatLog from "../components/ChatLog.jsx";
import PageLayout from "../components/PageLayout.jsx";
import "../ui/StudentChatPage.css";
import { useNavigate } from "react-router-dom";

const StudentChatPage = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="chat-title">
        <div className="chat-page-name">상담 기록</div>
        <button className="chat-btn" onClick={() => navigate("/chatbot")}>
          상담하기
        </button>
      </div>
      <div className="chat-line"></div>
      <ChatLog />
    </PageLayout>
  );
};

export default StudentChatPage;
