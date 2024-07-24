import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../ui/Chatbot.css";
import { FaArrowUp, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../components/AuthContext";
import { PulseLoader, PuffLoader } from "react-spinners";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false); // 추가된 상태
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { authToken, userType } = useAuth();

  useEffect(() => {
    const initiateChatSession = async () => {
      try {
        if (!sessionId) {
          const newSessionId = await createChatbotSession();
          setSessionId(newSessionId);
        }
      } catch (error) {
        console.error("Error initiating chat session:", error);
      }
    };

    if (authToken) {
      console.log("Auth Token found: ", authToken);
      initiateChatSession();
    } else {
      console.error("Auth token is missing");
    }
  }, [authToken, sessionId]);

  const createChatbotSession = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/careerchat/new-session",
        null,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            token: authToken,
          },
        }
      );
      console.log("Session creation response:", response.data);
      return response.data.session_id;
    } catch (error) {
      console.error("Error creating chatbot session:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  };

  const createChatbotMessage = async (sessionId, inputQuery) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/careerchat/chat",
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            session_id: sessionId,
            input_query: inputQuery,
            token: authToken,
          },
        }
      );
      return response.data.response;
    } catch (error) {
      console.error("Error creating chatbot message:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  };

  const saveChatlog = async (sessionId) => {
    try {
      console.log("sessionid: ", sessionId);
      await axios.post("http://localhost:8000/careerchat/save-chatlog", null, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params: {
          session_id: sessionId,
          token: authToken,
        },
      });
    } catch (error) {
      console.error("Error saving chat log:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      throw error;
    }
  };

  const getReport = async (sessionId) => {
    try {
      setReportLoading(true); // 로딩 시작
      const response = await axios.post(
        "http://localhost:8000/careerchat/predict",
        null,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            session_id: sessionId,
            token: authToken,
          },
        }
      );
      console.log("Report response:", response.data);
      return response.data; // 레포트 결과를 반환
    } catch (error) {
      console.error("Error getting report:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      throw error;
    } finally {
      setReportLoading(false); // 로딩 종료
    }
  };

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
      setLoading(true); // 로딩 시작

      try {
        const botResponse = await createChatbotMessage(sessionId, input);
        const botMessage = {
          text: botResponse,
          isBot: true,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error sending message to chatbot:", error);
      } finally {
        setLoading(false); // 로딩 종료
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSaveChatlog = async () => {
    try {
      await saveChatlog(sessionId);
    } catch (error) {
      console.error("Error saving chat log:", error);
    }
  };

  const handleReportClick = async () => {
    try {
      console.log("Report button clicked");
      setReportLoading(true); // 전체 페이지 로딩 시작
      const reportData = await getReport(sessionId);
      navigate("/report", { state: { reportData } });
    } catch (error) {
      console.error("Error getting report:", error);
      setReportLoading(false); // 오류 시 로딩 종료
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

  const handleBackClick = async () => {
    try {
      console.log("back click");
      await handleSaveChatlog();
    } catch (error) {
      console.error("Error saving chat log on back click:", error);
    } finally {
      if (userType === "faculty") {
        navigate("/studentlog");
      } else if (userType === "student") {
        navigate("/studentchat");
      }
    }
  };

  return (
    <div className="chatbot-container">
      {reportLoading && (
        <div className="loading-overlay">
          <PuffLoader color="#36d7b7" size={150} />
        </div>
      )}
      <div className={`chatbot-header ${reportLoading ? "hidden" : ""}`}>
        <button className="back-btn" onClick={handleBackClick}>
          <FaArrowLeft size="20" />
        </button>
        <button
          className="report-btn"
          onClick={handleReportClick}
          disabled={reportLoading}
        >
          레포트 보기
        </button>
      </div>
      <div className={`chatbot-messages ${reportLoading ? "hidden" : ""}`}>
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
              <div className={`time ${msg.isBot ? "bot-time" : "user-time"}`}>
                {msg.time}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message-wrapper bot">
              <div className="message bot">
                <PulseLoader color="white" size="10px" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>
      </div>
      <div
        className={`chatbot-input-container ${reportLoading ? "hidden" : ""}`}
      >
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
