import React, { useState } from "react";
import { Link } from "react-router-dom"; // Make sure this import is included
import "./CSS/Heading.css";
import logo from "./Images/Landing page logo.svg";

function Heading() {
  const [isContact, setIsContact] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
            Login/SignUp
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/Selection?role=patient" className="dropdown-item">Patient</Link>
              <Link to="/Selection?role=doctor" className="dropdown-item">Doctor</Link>
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
          <Link to="/">Doctors</Link>
          <Link to="/">Scan Reader</Link>
          <Link to="/">Exercises</Link>
          <Link to="/">Blogs</Link>
          <Link to="/about">About Us</Link>
          <Link to="/">Store</Link>
        </nav>
      </div>
    </header>
  );
}

export default Heading;
