import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Ensure this import is included
import "./CSS/Heading.css";
import logo from "./Images/Landing page logo.svg";

function DoctorHeading({ user, onLogout }) {
  const [isContact, setIsContact] = React.useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsContact(!isContact);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/login/doctor");
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="dropdown">
          <button className="dropdown-toggle header-button" onClick={toggleDropdown}>
            {user ? `Dr. ${user.name}` : 'Loading...'}
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/dashboard/doctor/viewprofile" className="dropdown-item">View Profile</Link>
              <button className="dropdown-item" onClick={handleLogout}>Log Out</button>
            </div>
          )}
        </div>

        <div className="header-Logo-container">
          <img src={logo} alt="Logo" className="header-img" />
        </div>

        <button className="header-button header-button-right" onClick={handleClick}>
          {isContact ? 'Contact Us' : '0900-78601'}
        </button>
      </div>

      <div className="header-bottom">
        <nav className="header-nav">
          <Link to="/dashboard/doctor/viewprofile">View Profile</Link>
          <Link to="/dashboard/doctor/viewappointment">View Appointments</Link>
          <Link to="/dashboard/doctor/exercises">Exercises</Link>
          <Link to="/dashboard/doctor/blogs">Blogs</Link>
          <Link to="/">Store</Link>
        </nav>
      </div>
    </header>
  );
}

export default DoctorHeading;
