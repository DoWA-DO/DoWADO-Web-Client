import React, { useState, useEffect } from "react";
import axios from "axios";
import "../ui/Mypage.css";
import { useAuth } from "./AuthContext";
import { IoPersonCircleOutline } from "react-icons/io5";
import ChangePassword from "./ChangePasswordModal";

const MypageForm = () => {
  const { updateProfilePicture } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false); // 모달 상태
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 더미 데이터를 사용하여 UI 테스트
    const fetchUserInfo = () => {
      const userRole = "student"; // 테스트용 더미 데이터
      const dummyUser = {
        name: "박주현",
        email: "teacher@example.com",
        school: "에이블스쿨",
        grade: "1학년",
        class: "1반",
        number: "1번",
        profilePicture: "", // 테스트용 기본 이미지 URL
      };
      setRole(userRole);
      setUser(dummyUser);
    };

    fetchUserInfo();
  }, []);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!validatePassword(newPassword)) {
      setErrorMessage(
        "비밀번호는 숫자, 소문자, 특수문자를 포함하여 8자리 이상이어야 합니다."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const response = await axios.post(
        "http://your-fastapi-server-url/api/verify-password",
        { current_password: currentPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.valid) {
        await axios.post(
          "http://your-fastapi-server-url/api/change-password",
          {
            current_password: currentPassword,
            new_password: newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrorMessage("");
        alert("비밀번호가 성공적으로 변경되었습니다.");
        setShowModal(false);
      } else {
        setErrorMessage("현재 비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      setErrorMessage("비밀번호 변경에 실패했습니다. " + error.message);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const handleProfilePictureSubmit = async (e) => {
    e.preventDefault();
    if (profilePicture) {
      const formData = new FormData();
      formData.append("file", profilePicture);

      try {
        const response = await axios.post(
          "http://your-fastapi-server-url/upload-profile-picture",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const fileUrl = response.data.file_url;
        await updateProfilePicture(fileUrl); // 서버에 저장된 파일 URL을 업데이트하는 함수

        setUser({ ...user, profilePicture: fileUrl });
        setProfilePicture(null);
        alert("프로필 사진이 성공적으로 변경되었습니다.");
      } catch (error) {
        alert("프로필 사진 변경에 실패했습니다. " + error.message);
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mypage-forms">
      <div className="mp-form-section center">
        <div className="mp-profile">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="mp-profile-img"
            />
          ) : (
            <IoPersonCircleOutline className="mp-profile-img" />
          )}
        </div>
      </div>
      <div className="mp-form-section">
        <h4>이름</h4>
        <div className="user-info">{user.name}</div>
      </div>
      <div className="mp-form-line"></div>
      <div className="mp-form-section">
        <h4>이메일</h4>
        <div className="user-info">{user.email}</div>
      </div>
      <div className="mp-form-line"></div>
      <div className="mp-form-section">
        <h4>소속</h4>
        <div className="user-info school">
          {user.school} {user.grade} {user.class}
          {role === "student" && <>{user.number}</>}
        </div>
      </div>
      <div className="mp-form-line"></div>
      <div className="mp-form-section">
        <h4>비밀번호</h4>
        <button type="button" onClick={() => setShowModal(true)}>
          변경
        </button>
      </div>
      <div className="mp-form-line"></div>
      <div className="mp-form-section">
        <h4>프로필 사진 변경</h4>
        <form
          onSubmit={handleProfilePictureSubmit}
          className="profile-picture-form"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            required
            className="profile-picture-input"
          />
          <button type="submit">업로드</button>
        </form>
      </div>
      <ChangePassword
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handlePasswordChange}
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        setCurrentPassword={setCurrentPassword}
        setNewPassword={setNewPassword}
        setConfirmPassword={setConfirmPassword}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default MypageForm;
