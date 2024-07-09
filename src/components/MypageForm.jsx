import React, { useState } from "react";
import "../ui/Mypage.css"; // 스타일을 별도의 CSS 파일로 분리
import { useAuth } from "./AuthContext"; // 상대 경로 조정
import { IoPersonCircleOutline } from "react-icons/io5";

const MypageForm = () => {
  const { updatePassword, updateProfilePicture } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState("");

  const handlePasswordChange = (e) => {
    e.preventDefault();
    updatePassword(newPassword)
      .then(() => {
        alert("비밀번호가 성공적으로 변경되었습니다.");
      })
      .catch((error) => {
        alert("비밀번호 변경에 실패했습니다. " + error.message);
      });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleProfilePictureSubmit = (e) => {
    e.preventDefault();
    if (profilePicture) {
      updateProfilePicture(profilePicture)
        .then(() => {
          alert("프로필 사진이 성공적으로 변경되었습니다.");
        })
        .catch((error) => {
          alert("프로필 사진 변경에 실패했습니다. " + error.message);
        });
    }
  };

  return (
    <div className="mypage-forms">
      <div className="mp-form-section">
        <div className="mp-profile">
          <IoPersonCircleOutline className="mp-profile-img" />
        </div>
      </div>
      <div className="mp-form-section">
        <h4>이름</h4>
      </div>
      <div className="mp-form-section">
        <h4>이메일</h4>
      </div>
      <div className="mp-form-section">
        <h4>소속</h4>
      </div>
      <div className="mp-form-section">
        <h4>비밀번호 변경</h4>
        <form onSubmit={handlePasswordChange}>
          <div className="pw-change-btn">
            <input
              className="mp-input-container"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">변경</button>
          </div>
        </form>
      </div>
      <div className="mp-form-section">
        <h4>프로필 사진 변경</h4>
        <form onSubmit={handleProfilePictureSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            required
          />
          {preview && (
            <img
              src={preview}
              alt="Profile Preview"
              className="profile-preview"
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default MypageForm;
