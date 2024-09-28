import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/ViewProfile.css";
import PHeading from "./PartnerHeading";

function PartnerViewProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login/partner");
        return;
      }
      try {
        const response = await fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUser(data);
        setFormData(data);
        
        if (data.profile_pic) {
          const imageResponse = await fetch(`/api/partner/profile-pic/${data.partner_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const imageBlob = await imageResponse.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfilePic(reader.result);
          };
          reader.readAsDataURL(imageBlob);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login/partner");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch("/api/updatePartnerProfile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditMode(false);
      } else {
        console.error("Error updating profile:", await response.json());
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) return null;

  return (
    <div>
      <PHeading user={user} />
      <div className='profile-background'>
        <div className="profile-container">
          <div className="profile-header">
            {profilePic ? (
              <img src={profilePic} alt="Profile Picture" className="profile-pic" />
            ) : (
              <img src="/path/to/default/profile/picture.jpg" alt="Profile Picture" className="profile-pic" />
            )}
            <div className="profile-info">
              {editMode ? (
                <>
                  <input type="file" name="profile_pic" onChange={handleFileChange} />
                  <input type="text" name="store_name" value={formData.store_name} className="Partner-input" onChange={handleChange} />
                  <input type="text" name="store_phoneno" value={formData.store_phoneno} className="Partner-input" onChange={handleChange} />
                  <input type="text" name="owner_name" value={formData.owner_name} className="Partner-input" onChange={handleChange} />
                  <input type="text" name="owner_phoneno" value={formData.owner_phoneno} className="Partner-input" onChange={handleChange} />
                  <input type="text" name="store_address" value={formData.store_address} className="Partner-input" onChange={handleChange} />
                  <input type="text" name="cnic" value={formData.cnic} className="Partner-input" onChange={handleChange} />
                  <input type="email" name="email" value={formData.email} className="Partner-input" onChange={handleChange} />
                  <input type="password" name="password" placeholder="New Password" className="Partner-input" onChange={handleChange} />
                  <input type="password" name="passwordConfirm" placeholder="Confirm Password" className="Partner-input" onChange={handleChange} />
                  <input type="file" name="SECP_certificate_pic" onChange={handleFileChange} />
                </>
              ) : (
                <>
                  <h2>{`${user.store_name}`}</h2>
                  <p><b>Store Phone No:</b> {user.store_phoneno}</p>
                  <p><b>Owner Name:</b> {user.owner_name}</p>
                  <p><b>Owner Phone No:</b> {user.owner_phoneno}</p>
                  <p><b>Store Address:</b> {user.store_address}</p>
                  <p><b>Email:</b> {user.email}</p>
                </>
              )}
            </div>
          </div>
          <button onClick={() => setEditMode(!editMode)} className="edit-button">{editMode ? "Cancel" : "Edit"}</button>
          {editMode && <button onClick={handleSave} className="save-button">Save</button>}
          <hr />
          <div className="profile-details">
            <div className="section">
              <h3 className="about-section">Store Description</h3>
              {editMode ? (
                <textarea name="description" value={formData.description} className="Partner-description" onChange={handleChange}></textarea>
              ) : (
                <p >{user.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerViewProfile;
