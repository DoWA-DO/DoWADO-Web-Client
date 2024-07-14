import React from "react";
import ChatLog from "../components/ChatLog.jsx";
import PageLayout from "../components/PageLayout.jsx";
import "../ui/StudentChatPage.css";

const StudentChatPage = () => {
  return (
    <PageLayout>
      <div className="student-chat-title">
        <div className="sl-page-name">상담</div>
        <button>상담하기</button>
      </div>
      <div className="sl-line"></div>
      <ChatLog />
    </PageLayout>
  );
};

export default StudentChatPage;
