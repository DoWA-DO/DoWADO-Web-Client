import React, { useState } from "react";
import ChatLog from "../components/ChatLog";
import "../ui/StudentLogPage.css";
import PageLayout from "../components/PageLayout";

const Search = ({ onSubmit }) => {
  const [filterType, setFilterType] = useState("name");
  const [filterValue, setFilterValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(filterValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setFilterValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="sl-search-form">
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="sl-select"
      >
        <option className="sl-option" value="name">
          이름
        </option>
        <option className="sl-option" value="number">
          번호
        </option>
      </select>
      <input
        name="filter"
        className="sl-input"
        value={filterValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" className="sl-search-btn">
        검색
      </button>
    </form>
  );
};

const StudentLogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (term) => {
    setSearchTerm(term);
  };

  return (
    <PageLayout>
      <div className="student-chat-title">
        <div className="sl-page-name">학생상담기록</div>
      </div>
      <div className="sl-line"></div>
      <Search onSubmit={handleSearchSubmit} />
      <ChatLog />
    </PageLayout>
  );
};

export default StudentLogPage;
