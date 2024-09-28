import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "./Heading";
import "./CSS/SignPatient.css";
import Signimage from "./Images/Login.svg";

function SignPatient() {
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    try {
      const response = await fetch("/api/signuppatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User registered:", data);
        setErrors([]);
        setSuccessMessage("Sign up successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login/patient");
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors);
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrors([{ message: "Network or server error" }]);
      setSuccessMessage("");
    }
  };

  return (
    <>
      <Heading />
      <div className="main-container">
        <div className="left-box">
          <img src={Signimage} alt="image" />
        </div>
        <div className="right-box">
          <form onSubmit={handleSubmit}>
            {errors.length > 0 && (
              <ul>
                {errors.map((error, index) => (
                  <li key={index} style={{ color: "red" }}>
                    {error.message}
                  </li>
                ))}
              </ul>
            )}
            {successMessage && (
              <p style={{ color: "green" }}>{successMessage}</p>
            )}
            <div className="form">
              <div className="box">
                <p>First Name:</p>
                <input type="text" placeholder="First Name" name="fname" pattern='[A-Za-z]+' className="input" required />
                <p>Phone No:</p>
                <input type="tel" maxLength="11" pattern="\d{11}" placeholder="Phone no" name="phoneno" className="input" required />
                <p>Email:</p>
                <input type="email" placeholder="Email" name="email" className="input" required /> <br></br>
                <p className="input"> 
                  Gender:
                  <select className="input" name="gender" required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </p>
              </div>

              <div className="box">
                <p>Second Name:</p>
                <input type="text" placeholder="Second Name" name="lname" className="input" required />
                <p>CNIC:</p>
                <input type="text" maxLength="15" pattern="\d{5}-\d{7}-\d" placeholder="XXXXX-XXXXXXX-X" name="cnic" className="input" required />
                <p>Password:</p>
                <input type="password" placeholder="Password" name="password" minLength="6" className="input" required />
                <p>Confirm Password:</p>
                <input type="password" placeholder="Confirm Password" name="password2" minLength="6" className="input" required />
              </div>
            </div>
            <div className="last-block">
              <input className="button" type="submit" />
            </div>            
          </form>
        </div>
      </div>
    </>
  );
}

export default SignPatient;
