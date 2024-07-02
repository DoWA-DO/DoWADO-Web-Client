import React from "react";
import "../ui/DashboardStudent.css";

const DashboardStudentPage = () => {
  return (
    <div className="std-btn-container">
      <div className="std-btn">
        <button
          className="button button--winona button--border-thick button--round-l button--text-upper button--size-s button--text-thick"
          data-text="상담하기"
        >
          <span>상담하기</span>
        </button>
        <p>상담을 해보세요!</p>
      </div>
      <div className="std-btn">
        <button
          className="button button--winona button--border-thick button--round-l button--text-upper button--size-s button--text-thick"
          data-text="상담 기록 보기"
        >
          <span>상담 기록 보기</span>
        </button>
        <p>이전에 했던 상담 기록을 확인해 보세요!</p>
      </div>
    </div>
  );
};

export default DashboardStudentPage;
