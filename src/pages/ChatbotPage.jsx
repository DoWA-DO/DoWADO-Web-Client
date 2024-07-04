import React, { useState, useEffect } from 'react';
import "../ui/Chatbot.css";

const consonants = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const vowels = ["ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ", "ㅣ"];
const letters = [...consonants, ...vowels];

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const initialMessage = { text: '안녕하세요! 무엇을 도와드릴까요?', isBot: true };
    setMessages([initialMessage]);
    generateRandomLetters(); // 페이지 로드 시 자음과 모음 생성
  }, []);

  
  const handleSendMessage = () => {
    if (input.trim() !== '') {
      const userMessage = { text: input, isBot: false };
      setMessages([...messages, userMessage]);
      animateLetters(userMessage.text); // 사용자가 입력한 텍스트에 따라 애니메이션 실행
      setInput('');

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
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const generateRandomLetters = () => {
    const container = document.querySelector('.chatbot-messages');
    const maxLetters = 20; // 최대 생성되는 자음과 모음 수를 제한

    // 현재 존재하는 floating-letters의 수를 확인하여 부족한 만큼만 생성
    const existingLetters = container.querySelectorAll('.floating-letter').length;
    const lettersToGenerate = Math.max(0, maxLetters - existingLetters);

    for (let i = 0; i < lettersToGenerate; i++) {
      const letter = letters[Math.floor(Math.random() * letters.length)];
      const span = document.createElement('span');
      span.className = 'floating-letter';
      span.textContent = letter;
      container.appendChild(span);

      const updatePosition = () => {
        const duration = Math.random() * 15 + 5; // 5초에서 15초 사이의 랜덤한 이동 시간
        span.style.animationDuration = `${duration}s`;
        span.style.left = `${Math.random() * (container.clientWidth - 24)}px`;
        span.style.top = `${Math.random() * (container.clientHeight - 24)}px`;
      };

      // 초기 위치 설정
      updatePosition();
    }
  };

  const animateLetters = (text) => {
    const container = document.querySelector('.chatbot-messages');
    const lettersToAnimate = text.split('').map(char => {
      return Array.from(container.querySelectorAll('.floating-letter')).find(span => span.textContent === char);
    });
  
    lettersToAnimate.forEach((span, index) => {
      if (span) {
        span.classList.add('animated-letter', 'blue-glow');
        const finalPosition = document.querySelector(`.message:last-child .text span:nth-child(${index + 1})`).getBoundingClientRect();
        const containerPosition = container.getBoundingClientRect();
        const offsetX = finalPosition.left - containerPosition.left;
        const offsetY = finalPosition.top - containerPosition.top;
  
        span.style.left = `${offsetX}px`;
        span.style.top = `${offsetY}px`;
  
        setTimeout(() => {
          span.remove();
        }, 1500);
      }
    });
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        챗봇
      </div>
      <div className="chatbot-messages">
        <div className="chatbot-messages-wrapper">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
              <div className="text">
                {msg.text.split('').map((char, i) => (
                  <span key={i}>{char}</span>
                ))}
              </div>
            </div>
          ))}
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
  );
};

const getChatbotMessageText = () => {
  const responses = [
    "어떻게 도와드릴까요?",
    "좀 더 설명해 주시겠어요?",
    "도움이 필요하시면 말씀해 주세요."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

export default ChatbotPage;
