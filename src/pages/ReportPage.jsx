import "../ui/Report.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ReportPage = () => {
  const navigate = useNavigate();

  return (
    <div className="report-container">
      <div className="report-header">
        <button className="back-btn" onClick={() => navigate("/studentchat")}>
          <FaArrowLeft size="20" />
        </button>
      </div>
      {/* 레포트 내용 */}
    </div>
  );
};

export default ReportPage;
