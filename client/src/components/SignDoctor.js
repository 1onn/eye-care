import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "./Heading";
import MultiSelectDropdown from "./MultiDrop";
import "./CSS/SignDoctor.css";
import SignDocImage from "./Images/D_signup.svg";

const specializations = [
  "Cornea and External Disease", "Glaucoma", "Retina/Vitreous Surgery", "Neuro-Ophthalmology", "Oculoplastics/Orbital Surgery", 
  "Pediatric Ophthalmology", "Uveitis", "Refractive Surgery", "Ocular Pathology", "Ocular Immunology", "Ophthalmic Genetics", 
  "Geriatric Ophthalmology"
];

const services = [
  "Comprehensive Eye Exams", "Vision Correction", "Medical Eye Care", "Surgical Eye Care", "Pediatric Eye Care", "Emergency Eye Care",
  "Low Vision Services", "Dry Eye Treatment", "Neuro-Ophthalmology", "Oculoplastics", "Laser Eye Surgery", "Cataract Surgery",
  "Contact Lens Services", "Teleophthalmology"
];

function SignDoctor() {
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("specializations", JSON.stringify(selectedSpecializations));
    formData.append("services", JSON.stringify(selectedServices));

    try {
      const response = await fetch("http://localhost:4000/api/signupdoctor", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Doctor registered:", data);
        setErrors([]);
        setSuccessMessage("Sign up successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login/doctor");
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
      <div className="Doc-main-container">
        <div className="Doc-left-box">
          <img src={SignDocImage} alt="Doctor Signup" />
        </div>
        <div className="Doc-right-box">
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
            <h2 className="Doc-heading">Personal Information</h2>
            <div className="Doc-form">
              <div className="Doc-box">
                <p>Name:</p>
                <input type="text" placeholder="Name" name="name" className="Doc-input" required />
                <p>Phone No:</p>
                <input type="tel" maxLength="11" pattern="\d{11}" placeholder="Phone no" name="phoneno" className="Doc-input" required />
                <p>CNIC:</p>
                <input type="text" maxLength="13" pattern="\d{13}" placeholder="Enter CNIC without dashes" name="cnic" className="Doc-input" required />
                <p>Date of Birth:</p>
                <input type="date" name="dob" className="Doc-input" required />
                <p>Degree Picture:</p>
                <input type="file" name="degree_pic" className="Doc-input" accept="image/*" />
              </div>
              
              <div className="Doc-box">
                <p>Email:</p>
                <input type="email" placeholder="Email" name="email" className="Doc-input" required />
                <p>Password:</p>
                <input type="password" placeholder="Password" name="password" minLength="6" className="Doc-input" required />
                <p>Confirm Password:</p>
                <input type="password" placeholder="Confirm Password" name="password2" minLength="6" className="Doc-input" required />
                <p>Profile Picture:</p>
                <input type="file" name="profile_pic" className="Doc-input" accept="image/*" />
              </div>
            </div>
            
            <h2 className="Doc-heading">Professional Information</h2>
            
            <div className="Doc-form">
              <div className="Doc-box">
                <p>Years of Experience:</p>
                <input type="number" placeholder="Years of Experience" name="experience_years" className="Doc-input" required />
                <p>Specialization:</p>
                <MultiSelectDropdown
                  options={specializations}
                  selectedOptions={selectedSpecializations}
                  setSelectedOptions={setSelectedSpecializations}
                  label="Select Specializations"
                />
                <p>Current Hospital:</p>
                <input type="text" placeholder="Current Hospital" name="current_hospital" className="Doc-input" required />
                <p>Available Start Time:</p>
                <input type="time" name="available_start_time" className="Doc-input" required />
              </div>
              
              <div className="Doc-box">
                <p>Title of Experience:</p>
                <input type="text" placeholder="Title of Experience" name="experience_title" className="Doc-input" required />

                <p>Services:</p>
                <MultiSelectDropdown
                  options={services}
                  selectedOptions={selectedServices}
                  setSelectedOptions={setSelectedServices}
                  label="Select Services"
                />
                <p>Fee/25min</p>
                <input type="number" placeholder="Fee in PKR" name="fee" className="Doc-input" required />
                
                <p>Available End Time:</p>
                <input type="time" name="available_end_time" className="Doc-input" required />
              </div>
            </div>

            <div className="Doc-last-block">
              <p>Description:</p>
              <textarea placeholder="Description" name="description" className="Doc-input Doc-description" required />
              <input className="Doc-button" type="submit" value="Sign Up" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignDoctor;
