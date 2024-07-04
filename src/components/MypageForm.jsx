import React, { useState } from 'react';
import "../ui/Mypage.css"; // 스타일을 별도의 CSS 파일로 분리
import { useAuth } from "./AuthContext"; // 상대 경로 조정

const MyPageForm = () => {
    const { updatePassword, updateProfilePicture } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState('');

    const handlePasswordChange = (e) => {
        e.preventDefault();
        updatePassword(newPassword)
            .then(() => {
                alert('비밀번호가 성공적으로 변경되었습니다.');
            })
            .catch(error => {
                alert('비밀번호 변경에 실패했습니다. ' + error.message);
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
                    alert('프로필 사진이 성공적으로 변경되었습니다.');
                })
                .catch(error => {
                    alert('프로필 사진 변경에 실패했습니다. ' + error.message);
                });
        }
    };

    return (
        <div className="mypage-forms">
            <div className="form-section">
                <h2>비밀번호 변경</h2>
                <form onSubmit={handlePasswordChange}>
                    <label>
                        새로운 비밀번호:
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">비밀번호 변경</button>
                </form>
            </div>
            <div className="form-section">
                <h2>프로필 사진 변경</h2>
                <form onSubmit={handleProfilePictureSubmit}>
                    <label>
                        프로필 사진 선택:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            required
                        />
                    </label>
                    {preview && <img src={preview} alt="Profile Preview" className="profile-preview" />}
                    <button type="submit">프로필 사진 변경</button>
                </form>
            </div>
        </div>
    );
};

export default MyPageForm;
