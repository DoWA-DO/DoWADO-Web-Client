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
