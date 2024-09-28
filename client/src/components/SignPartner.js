import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "./Heading";
import "./CSS/SignPartner.css";
import SignPartnerImage from "./Images/Sign-partner.svg";

function SignPartner() {
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await fetch("http://localhost:4000/api/signuppartner", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Partner registered:", data);
        setErrors([]);
        setSuccessMessage("Sign up successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login/partner");
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || [{ message: "Unknown error occurred" }]);
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrors([{ message: "Network or server error" }]);
      setSuccessMessage("");
    }
  };

  return (
    <div>
      <Heading />
      <div className="Partner-main-container">
        <div className="Partner-left-box">
          <img src={SignPartnerImage} alt="Partner Signup" />
        </div>
        <div className="Partner-right-box">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            <h2 className="Partner-heading">Store Information</h2>
            <div className="Partner-form">
              <div className="Partner-box">
                <p>Store Name:</p>
                <input type="text" placeholder="Store Name" name="store_name" className="Partner-input" required />
                <p>SECP Certificate:</p>
                <input type="file" name="SECP_certificate_pic" className="Partner-input" accept="image/*" required />

                
                <p>Store Address:</p>
                <input type="text" placeholder="Store Address" name="store_address" className="Partner-input-address" required />
              </div>
              <div className="Partner-box">
                <p>Store Phone No:</p>
                <input type="tel" maxLength="11" pattern="\d{11}" placeholder="Store Phone no" name="store_phoneno" className="Partner-input" required />
              </div>
            </div>
            
            <h2 className="Partner-heading">Personal Information</h2>
            <div className="Partner-form">
              <div className="Partner-box">
                <p>Owner Name:</p>
                <input type="text" placeholder="Owner Name" name="owner_name" className="Partner-input" required />
                <p>Owner Phone No:</p>
                <input type="tel" maxLength="11" pattern="\d{11}" placeholder="Owner Phone no" name="owner_phoneno" className="Partner-input" required />
                <p>CNIC:</p>
                <input type="text" maxLength="13" pattern="\d{13}" placeholder="Enter CNIC without dashes" name="cnic" className="Partner-input" required />
              </div>
              
              <div className="Partner-box">
                <p>Email:</p>
                <input type="email" placeholder="Email" name="email" className="Partner-input" required />
                <p>Password:</p>
                <input type="password" placeholder="Password" name="password" minLength="6" className="Partner-input" required />
                <p>Confirm Password:</p>
                <input type="password" placeholder="Confirm Password" name="password2" minLength="6" className="Partner-input" required />
              </div>
            </div>
            
            <h2 className="Partner-heading">Store Description</h2>
            <div className="Partner-last-block">
              <p>Store Description:</p>
              <textarea placeholder="Description" name="description" className="Partner-input Partner-description" required />
              <input className="Partner-button" type="submit" value="Sign Up" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignPartner;
