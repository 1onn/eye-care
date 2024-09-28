import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/PartnerDashboard.css";
import Footer from "../Footer";
import PartnerHeading from "../PartnerHeading";

function PartnerDashboard() {
  const [partner, setPartner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login/partner");
      return;
    }

    const fetchPartnerData = async () => {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Partner not authenticated");
        }

        const data = await response.json();
        setPartner(data);
      } catch (error) {
        console.error("Error fetching partner data:", error);
        navigate("/login/partner");
      }
    };

    fetchPartnerData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login/partner");
  };

  if (!partner) {
    return null; // Handle loading state or redirect if necessary
  }

  return (
    <div className="PartnerDash-page-container">
      <PartnerHeading user={partner} onLogout={handleLogout} />
      <div className="PartnerDash-container-home">
        <div>
          <div className="PartnerDash-container">
            <h1 className="PartnerDash-container-Heading">Welcome, {partner.owner_name} to your Store</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerDashboard;
