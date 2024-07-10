import React, { useState, useEffect, useRef } from "react";
import "../ui/Chatbot.css";
import PageLayout from "../components/PageLayout.jsx";
import { PulseLoader } from "react-spinners";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initialMessage = {
      text: `안녕하세요! 도와도입니다.
도와도와 함께 진로상담을 시작해 보세요!`,
      isBot: true,
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() !== "") {
      const userMessage = { text: input, isBot: false };
      setMessages([...messages, userMessage]);
      setInput("");

      // 봇 응답 시뮬레이션
      setTimeout(() => {
        const botMessage = {
          text: getChatbotMessageText(),
          isBot: true,
          loading: true,
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <PageLayout>
      <div className="chatbot-container">
        <div className="chatbot-header">챗봇</div>
        <div className="chatbot-messages">
          <div className="chatbot-messages-wrapper">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.isBot ? "bot" : "user"}`}
              >
                <div className="text" style={{ whiteSpace: "pre-wrap" }}>
                  {msg.isBot && msg.loading ? (
                    <PulseLoader color="white" size="10px" />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        </div>
        <div className="chatbot-input-container">
          <input
            type="text"
            className="chatbot-input"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button className="chatbot-send-button" onClick={handleSendMessage}>
            보내기
          </button>
        </div>
      </div>
    </PageLayout>
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
