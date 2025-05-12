import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getUser, updateUser, updateUserProfilePicture, deleteUser } from '../../services/userService';
import Modal from '../common/Modal';
import EditProfileForm from './EditProfileForm';
import "../../styles/Profile.css";
import DefaultIcon from '../../assets/default.png';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const userID = localStorage.getItem('userID');
  const baseURL = "http://localhost:8000/";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userID) {
          const userInfo = await getUser(userID);
          setUser(userInfo);
          setFormData(userInfo);
          if (userInfo.profilePicture) {
            setProfileImage(baseURL + userInfo.profilePicture);
          } else {
            setProfileImage(DefaultIcon);
          }
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUserData();
  }, [userID, token]);

  const handleLogout = async () => {
    try {
      logout();
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);

  const handleOpenInbox = () => {
    navigate('/inbox'); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profilePicture: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    if (file) reader.readAsDataURL(file);
    if (!file) {
      setProfileImage(DefaultIcon);
      return;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.profilePicture instanceof File) {
        const profilePictureResponse = await updateUserProfilePicture(userID, formData.profilePicture);
        formData.profilePicture = profilePictureResponse.profilePicture;
        setProfileImage(baseURL + profilePictureResponse.profilePicture);
      }
      await updateUser(userID, formData);
      setUser(formData);
      toggleEditModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(userID);
      logout();
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h1 className="profile-header">Profilo</h1>

        <div className="profile-details">
          <h2 className="profile-name">{user?.name}</h2>
          {profileImage && <img
            src={profileImage || DefaultIcon}
            alt="Profile"
            className="profile-image"
          />}
          <p className="profile-info"><strong>Email:</strong> {user?.email}</p>
          <p className="profile-info"><strong>Bio:</strong> {user?.bio}</p>
          <p className="profile-info"><strong>Compleanno:</strong> {user?.birthday}</p>
          <p className="profile-info"><strong>Sesso:</strong> {user?.sex === "prefer not to say" ? "Non specificato" : user?.sex}</p>
        </div>

        <div className="profile-actions">
          <button className="primary" onClick={toggleEditModal}>Modifica</button>
          
          <button className="tertiary" onClick={handleOpenInbox}>Apri Inbox</button>
          
          <button className="secondary" onClick={handleLogout}>Logout</button>

          <button className="danger" onClick={handleDelete}>Elimina profilo</button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <Modal isOpen={isEditModalOpen} onClose={toggleEditModal} title="Modifica Profilo" zIndex={1000}>
          <EditProfileForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            handleFormSubmit={handleFormSubmit}
            onCancel={toggleEditModal}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Profile;
