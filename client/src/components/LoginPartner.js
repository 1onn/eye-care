import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/LoginPartner.css";

function LoginPartner() {
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    try {
      const response = await fetch("/api/loginpartner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard/partner");
      } else {
        const errorData = await response.json();
        setErrors([{ message: errorData.error }]);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrors([{ message: "Network or server error" }]);
    }
  };

  return (
    <div className="partner-login-container">
      <form onSubmit={handleSubmit} className="partner-login-form">
        <h1>LOGIN</h1>
        {errors.length > 0 && (
          <ul>
            {errors.map((error, index) => (
              <li key={index} style={{ color: "red" }}>
                {error.message}
              </li>
            ))}
          </ul>
        )}
        <p>Email</p>
        <input type="email" className="partner-login-input" name="email" required />
        <p>Password</p>
        <input type="password" className="partner-login-input" name="password" required />
        <input type="submit" className="partner-login-submit-button" />
      </form>
    </div>
  );
}

export default LoginPartner;
