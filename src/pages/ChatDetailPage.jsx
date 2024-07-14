import React, { useState, useEffect, useRef } from "react";
import "../ui/Chatbot.css";
import { PulseLoader } from "react-spinners";
import { FaArrowUp, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <button className="back-btn" onClick={() => navigate("/studentchat")}>
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
              {msg.isDate ? (
                <div className="date-message">{msg.text}</div>
              ) : (
                <>
                  <div className={`message ${msg.isBot ? "bot" : "user"}`}>
                    <div className="text" style={{ whiteSpace: "pre-wrap" }}>
                      {msg.isBot && msg.loading ? (
                        <PulseLoader color="white" size="10px" />
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                  <div
                    className={`time ${msg.isBot ? "bot-time" : "user-time"}`}
                  >
                    {msg.time}
                  </div>
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
