import React from "react";
import Modal from "react-modal";

const InfoCheck = ({ isOpen, closeModal }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="개인정보 수집 및 이용 동의"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <h2>개인정보 수집 및 이용 동의</h2>
      <p>개인정보 수집 및 이용 동의 내용</p>
      <button onClick={closeModal}>닫기</button>
    </Modal>
  );
};

export default InfoCheck;
