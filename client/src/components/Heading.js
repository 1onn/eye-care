import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate for redirection on logout
import "./CSS/Heading.css";
import logo from "./Images/Landing page logo.svg";

function Heading() {
  const [isContact, setIsContact] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // To handle navigation on logout

  useEffect(() => {
    // Check if user info is stored in localStorage and set user state
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Clear local storage and user state, then redirect to homepage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate("/");
  };

  const handleClick = () => {
    setIsContact(!isContact);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="dropdown">
          <button className="dropdown-toggle header-button" onClick={toggleDropdown}>
            {user ? `${user.fname} ${user.lname}` : 'Login/SignUp'}
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {user ? (
                <>
                  <Link to="/dashboard/patient/viewprofile" className="dropdown-item">View Profile</Link>
                  <button className="dropdown-item" onClick={handleLogout}>Log Out</button>
                </>
              ) : (
                <>
                  <Link to="/Selection?role=patient" className="dropdown-item">Patient</Link>
                  <Link to="/Selection?role=doctor" className="dropdown-item">Doctor</Link>
                  <Link to="/Selection?role=partner" className="dropdown-item">Partner</Link>
                </>
              )}
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
          <Link to="/doctors">Doctors</Link>
          <Link to="/">Scan Reader</Link>
          <Link to="/eyeexercise">Exercises</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/about">About Us</Link>
          <Link to="/">Store</Link>
        </nav>
      </div>
    </header>
  );
}

export default Heading;
