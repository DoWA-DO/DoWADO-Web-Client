import React from "react";
import Modal from "react-modal";

const InfoCheck = ({ isOpen, closeModal, content }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Info Check"
      className="info-check-modal"
      overlayClassName="modal-overlay"
    >
      <h2>
        {content === "terms" ? "이용약관 동의" : "개인정보 수집 및 이용 동의"}
      </h2>
      <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {content === "terms"
          ? `
'도와도'(이하 "회사" 또는 "도와도"라고 함)의 서비스 이용약관은 회사가 제공하는 모든 서비스의 이용과 관련하여 이용자의 권리, 의무 및 책임사항을 규정하고 있습니다. 회사의 서비스를 이용하기 위해서는 본 약관에 동의하여야 합니다.

1. 약관의 목적
본 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

2. 서비스의 제공 및 변경
회사는 이용자에게 다음과 같은 서비스를 제공합니다:
- 회원 가입 및 관리
- 정보 제공
- 기타 회사가 정하는 서비스

3. 이용자의 의무
이용자는 서비스 이용 시 다음의 행위를 하여서는 안 됩니다:
- 허위 정보의 등록
- 타인의 개인정보 도용
- 서비스의 부정한 이용
- 회사 및 제3자의 권리 침해

4. 개인정보 보호
회사는 이용자의 개인정보를 보호하기 위하여 관련 법령에 따라 개인정보 처리방침을 수립하고 이를 준수합니다.

5. 약관의 개정
회사는 필요한 경우 관련 법령을 위반하지 않는 범위 내에서 본 약관을 개정할 수 있습니다. 약관이 개정될 경우 회사는 개정 내용과 시행일을 명시하여 서비스 초기 화면에 공지합니다.
          `
          : `
'도와도'(이하 "회사" 또는 "도와도"라고 함) 는 개인정보 보호법에 따라 이용자의 개인정보를 보호하고 이를 위하여 개인정보 수집 및 이용에 대한 동의를 받고자 합니다. 본 동의서는 회사의 서비스를 이용함에 있어 개인정보를 제공받고, 이용하는 목적, 항목, 보유 및 이용기간 등을 명시하고 있습니다.

1. 개인정보의 수집 및 이용 목적
회사는 다음과 같은 목적으로 개인정보를 수집하고 이용합니다.
- 회원 가입 및 관리
- 서비스 제공 및 운영
- 고객 문의 및 불만 처리
- 마케팅 및 광고 활용
- 법적 의무 이행

2. 수집하는 개인정보의 항목
회사는 회원 가입, 서비스 제공을 위하여 다음과 같은 개인정보를 수집합니다.
- 필수 항목: 이메일 주소, 비밀번호, 학교명

3. 개인정보의 보유 및 이용기간
회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 다만, 관계 법령에 따라 일정 기간 보관해야 하는 경우에는 해당 기간 동안 보관합니다.

4. 동의를 거부할 권리 및 동의 거부에 따른 불이익
이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 동의를 거부할 경우 서비스 제공이 제한될 수 있습니다.
          `}
      </pre>
      <button
        onClick={closeModal}
        style={{
          display: "block",
          margin: "20px auto",
          background: "#5b86e5",
          border: "none",
          borderRadius: "8px",
          color: "#ffffff",
          padding: "10px",
          fontFamily: "Telegraf",
          fontStyle: "normal",
          fontWeight: "800",
          fontSize: "16px",
          letterSpacing: "0.08em",
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        닫기
      </button>
    </Modal>
  );
};

export default InfoCheck;
