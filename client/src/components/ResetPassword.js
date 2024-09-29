import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const { token, userType } = useParams(); // Extract token and userType from URL params

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/reset-password", { token, newPassword, userType });
      alert("Password reset successfully!");
    } catch (err) {
      console.error(err);
      alert("Error resetting password");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ResetPassword;
