import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/ViewProfile.css";
import DoctorHeading from "./DoctorHeading";

function ViewProfile() {
  const [doctor, setDoctor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login/doctor");
        return;
      }
      try {
        const response = await fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setDoctor(data);
        setFormData(data);
        setSelectedSpecializations(data.specialization || []);
        setSelectedServices(data.services || []);

        if (data.profile_pic) {
          const imageResponse = await fetch(`/api/doctor/profile-pic/${data.doctor_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const imageBlob = await imageResponse.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfilePic(reader.result);
          };
          reader.readAsDataURL(imageBlob);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        navigate("/login/doctor");
      }
    };

    fetchDoctorData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
  };

  const handleSpecializationChange = (e) => {
    setSelectedSpecializations(e.target.value.split(',').map(spec => spec.trim()));
  };

  const handleServicesChange = (e) => {
    setSelectedServices(e.target.value.split(',').map(service => service.trim()));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'specialization' || key === 'services') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch("/api/updateDoctorProfile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      if (response.ok) {
        const updatedDoctor = await response.json();
        setDoctor(updatedDoctor);
        setEditMode(false);
      } else {
        console.error("Error updating profile:", await response.json());
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (!doctor) return null;

  return (
    <div>
      <DoctorHeading user={doctor} />
      <div className="profile-background">
        <div className="profile-container">
          <div className="profile-header">
            {profilePic ? (
              <img src={profilePic} alt="Profile Picture" className="profile-pic" />
            ) : (
              <img src="/path/to/default/profile/picture.jpg" alt="Profile Picture" className="profile-pic" />
            )}
            <div className="profile-info">
              {editMode ? (
                <>
                  <input type="file" name="profile_pic" onChange={handleFileChange} />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} />
                  <input type="text" name="current_hospital" value={formData.current_hospital} onChange={handleChange} />
                  <input type="number" name="fee" value={formData.fee} onChange={handleChange} />
                </>
              ) : (
                <>
                  <h2>{doctor.name}</h2>
                  <p><b>Age</b> {calculateAge(doctor.dob)} Years</p>
                  <p>{doctor.current_hospital}</p>
                  <p><b>Fee</b> {doctor.fee} PKR</p>
                </>
              )}
            </div>
          </div>
          <button onClick={() => setEditMode(!editMode)} className="edit-button">{editMode ? "Cancel" : "Edit"}</button>
          {editMode && <button onClick={handleSave} className="save-button">Save</button>}
          <hr />
          <div className="profile-details">
            <div className="section">
              <h3>Specialization</h3>
              {editMode ? (
                <textarea name="specialization" value={selectedSpecializations.join(', ')} onChange={handleSpecializationChange}></textarea>
              ) : (
                <ul>
                  {selectedSpecializations.map((spec, index) => <li key={index}>{spec}</li>)}
                </ul>
              )}
            </div>
            <div className="section">
              <h3>Services</h3>
              {editMode ? (
                <textarea name="services" value={selectedServices.join(', ')} onChange={handleServicesChange}></textarea>
              ) : (
                <ul>
                  {selectedServices.map((service, index) => <li key={index}>{service}</li>)}
                </ul>
              )}
            </div>
            <div className="section">
              <h3>Experience</h3>
              {editMode ? (
                <>
                  <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} />
                  <input type="text" name="experience_title" value={formData.experience_title} onChange={handleChange} />
                </>
              ) : (
                <p>{doctor.experience_years} years, {doctor.experience_title}</p>
              )}
            </div>
            <div className="section">
              <h3>Available</h3>
              {editMode ? (
                <>
                  <input type="time" name="available_start_time" value={formData.available_start_time} onChange={handleChange} />
                  <input type="time" name="available_end_time" value={formData.available_end_time} onChange={handleChange} />
                </>
              ) : (
                <p>{doctor.available_start_time} to {doctor.available_end_time}</p>
              )}
            </div>
            <hr />
            <div className="section">
              <h3>About Doctor</h3>
              <div className="about-section">
                <h4>Education</h4>
                {editMode ? (
                  <textarea name="education" value={formData.education} onChange={handleChange}></textarea>
                ) : (
                  <p>{doctor.education}</p>
                )}
              </div>
              <div className="about-section">
                {editMode ? (
                  <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
                ) : (
                  <p>{doctor.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;