import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { config } from '../config';
import "./ProfilePage.css";
import { FaUser, FaEnvelope, FaCalendar, FaCertificate, FaTrash, FaDownload, FaEdit } from "react-icons/fa";

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

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${config.apiUrl}/certificates/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch certificates');
      }

      setCertificates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Certificate fetch error:', error);
      setError(error.message);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Check token validity
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !tokenExpiry || new Date().getTime() > parseInt(tokenExpiry)) {
      // Token is missing or expired
      localStorage.clear();
      navigate("/login");
      return;
    }

    if (!localStorage.getItem("isLoggedIn")) {
      navigate("/login");
      return;
    }

    fetchResume();
    fetchCertificates();
  }, [navigate, fetchCertificates]);

  const fetchResume = async () => {
    try {
      setLoading(true);
      setLoadingState('Fetching resume data...');
      setError(null);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${config.apiUrl}/resume`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch resume');
      }

      setLoadingState('Processing resume information...');
      if (data && data.pdfData) {
        setResume(data);
        setLoadingState('Resume loaded successfully!');
      } else {
        setResume(null);
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
      setError(error.message);
      setResume(null);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setLoadingState('');
      }, 500);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("resumeData");
    navigate("/login");
  };

  const handleDownloadResume = async () => {
    try {
      if (!navigator.onLine) {
        throw new Error('Please check your internet connection');
      }

      if (!resume?.pdfData) {
        throw new Error('No PDF data found');
      }

      // Clean and validate the base64 data
      let base64Data = resume.pdfData;
      if (base64Data.includes(',')) {
        base64Data = base64Data.split(',')[1];
      }
      if (!base64Data) {
        throw new Error('Invalid PDF data format');
      }

      try {
        // Create blob from base64
        const binaryData = atob(base64Data);
        const byteNumbers = new Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          byteNumbers[i] = binaryData.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Create and trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${resume.name || 'resume'}.pdf`;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
      } catch (e) {
        console.error('PDF decode error:', e);
        throw new Error('Invalid PDF format');
      }

    } catch (error) {
      console.error('Resume download error:', error);
      setError(`Failed to download resume: ${error.message}`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteResume = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${config.apiUrl}/resume`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete resume');
      }

      setResume(null);
      setMessage("Resume deleted successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Resume deletion error:", error);
      setError(`Failed to delete resume: ${error.message}`);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleEditResume = () => {
    try {
      if (!resume) {
        throw new Error('No resume data available');
      }
      navigate('/build-resume', { 
        state: { 
          isEditing: true, 
          resumeData: resume
        } 
      });
    } catch (error) {
      console.error('Resume edit error:', error);
      setError('Failed to edit resume');
    }
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

  const renderResumeSection = () => (
    <div className="profile-section resume-section">
      <h3>My Resume</h3>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading-spinner">Loading resume...</div>
      ) : resume ? (
        <div className="resume-actions">
          <button 
            className="action-btn download" 
            onClick={handleDownloadResume}
            disabled={!navigator.onLine}
          >
            <FaDownload /> Download Resume
          </button>
          <button className="action-btn edit" onClick={handleEditResume}>
            <FaEdit /> Edit Resume
          </button>
          <button className="action-btn delete" onClick={handleDeleteResume}>
            <FaTrash /> Delete Resume
          </button>
        </div>
      ) : (
        <div className="no-resume">
          <p>No resume found</p>
          <button onClick={() => navigate('/build-resume')}>Create Resume</button>
        </div>
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

            {activeTab === 'resume' && renderResumeSection()}

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
