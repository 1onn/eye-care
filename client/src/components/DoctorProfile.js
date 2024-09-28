import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Heading from './Heading';
import Footer from './Footer';
import './CSS/DoctorProfile.css';

function DoctorProfile() {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/doctors/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setDoctor(data))
            .catch(error => console.error('Error fetching doctor profile:', error));
    }, [id]);

    if (!doctor) {
        return <div>Loading...</div>;
    }

    const timeSlots = generateTimeSlots(doctor.available_start_time, doctor.available_end_time);

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const handleBookAppointment = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/selection?role=patient');
        } else {
            setShowPopup(true);
        }
    };

    const handleConfirmAppointment = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/selection?role=patient');
            return;
        }

        if (!selectedDate) {
            alert('Please select a date.');
            return;
        }

        try {
            const response = await fetch('/api/bookAppointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    doctor_id: id,
                    date: selectedDate,
                    time: selectedTime,
                    description: description
                })
            });

            if (response.ok) {
                setShowPopup(false);
                alert('Appointment booked successfully');
            } else {
                console.error('Error booking appointment:', await response.json());
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
        }
    };

    return (
        <div>
            <Heading />
            <div className='profile-background'>
                <div className="profile-container">
                    <div className="profile-header">
                        <img src={`data:image/jpeg;base64,${doctor.profile_pic}`} alt="Profile Picture" className="profile-pic" />
                        <div className="profile-info">
                            <h2>{doctor.name}</h2>
                            <p><b>Age</b> {calculateAge(doctor.dob)} Years</p>
                            <p>{doctor.current_hospital}</p>
                            <p><b>Fee</b> {doctor.fee} PKR</p>
                        </div>
                    </div>
                    <hr />
                    <div className="profile-details">
                        <div className="section">
                            <h3>Specialization</h3>
                            <ul>
                                {doctor.specialization.map((spec, index) => <li key={index}>{spec}</li>)}
                            </ul>
                        </div>
                        <div className="section">
                            <h3>Services</h3>
                            <ul>
                                {doctor.services.map((service, index) => <li key={index}>{service}</li>)}
                            </ul>
                        </div>
                        <div className="section">
                            <h3>Experience</h3>
                            <p>{doctor.experience_years} years, {doctor.experience_title}</p>
                        </div>
                        <hr />
                        <div className="section">
                            <h3>About Doctor</h3>
                            <div className="about-section">
                                <h4>Education</h4>
                                <p>{doctor.education}</p>
                            </div>
                            <div className="about-section">
                                <br></br>
                                <p>{doctor.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="appointment-section">
                        <h3>Book Appointment</h3>
                        <p>Available Date: 
                            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                        </p>
                        <p>Available Time: 
                            <select id="time-slots" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                                {timeSlots.map((slot, index) => <option key={index} value={slot}>{slot}</option>)}
                            </select>
                        </p>
                        <button className="book-btn" onClick={handleBookAppointment}>Book Appointment</button>
                    </div>
                </div>
            </div>
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <div className="popup-header">
                            <h3>Confirm Appointment</h3>
                            <button onClick={() => setShowPopup(false)}>X</button>
                        </div>
                        <div className="popup-body">
                            <p><b>Doctor:</b> {doctor.name}</p>
                            <p><b>Specialization:</b> {doctor.specialization.join(', ')}</p>
                            <p><b>Fee:</b> {doctor.fee} PKR</p>
                            <p><b>Date:</b> {selectedDate}</p>
                            <p><b>Time:</b> {selectedTime}</p>
                            <textarea 
                                placeholder="Brief description of your problem" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <button className="confirm-appointment-btn" onClick={handleConfirmAppointment}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

function generateTimeSlots(start, end) {
    const startTime = parseTime(start);
    const endTime = parseTime(end);
    const slots = [];

    while (startTime < endTime) {
        const nextTime = new Date(startTime.getTime() + 30 * 60000);
        slots.push(`${formatTime(startTime)}-${formatTime(nextTime)}`);
        startTime.setTime(nextTime.getTime());
    }

    return slots;
}

function parseTime(timeString) {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'pm') hours = parseInt(hours, 10) + 12;
    return new Date(1970, 0, 1, hours, minutes);
}

function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const modifier = hours >= 12 ? 'pm' : 'am';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${modifier}`;
}

export default DoctorProfile;
