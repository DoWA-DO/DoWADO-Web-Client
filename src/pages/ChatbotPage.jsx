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

  useEffect(() => {
    const initialMessage = {
      text: `안녕하세요! 도와도입니다.
도와도와 함께 진로상담을 시작해 보세요!`,
      isBot: true,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const dateMessage = {
      text: new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      isDate: true,
    };

    setMessages([dateMessage, initialMessage]);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() !== "") {
      const userMessage = {
        text: input,
        isBot: false,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, userMessage]);
      setInput("");

      // 봇 응답 시뮬레이션
      setTimeout(() => {
        const botMessage = {
          text: getChatbotMessageText(),
          isBot: true,
          loading: true,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);

        setTimeout(() => {
          const updatedMessage = { ...botMessage, loading: false };
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg === botMessage ? updatedMessage : msg
            )
          );
        });
      });
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <button className="back-btn" onClick={() => navigate("/studentchat")}>
          <FaArrowLeft size="20" />
        </button>
        <button className="report-btn">레포트 보기</button>
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
      <div className="chatbot-input-container">
        <textarea
          type="text"
          className="chatbot-input"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows="1"
        />
        <button className="chatbot-send-button" onClick={handleSendMessage}>
          <FaArrowUp />
        </button>
      </div>
    </div>
  );
};

const getChatbotMessageText = () => {
  const responses = [
    "어떻게 도와드릴까요?",
    "좀 더 설명해 주시겠어요?",
    "도움이 필요하시면 말씀해 주세요.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

export default ChatbotPage;
