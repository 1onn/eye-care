import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/DoctorDashboard.css";
import Footer from "../Footer";
import DoctorHeading from "../DoctorHeading";

function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login/doctor");
      return;
    }

    const fetchDoctorData = async () => {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Doctor not authenticated");
        }

        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        navigate("/login/doctor");
      }
    };

    fetchDoctorData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login/doctor");
  };

  if (!doctor) {
    navigate("/");
    return null;
  }

  return (
    <div className="DocDash-page-container">
      <DoctorHeading user={doctor} onLogout={handleLogout} />
      <div className="DocDash-container-home">
        <div>
          <div className="DocDash-container">
            <h1 className="DocDash-container-Heading">Welcome, Dr. {doctor.name}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
