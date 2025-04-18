import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { config } from '../config';
import "./ProfilePage.css";
import { FaUser, FaEnvelope, FaCalendar, FaFileAlt, FaCertificate, FaTrash } from "react-icons/fa";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loadingState, setLoadingState] = useState('');

  const username = localStorage.getItem("userUsername");
  const email = localStorage.getItem("userEmail");
  const registrationDate = localStorage.getItem("registrationDate");
  const formattedRegistrationDate = new Date(registrationDate).toLocaleDateString("en-GB");

  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      navigate("/login");
    }
    fetchResume();
    fetchCertificates();
  }, [navigate]);

  const fetchResume = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      console.log("Fetching resume...");

      const response = await fetch(`${config.apiUrl}/resume`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log("Resume data received:", !!data);
      if (data && data.pdfData) {
        setResume(data);
      } else {
        console.log("No resume data found");
        setResume(null);
      }
    } catch (error) {
      console.error("Resume fetch error:", error);
      setError(`Failed to load resume: ${error.message}`);
      setResume(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      console.log('Fetching certificates...');
      
      const response = await fetch(`${config.apiUrl}/certificates/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log('Certificates received:', data);
      setCertificates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Certificate fetch error:', error);
      setError(`Failed to load certificates: ${error.message}`);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("resumeData");
    navigate("/login");
  };

  const handleDownloadResume = () => {
    if (resume?.pdfData) {
      const link = document.createElement('a');
      link.href = resume.pdfData;
      link.download = `${resume.name || 'resume'}.pdf`;
      link.click();
    }
  };

  const handleDeleteResume = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/resume", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setResume(null);
        setMessage("Resume deleted successfully");
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error("Failed to delete resume");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      setMessage("Failed to delete resume");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleEditResume = () => {
    navigate('/build-resume', { state: { isEditing: true, resumeData: resume } });
  };

  const handleDeleteCertificate = async (certId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${config.apiUrl}/certificates/${certId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete certificate');
      }

      setCertificates(certificates.filter(cert => cert._id !== certId));
      setMessage('Certificate deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting certificate:', error);
      setError('Failed to delete certificate');
      setTimeout(() => setError(''), 3000);
    }
  };

  const renderLoading = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">{loadingState}</div>
      <div className="loading-progress">
        <div className="loading-progress-bar"></div>
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="certificates-grid">
      {error ? (
        <div className="error-message">{error}</div>
      ) : loading ? (
        <div className="loading-spinner">Loading certificates...</div>
      ) : certificates.length > 0 ? (
        certificates.map((cert) => (
          <div key={cert._id || cert.certificateId} className="certificate-card">
            <FaCertificate className="certificate-icon" />
            <div className="certificate-info">
              <h4>{cert.domain}</h4>
              <p>Score: {cert.score}%</p>
              <p>Date: {new Date(cert.date).toLocaleDateString()}</p>
              <p className="certificate-id">ID: {cert.certificateId}</p>
              <button 
                className="delete-btn"
                onClick={() => handleDeleteCertificate(cert._id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No certificates found</p>
      )}
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {username?.charAt(0).toUpperCase()}
            </div>
          </div>
          <h2>Welcome, {username}!</h2>
          <div className="profile-tabs">
            <button 
              className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`tab ${activeTab === 'resume' ? 'active' : ''}`}
              onClick={() => setActiveTab('resume')}
            >
              Resume
            </button>
            <button 
              className={`tab ${activeTab === 'certificates' ? 'active' : ''}`}
              onClick={() => setActiveTab('certificates')}
            >
              Certificates
            </button>
          </div>
        </div>

        {message && <div className="message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {loading ? renderLoading() : (
          <>
            {activeTab === 'profile' && (
              <div className="profile-section profile-info">
                <h3>Account Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <FaUser className="info-icon" />
                    <div className="info-content">
                      <strong>Username</strong>
                      <span>{username}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaEnvelope className="info-icon" />
                    <div className="info-content">
                      <strong>Email</strong>
                      <span>{email}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <FaCalendar className="info-icon" />
                    <div className="info-content">
                      <strong>Member Since</strong>
                      <span>{formattedRegistrationDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'resume' && (
              <div className="profile-section resume-section">
                <h3>Resume Management</h3>
                {resume ? (
                  <>
                    <div className="resume-preview">
                      <div className="resume-header">
                        <FaFileAlt className="resume-icon" />
                        <div className="resume-info">
                          <h4>Your Resume</h4>
                          <p>Last updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="resume-actions">
                        <button className="profile-button primary-button" onClick={handleEditResume}>
                          Edit Resume
                        </button>
                        <button className="profile-button primary-button" onClick={handleDownloadResume}>
                          Download Resume
                        </button>
                        <button className="profile-button danger-button" onClick={handleDeleteResume}>
                          Delete Resume
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="no-resume">
                    <FaFileAlt className="no-resume-icon" />
                    <p>No resume found. Create your professional resume now!</p>
                    <button className="profile-button primary-button" onClick={() => navigate("/build-resume")}>
                      Create Resume
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="profile-section">
                <h3>My Certificates</h3>
                {renderCertificates()}
              </div>
            )}
          </>
        )}

        <div className="profile-actions">
          <button className="profile-button danger-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
