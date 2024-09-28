import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CSS/Selection.css";
import Heading from "./Heading";

function Selection() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role");

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <Heading />
      <div className="container">
        <button
          className="button"
          onClick={() => handleNavigation(`/login/${role}`)}
        >
          Login
        </button>
        <h1>or</h1>
        <button
          className="button"
          onClick={() => handleNavigation(`/signup/${role}`)}
        >
          Sign Up
        </button>
        
      </div>
    </div>
  );
}

export default Selection;
