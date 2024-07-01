import React from 'react';
import SignupForm from '../components/SignupForm';

const SignupPage = () => {
  return (
    <div className="container">
      <div className="rectangle-2">
        <h1>ALLIDO</h1>
      </div>
      <div className="rectangle-1">
        <h2>Sign-up</h2>
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;