import React from 'react';
import './CSS/AppointmentCard.css';

function AppointmentCard({ appointment }) {

  return (
    <div className="appointment-card">
      <div className="appointment-info">
        <h3>Patient: {appointment.patient_name}</h3>
        <p><b>Description of issue:</b> {appointment.description}</p>
        <p><b>Time of appointment:</b> {appointment.appointment_time}</p>
      </div>
      <div className="appointment-actions">
        <button className="inbox-button">Inbox</button>
      </div>
    </div>
  );
}

export default AppointmentCard;
