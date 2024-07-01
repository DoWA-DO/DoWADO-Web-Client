import React from 'react';
import SignupForm from '../components/SignupForm';
import FindPassword from '../components/FindPassword';

const FindPasswordPage = () => {
  return (
    <div className="container">
      <div className="rectangle-2">
        <h1>DoWA:DO</h1>
      </div>
      <div className="rectangle-1">
        <FindPassword />
      </div>
    </div>
  );
};

export default FindPasswordPage;