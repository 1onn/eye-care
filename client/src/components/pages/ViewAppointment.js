import React, { useState, useEffect } from 'react';
import AppointmentCard from '../AppointmentCard';
import DoctorHeading from '../DoctorHeading';
import '../CSS/ViewAppointment.css';

function ViewAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [doctor, setDoctor] = useState(null);
    const token = localStorage.getItem("token");
  
    useEffect(() => {
      const getAppointments = async () => {
        try {
          const response = await fetch('/api/doctor/appointments', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setAppointments(data);
        } catch (error) {
          console.error("Error fetching appointments:", error);
        }
      };
  
      const getDoctorInfo = async () => {
        try {
          const response = await fetch('/api/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setDoctor(data);
        } catch (error) {
          console.error("Error fetching doctor info:", error);
        }
      };
  
      if (token) {
        getAppointments();
        getDoctorInfo();
      }
    }, [token]);
  
    return (
      <div>
        <DoctorHeading user={doctor} />
        <div className="appointments-container">
          <h1>Appointments</h1>
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.appointment_id} appointment={appointment} />
          ))}
        </div>
      </div>
    );
  }
  
  export default ViewAppointments;
