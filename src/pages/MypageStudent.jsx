import React, { useState, useEffect } from "react";
import axios from "axios";
import "../ui/Mypage.css";
import { useAuth } from "../components/AuthContext";
import { IoPersonCircleOutline } from "react-icons/io5";
import ChangePassword from "../components/ChangePasswordModal";
import PageLayout from "../components/PageLayout";

const MypageStudent = () => {
  const { authToken } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [student, setStudent] = useState({
    student_email: "",
    student_name: "",
    student_school: "",
    student_grade: 0,
    student_class: 0,
    student_number: 0,
    student_teacher_email: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchStudentInfo = async () => {
      if (authToken) {
        try {
          const response = await axios.post(
            "http://localhost:8000/student/read",
            null,
            {
              params: {
                token: authToken,
              },
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          console.log("Student Info Response", response.data);
          setStudent(response.data);
        } catch (error) {
          console.error("Failed to fetch student info:", error);
          setErrorMessage("Failed to fetch student info.");
        }
      }
    };

    fetchStudentInfo();
  }, [authToken]);

  const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (currentPassword === newPassword) {
      setErrorMessage("현재 비밀번호와 새 비밀번호가 같습니다.");
      return;
    }

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
      await axios.put(
        "http://localhost:8000/student/update",
        {
          student_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessage("");
      alert("비밀번호가 성공적으로 변경되었습니다.");
      setShowModal(false);
    } catch (error) {
      console.error("Failed to change password:", error);
      if (error.response && error.response.status === 401) {
        setErrorMessage("현재 비밀번호가 일치하지 않습니다.");
      } else {
        setErrorMessage("비밀번호 변경에 실패했습니다.");
      }
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
      formData.append("in_files", profilePicture);

      try {
        const response = await axios.post(
          "http://localhost:8000/file/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const fileUrls = response.data.fileUrls;
        if (fileUrls && fileUrls.length > 0) {
          const fileUrl = fileUrls[0];
          const fileName = fileUrl.split("/").pop();
          setStudent((prevStudent) => ({
            ...prevStudent,
            profilePicture: `http://localhost:8000/file/images/${fileName}`,
          }));
          setProfilePicture(null);
          alert("프로필 사진이 성공적으로 변경되었습니다.");
        } else {
          alert("파일 URL을 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("프로필 사진 변경에 실패했습니다.", error);
        alert("프로필 사진 변경에 실패했습니다.");
      }
    }
  };

  return (
    <PageLayout>
      <div className="mp-page-name">마이페이지</div>
      <div className="mp-line"></div>
      <div className="mypage-forms">
        <div className="mp-form-section center">
          <div className="mp-profile">
            {student.profilePicture ? (
              <img
                src={student.profilePicture}
                alt="Profile"
                className="mp-profile-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-profile.png";
                }}
              />
            ) : (
              <IoPersonCircleOutline className="mp-profile-img" />
            )}
          </div>
        </div>
        <div className="mp-form-section">
          <h4>이름</h4>
          <div className="user-info">{student.student_name}</div>
        </div>
        <div className="mp-form-line"></div>
        <div className="mp-form-section">
          <h4>이메일</h4>
          <div className="user-info">{student.student_email}</div>
        </div>
        <div className="mp-form-line"></div>
        <div className="mp-form-section">
          <h4>소속</h4>
          <div className="user-info school">
            {student.student_school} {student.student_grade}학년{" "}
            {student.student_class}반 {student.student_number}번
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
    </PageLayout>
  );
};

export default MypageStudent;
