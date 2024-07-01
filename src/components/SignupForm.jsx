import React, { useState } from 'react';

const SignupForm = () => {
  return (
    <form>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" required />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required />
      </div>
      <button type="submit" className="btn">Sign Up</button>
      <div className="signup-link">
        Already have an account? <a href="/">Login Here</a>
      </div>
    </form>
  );
};

export default SignupForm;