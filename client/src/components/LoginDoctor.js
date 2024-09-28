import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/LoginDoctor.css";

function LoginDoctor() {
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
      const response = await fetch("/api/logindoctor", {
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
        navigate("/dashboard/doctor");
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
    <div className="doc-login-container">
      <form onSubmit={handleSubmit} className="doc-login-form">
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
        <input type="email" className="doc-login-input" name="email" required />
        <p>Password</p>
        <input type="password" className="doc-login-input" name="password" required />
        <input type="submit" className="doc-login-submit-button" />
      </form>
    </div>
  );
}

export default LoginDoctor;
