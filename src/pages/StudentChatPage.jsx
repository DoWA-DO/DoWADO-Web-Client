import React from "react";
import ChatLogStudent from "../components/ChatLogStudent.jsx";
import PageLayout from "../components/PageLayout.jsx";
import "../ui/StudentChatPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const StudentChatPage = () => {
  const navigate = useNavigate();
  const { userEmail } = useAuth();

  const handleStartChat = (chat_id, chat_student_email, chat_status) => {
    // 챗봇 페이지로 이동
    navigate("/chatbot", {
      state: {
        chat_id,
        chat_student_email,
        chat_status,
      },
    });
  };

  return (
    <PageLayout>
      <div className="chat-title">
        <div className="chat-page-name">상담 기록</div>
        <button
          className="chat-btn"
          onClick={() => handleStartChat(1, userEmail, 0)} // chat_id: 임의
        >
          상담하기
        </button>
      </div>
      <div className="chat-line"></div>
      <ChatLogStudent />
    </PageLayout>
  );
};

export default StudentChatPage;
