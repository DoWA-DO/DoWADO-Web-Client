import React, { useState, useEffect, useRef } from "react";
import "../ui/Chatbot.css";
import PageLayout from "../components/PageLayout.jsx";

const consonants = [
  "ㄱ",
  "ㄴ",
  "ㄷ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅅ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
const vowels = ["ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ", "ㅣ"];
const letters = [...consonants, ...vowels];

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const floatingLettersRef = useRef([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initialMessage = {
      text: "안녕하세요! 무엇을 도와드릴까요?",
      isBot: true,
    };
    setMessages([initialMessage]);
    generateRandomLetters(); // 페이지 로드 시 자음과 모음 생성

    // 화면 크기가 변경될 때 floating letters 위치 업데이트
    window.addEventListener("resize", updateLettersPosition);

    return () => {
      window.removeEventListener("resize", updateLettersPosition);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      // 마지막 메시지로 이동
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
        const botMessage = { text: getChatbotMessageText(), isBot: true };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }, 1000);
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

  const generateRandomLetters = () => {
    const container = document.querySelector(".chatbot-messages");
    const maxLetters = 20; // 최대 생성되는 자음과 모음 수를 제한

    const existingLetters =
      container.querySelectorAll(".floating-letter").length;
    const lettersToGenerate = Math.max(0, maxLetters - existingLetters);

    for (let i = 0; i < lettersToGenerate; i++) {
      const letter = letters[Math.floor(Math.random() * letters.length)];
      const span = document.createElement("span");
      span.className = "floating-letter";
      span.textContent = letter;
      container.appendChild(span);
      floatingLettersRef.current.push(span);
      updatePosition(span); // 초기 위치 설정
    }
  };

  const updatePosition = (span) => {
    const container = document.querySelector(".chatbot-messages");
    span.style.left = `${Math.random() * (container.clientWidth - 24)}px`;
    span.style.top = `${Math.random() * (container.clientHeight - 24)}px`;
  };

  const updateLettersPosition = () => {
    const container = document.querySelector(".chatbot-messages");
    floatingLettersRef.current.forEach((span) => {
      updatePosition(span);
    });
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
                <div className="text">
                  {msg.text.split("").map((char, i) => (
                    <span key={i}>{char}</span>
                  ))}
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
