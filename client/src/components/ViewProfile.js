import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/ViewProfile.css";
import DHeading from "./DHeading";

function ViewProfile() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login/patient");
        return;
      }
      try {
        const response = await fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUser(data);
        setFormData(data);
        
        if (data.profile_pic) {
          const imageResponse = await fetch(`/api/patient/profile-pic/${data.patient_id}`, {
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

        // Fetch appointments
        const appointmentsResponse = await fetch("/api/patient/appointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login/patient");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch("/api/updatePatientProfile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditMode(false);
      } else {
        console.error("Error updating profile:", await response.json());
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) return null;

  return (
    <div>
      <DHeading user={user} />
      <div className='profile-background'>
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
                  <input type="text" name="fname" value={formData.fname} className="Doc-input" onChange={handleChange} />
                  <input type="text" name="lname" value={formData.lname} className="Doc-input" onChange={handleChange} />
                  <input type="email" name="email" value={formData.email} className="Doc-input" onChange={handleChange} />
                  <input type="password" name="password" placeholder="New Password" className="Doc-input" onChange={handleChange} />
                  <input type="password" name="passwordConfirm" placeholder="Confirm Password" className="Doc-input" onChange={handleChange} />
                  <select name="gender" className="Doc-input" value={formData.gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </>
              ) : (
                <>
                  <h2>{`${user.fname} ${user.lname}`}</h2>
                  <p><b>Email:</b> {user.email}</p>
                  <p><b>Gender:</b> {user.gender}</p>
                </>
              )}
            </div>
          </div>
          <button onClick={() => setEditMode(!editMode)} className="edit-button">{editMode ? "Cancel" : "Edit"}</button>
          {editMode && <button onClick={handleSave} className="save-button">Save</button>}
          <hr />
          <div className="profile-details">
            <div className="section">
              <h3 className="about-section">Your Appointment</h3>
              {appointments.length === 0 ? (
                <p>No appointments have been made.</p>
              ) : (
                appointments.map((appointment, index) => (
                  <div key={index} className="appointment-card">
                    <p><b>Doctor:</b> {appointment.doctor_name}</p>
                    <p><b>Specialization:</b> {appointment.specialization.join(', ')}</p>
                    <p><b>Issue Description:</b> {appointment.description}</p>
                    <p><b>Fee:</b> {appointment.fee} PKR</p>
                    <p><b>Appointment Time:</b> {appointment.appointment_time}</p>
                  </div>
                ))
              )}
            </div>
            <hr />
            <div className="section">
              <h3 className="about-section">Description</h3>
              {editMode ? (
                <textarea name="description" value={formData.description} className="Doc-description" onChange={handleChange}></textarea>
              ) : (
                <p >{user.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;
