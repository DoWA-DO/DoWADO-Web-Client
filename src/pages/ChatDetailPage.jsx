// 이 파일은 ChatbotPage 컴포넌트로, 사용자가 과거 챗봇과의 대화 내용을 확인할 수 있는 인터페이스를 제공합니다.
// 이 컴포넌트는 주어진 chat_id와 chat_student_email, chat_status를 기반으로 서버에서 대화 기록을 가져와서 화면에 표시합니다.
// 사용자는 이전 화면으로 돌아갈 수 있으며, 사용자 유형에 따라 다른 페이지로 리디렉션됩니다.

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../ui/Chatbot.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = useAuth();

  const { chat_id, chat_student_email, chat_status } = location.state || {};

  useEffect(() => {
    if ((chat_id && chat_student_email, chat_status)) {
      fetchChatContent(chat_id, chat_student_email, chat_status);
    }
  }, [chat_id, chat_student_email, chat_status]);

  const fetchChatContent = async (id, email, status) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/chat/content`, // 완료 채팅 기록 호출
        {
          params: {
            chat_id: id,
            chat_student_email: email,
            chat_status: status,
          },
        }
      );
      const fetchedMessages = response.data.chat_content
        .split("\n")
        .map((msg) => {
          // 봇과 사용자 분리
          const isBot = msg.startsWith("Bot:");
          return {
            text: msg,
            isBot,
          };
        });
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching chat content:", error);
    }
  };

  const handleBackClick = () => {
    // 사용자에 따른 뒤로가기
    if (userType === "faculty") {
      navigate("/studentlog");
    } else if (userType === "student") {
      navigate("/studentchat");
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <button className="back-btn" onClick={handleBackClick}>
          <FaArrowLeft size="20" />
        </button>
      </div>
      <div className="chatbot-messages">
        <div className="chatbot-messages-wrapper">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-wrapper ${msg.isBot ? "bot" : "user"}`}
            >
              <div className={`message ${msg.isBot ? "bot" : "user"}`}>
                <div className="text" style={{ whiteSpace: "pre-wrap" }}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
