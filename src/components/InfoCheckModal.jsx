import React from "react";
import Modal from "react-modal";
import "../ui/InfoCheckModal.css"; 

const InfoCheck = ({ isOpen, closeModal, content }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Info Check"
      className="info-check-modal"
      overlayClassName="info-modal-overlay"
    >
      <h2 className="info-modal-title">
        {content === "terms"
          ? "이용약관"
          : content === "privacy"
          ? "개인정보 수집 및 이용"
          : "개인정보 처리방침"}
      </h2>
      <pre className="info-modal-content">
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
          : content === "privacy"
          ? `
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
- 필수 항목: 이름, 이메일, 비밀번호, 소속 학교 및 학년, 반, 번호
- 진로 상담 및 고객 지원: 성명, 이메일, 소속 학교, 학년, 상담 내용, 상담 기록, 레포트 결과

3. 개인정보의 보유 및 이용기간
회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 다만, 관계 법령에 따라 일정 기간 보관해야 하는 경우에는 해당 기간 동안 보관합니다.

4. 동의를 거부할 권리 및 동의 거부에 따른 불이익
이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 동의를 거부할 경우 서비스 제공이 제한될 수 있습니다.
          `
          : `
'도와도'(이하 "회사"라 함)는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같은 개인정보처리방침을 수립·공개합니다.

제1조(개인정보의 처리 목적)
회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리한 개인정보는 다음의 목적 이외의 용도로는 사용되지 않으며, 이용 목적이 변경될 시에는 사전 동의를 구할 예정입니다.
- 회원 가입 및 관리
- 서비스 제공

제2조(개인정보의 처리 및 보유 기간)
회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
- 회원 가입 및 관리: 회원 탈퇴 시까지
- 서비스 제공: 서비스 이용 계약 또는 회원가입 해지 시까지

제3조(개인정보의 제3자 제공)
회사는 정보주체의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
- 정보주체가 사전에 동의한 경우
- 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

제4조(정보주체와 법정대리인의 권리·의무 및 그 행사방법)
정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
- 개인정보 열람 요구
- 오류 등이 있을 경우 정정 요구
- 삭제 요구
- 처리 정지 요구

제5조(처리하는 개인정보의 항목)
회사는 다음의 개인정보 항목을 처리하고 있습니다:
- 회원 가입 및 관리: 성명, 비밀번호, 이메일, 소속 학교 및 학년, 반, 번호
- 진로 상담 및 고객 지원: 성명, 이메일, 소속 학교, 학년, 상담 내용, 상담 기록, 레포트 결과

제6조(개인정보의 파기)
회사는 개인정보 보유기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
- 파기 절차: 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성된 경우, 별도의 DB로 옮겨져 내부 방침 및 기타 관련 법령에 따라 일정 기간 저장된 후 파기됩니다.
- 파기 방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.

제7조(개인정보의 안전성 확보 조치)
회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
- 관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등
- 기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보의 암호화, 보안프로그램 설치
- 물리적 조치: 전산실, 자료보관실 등의 접근통제

제8조(개인정보 보호책임자)
회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:
- 개인정보 보호책임자
          성명: 
          직책:
          연락처:

- 개인정보 보호 담당부서
          부서명:
          담당자:
          연락쳐:

제9조(권익침해 구제방법)
정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다:
- 개인정보분쟁조정위원회: 전화 (국번없이) 1833-6972, 홈페이지: http://www.kopico.go.kr
- 개인정보침해신고센터: 전화 (국번없이) 118, 홈페이지: http://privacy.kisa.or.kr

제10조(개인정보 처리방침 변경)
이 개인정보처리방침은 2023년 7월 15일부터 적용됩니다:
- 공고일자: 2023년 7월 15일
- 시행일자: 2023년 7월 15일
          `}
      </pre>
      <button className="info-modal-button" onClick={closeModal}>
        닫기
      </button>
    </Modal>
  );
};

export default InfoCheck;
