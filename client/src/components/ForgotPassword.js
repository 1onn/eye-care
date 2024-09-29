import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState('patient'); // Default to 'patient'

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/request-reset-password', { email, userType });
            alert('Reset email sent!');
        } catch (err) {
            console.error(err);
            alert('Error sending reset email');
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label>User Type:</label>
                <select value={userType} onChange={(e) => setUserType(e.target.value)} required>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="partner">Partner</option>
                </select>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default ForgotPassword;
