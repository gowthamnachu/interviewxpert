import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      const response = await fetch("http://localhost:3001/api/resume", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch resume');
      }

      const data = await response.json();
      console.log("Resume data received:", !!data.pdfData); // Debug log
      if (data && data.pdfData) {
        setResume(data);
      } else {
        setError("No PDF data found in resume");
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:3001/api/certificates/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCertificates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]);
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
      const response = await fetch(`http://localhost:3001/api/certificates/${certId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setCertificates(certificates.filter(cert => cert._id !== certId));
        setMessage('Certificate deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to delete certificate');
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
      setMessage('Error deleting certificate');
      setTimeout(() => setMessage(''), 3000);
    }
  };

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

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
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
                <div className="certificates-grid">
                  {Array.isArray(certificates) && certificates.length > 0 ? (
                    certificates.map((cert) => (
                      <div key={cert.certificateId} className="certificate-card">
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
