import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUser } from "../../services/userService";

const ProfilePreview = () => {
  const [profileImage, setProfileImage] = useState("");

  const [error, setError] = useState("");

  const userID = localStorage.getItem("userID");

  const baseURL = "http://localhost:8000/";

  useEffect(() => {
    const fetchUserProfilePicture = async () => {
      try {
        if (userID) {
          const userInfo = await getUser(userID);
          setProfileImage(baseURL + userInfo.profilePicture);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUserProfilePicture();
  }, [userID]);

  return (
    <div>
      <Link to="/profile">
        {profileImage && <img src={profileImage} alt="Profile" width="100" />}
      </Link>
      {error && <p>{error}</p>}
    </div>
  );
};

export default ProfilePreview;
