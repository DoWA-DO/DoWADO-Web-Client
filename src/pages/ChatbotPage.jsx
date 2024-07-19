import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../ui/Chatbot.css";
import { FaArrowUp, FaArrowLeft } from "react-icons/fa";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { chat_id, chat_student_email, chat_status } = location.state || {};

  useEffect(() => {
    if (chat_id && chat_student_email && chat_status !== undefined) {
      if (chat_status === 0) {
        // 완료되지 않은 채팅의 경우
        fetchChatContent(chat_id, chat_student_email);
      } else {
        createChat(chat_id, chat_student_email, chat_status);
      }
    }
  }, [chat_id, chat_student_email, chat_status]);

  const createChat = async (id, email, status) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/chat/create", // 새 채팅 생성
        {
          chat_id: id,
          chat_student_email: email,
          chat_status: status,
        }
      );
      console.log("Chat created:", response.data);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const fetchChatContent = async (id, email) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/chat/get_content`, // 완료되지 않은 상담 채팅 내용 불러옴
        {
          params: { chat_id: id, chat_student_email: email },
        }
      );
      const fetchedMessages = response.data.chat_content
        .split("\n")
        .map((msg) => {
          return {
            text: msg,
            isBot: msg.startsWith("Bot:"),
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        });
      setMessages((prevMessages) => [...prevMessages, ...fetchedMessages]);
    } catch (error) {
      console.error("Error fetching chat content:", error);
    }
  };

  const createReport = async (content) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/report/create", // 레포트 생성
        {
          chat_content: content,
        }
      );
      console.log("Report created:", response.data);
    } catch (error) {
      console.error("Error creating report:", error);
    }
  };

  const saveChatLog = async () => {
    try {
      const chatContent = messages
        .filter((msg) => !msg.isDate)
        .map((msg) => `${msg.text}`)
        .join("\n");
      await axios.post(`http://localhost:8000/api/v1/chat/upload`, {
        // 채팅 내용 저장
        chat_id,
        chat_student_email,
        chat_content: chatContent,
      });
      console.log("Chat log saved successfully");
      return chatContent;
    } catch (error) {
      console.error("Error saving chat log:", error);
      throw error; // Rethrow the error to handle it in handleCreateReport
    }
  };

  const appendChatLog = async (newMessage) => {
    try {
      await axios.post(`http://localhost:8000/api/v1/chat/update`, {
        // 원래 있던 채팅 내역에 채팅 추가
        chat_id,
        chat_student_email,
        chat_content: newMessage,
      });
      console.log("Chat log appended successfully");
    } catch (error) {
      console.error("Error appending chat log:", error);
    }
  };

  useEffect(() => {
    const dateMessage = {
      text: new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      isDate: true,
    };

    setMessages((prevMessages) => [...prevMessages, dateMessage]);
  }, []);

  useEffect(() => {
    // 새 메시지가 생성되면 밑으로 이동
    if (messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() !== "") {
      const userMessage = {
        text: input,
        isBot: false,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      // 챗 로그에 추가
      await appendChatLog(userMessage.text);

      // 챗 로그 저장
      await saveChatLog();
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

  const handleCreateReport = async () => {
    try {
      // saveChatLog 함수를 호출하여 레포트 생성 위한 컨텐츠 생성
      const chatContent = await saveChatLog();
      await createReport(chatContent);
    } catch (error) {
      console.error("Error creating report:", error);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <button
          className="back-btn"
          onClick={() => {
            navigate("/studentchat");
          }}
        >
          <FaArrowLeft size="20" />
        </button>
        <button className="report-btn" onClick={handleCreateReport}>
          레포트 보기
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
                      {msg.text}
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

export default ChatbotPage;
