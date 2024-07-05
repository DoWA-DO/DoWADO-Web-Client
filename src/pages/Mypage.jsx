import React from "react";
import PageLayout from "../components/PageLayout";
import MypageForm from "../components/MypageForm";

const MyPage = () => {
  return (
    <PageLayout>
      <div className="mp-page-name">마이페이지</div>
      <div className="mp-line"></div>
      <MypageForm />
    </PageLayout>
  );
};

export default MyPage;
