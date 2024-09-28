import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/DoctorCard.css';

function DoctorCard({ doctor_id, name, age, specialization, hospital, imageUrl, imageType }) {
  const navigate = useNavigate();
  const specializationString = specialization.join(', ');

  const handleViewProfile = () => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (token && userType === 'patient') {
      navigate(`/dashboard/patient/doctors/${doctor_id}`);
    } else {
      navigate(`/doctor/${doctor_id}`);
    }
  };

  const handleBookAppointment = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate(`/selection?role=patient`);
      return;
    }
    navigate(`/doctor/${doctor_id}`);
  };

  return (
    <div className="doctor-card">
      <img src={`data:${imageType};base64,${imageUrl}`} alt={`${name}'s profile`} className="doctor-image" />
      <div className="doctor-info">
        <h3>{name}</h3>
        <p><b>Age:</b> {age}</p>
        <p><b>Specialization:</b> {specializationString}</p>
        <p><b>Hospital:</b> {hospital}</p>
      </div>
      <div className="doctor-buttons">
        <button className="view-profile" onClick={handleViewProfile}>View Profile</button>
        <button className="book-appointment" onClick={handleBookAppointment}>Book Appointment</button>
      </div>
    </div>
  );
}

export default DoctorCard;
