import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Eye, EyeOff, User, Lock, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../auth';
import './EditProfile.css';

const API_URL = "http://localhost:8082/api/users";

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    userId: '',
    profilePic: '../../../Pictures/mr-anonymous.png'
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [newUsername, setNewUsername] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(profileData.profilePic);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // Added missing activeTab state
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated()) {
        navigate('/login');
        return;
      }

      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found. Please log in again.');
        navigate('/login');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch user data');
        }

        const data = await response.json();
        setProfileData({
          username: data.username || '',
          userId: data.id.toString() || '',
          profilePic: profileData.profilePic
        });
        setNewUsername(data.username || '');
        setPreviewUrl(profileData.profilePic);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleUsernameSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (newUsername.length < 3) {
      setError('Username must be at least 3 characters long!');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/${profileData.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update username');
      }

      const data = await response.json();
      setProfileData(prev => ({
        ...prev,
        username: data.username
      }));
      setIsLoading(false);
      alert('Username updated successfully!');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match!');
      return;
    }
    if (passwords.newPassword.length < 6) {
      setError('New password must be at least 6 characters long!');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/${profileData.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          password: passwords.newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }

      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsLoading(false);
      alert('Password updated successfully!');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleProfilePicSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file first!');
      return;
    }
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setProfileData(prev => ({
        ...prev,
        profilePic: previewUrl
      }));
      setSelectedFile(null);
      setIsLoading(false);
      alert('Profile picture updated successfully!');
    }, 1000);
  };

  return (
    <div className="editprofile-container">
      <div className="editprofile-header">
        <button className="editprofile-back-button" onClick={() => window.history.back()}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="editprofile-title">Edit Profile</h1>
      </div>

      <div className="editprofile-content">
        <div className="editprofile-sidebar">
          <div className="editprofile-profile-preview">
            <img 
              src={previewUrl} 
              alt="Profile" 
              className="editprofile-image"
            />
            <div className="editprofile-user-info">
              <h3 className="editprofile-user-name">{isLoading ? 'Loading...' : profileData.username || 'No Username'}</h3>
              <p className="editprofile-user-id">ID: {isLoading ? 'Loading...' : profileData.userId || 'N/A'}</p>
            </div>
          </div>

          <nav className="editprofile-nav">
            <button 
              className={`editprofile-nav-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              Profile Info
            </button>
            <button 
              className={`editprofile-nav-button ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Lock size={18} />
              Security
            </button>
          </nav>
        </div>

        <div className="editprofile-main">
          {error && <div className="editprofile-error">{error}</div>}
          {activeTab === 'profile' && (
            <div className="editprofile-section">
              <h2 className="editprofile-section-title">Profile Information</h2>
              <div className="editprofile-form">
                <div className="editprofile-form-group">
                  <label className="editprofile-label">Username</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="editprofile-input"
                    required
                    minLength={3}
                    maxLength={20}
                    disabled={isLoading}
                  />
                </div>
                <button 
                  onClick={handleUsernameSubmit}
                  className={`editprofile-submit-button ${isLoading ? 'disabled' : ''}`}
                  disabled={isLoading}
                >
                  <Save size={18} />
                  {isLoading ? 'Updating...' : 'Update Username'}
                </button>
              </div>
              {/* <div className="editprofile-form">
                <div className="editprofile-form-group">
                  <label className="editprofile-label">Profile Picture</label>
                  <div className="editprofile-file-input-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="editprofile-file-input"
                      id="profile-pic-input"
                      disabled={isLoading}
                    />
                    <label htmlFor="profile-pic-input" className="editprofile-file-input-label">
                      <Camera size={18} />
                      Choose Image
                    </label>
                  </div>
                  {selectedFile && (
                    <p className="editprofile-file-name">Selected: {selectedFile.name}</p>
                  )}
                </div>
                <button 
                  onClick={handleProfilePicSubmit}
                  className={`editprofile-submit-button ${isLoading || !selectedFile ? 'disabled' : ''}`}
                  disabled={isLoading || !selectedFile}
                >
                  <Save size={18} />
                  {isLoading ? 'Uploading...' : 'Update Picture'}
                </button>
              </div> */}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="editprofile-section">
              <h2 className="editprofile-section-title">Change Password</h2>
              <div className="editprofile-form">
                <div className="editprofile-form-group">
                  <label className="editprofile-label">Current Password</label>
                  <div className="editprofile-password-wrapper">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwords.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className="editprofile-password-input"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="editprofile-eye-button"
                      disabled={isLoading}
                    >
                      {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="editprofile-form-group">
                  <label className="editprofile-label">New Password</label>
                  <div className="editprofile-password-wrapper">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwords.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className="editprofile-password-input"
                      required
                      minLength={6}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="editprofile-eye-button"
                      disabled={isLoading}
                    >
                      {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="editprofile-form-group">
                  <label className="editprofile-label">Confirm New Password</label>
                  <div className="editprofile-password-wrapper">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwords.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className="editprofile-password-input"
                      required
                      minLength={6}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="editprofile-eye-button"
                      disabled={isLoading}
                    >
                      {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handlePasswordSubmit}
                  className={`editprofile-submit-button ${isLoading ? 'disabled' : ''}`}
                  disabled={isLoading}
                >
                  <Save size={18} />
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;