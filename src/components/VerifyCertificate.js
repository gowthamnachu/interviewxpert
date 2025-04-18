import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import './VerifyCertificate.css';
import { config } from '../config';

const VerifyCertificate = () => {
  const { certificateId: urlCertificateId } = useParams();
  const [certificateId, setCertificateId] = useState('');
  const [certificateData, setCertificateData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [loadingSteps] = useState([
    { id: 1, text: 'Connecting to server...', icon: '🔄' },
    { id: 2, text: 'Verifying certificate...', icon: '🔍' },
    { id: 3, text: 'Fetching details...', icon: '📋' },
    { id: 4, text: 'Validating authenticity...', icon: '🔐' }
  ]);

  const handleVerify = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!certificateId.trim()) {
      setError('Please enter a certificate ID');
      return;
    }

    setLoading(true);
    setError('');
    setCertificateData(null);
    setVerificationStep(1);

    try {
      // Step 1: Server connection
      setVerificationStep(1);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 2: Certificate verification
      setVerificationStep(2);
      const response = await axios.get(
        `${config.apiUrl}/certificates/verify/${encodeURIComponent(certificateId.trim())}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          validateStatus: function (status) {
            return status < 500;
          },
          timeout: 30000 // Increased timeout to 30 seconds
        }
      );

      console.log('Verification Response:', response); // Debug log

      if (response.status === 404) {
        setError('Certificate not found. Please check the ID and try again.');
        return;
      }

      if (response.status !== 200 || !response.data) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      // Step 3: Fetch details
      setVerificationStep(3);
      await new Promise(resolve => setTimeout(resolve, 800));

      if (!response.data.certificateId) {
        throw new Error('Invalid certificate data received');
      }

      // Step 4: Validation complete
      setVerificationStep(4);
      await new Promise(resolve => setTimeout(resolve, 500));

      setCertificateData(response.data);
      const duration = 5000;
      const end = Date.now() + duration;
      const colors = [
        '#4C9D9B', '#38b2ac', '#2ecc71', '#ffffff', 
        '#90EE90', '#00CED1', '#48D1CC', '#gold', '#E6F3FF'
      ];

      // Professional celebration sequence
      const fireProfessionalCelebration = () => {
        // Initial elegant burst
        confetti({
          particleCount: 150,
          spread: 360,
          origin: { y: 0.5, x: 0.5 },
          colors: colors,
          startVelocity: 45,
          gravity: 0.8,
          scalar: 1.2,
          drift: 0.1,
          ticks: 400,
          shapes: ['circle', 'square']
        });

        // Orchestrated side bursts
        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.4 },
            colors: colors,
            startVelocity: 45,
            gravity: 0.8,
            scalar: 1.1,
            drift: 0.1,
            shapes: ['circle']
          });

          confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.4 },
            colors: colors,
            startVelocity: 45,
            gravity: 0.8,
            scalar: 1.1,
            drift: 0.1,
            shapes: ['circle']
          });
        }, 250);
      };

      // Initial celebration
      fireProfessionalCelebration();

      // Elegant continuous animation
      (function frame() {
        const timeLeft = end - Date.now();
        if (timeLeft <= 0) return;

        // Subtle background effects
        if (timeLeft % 300 < 10) {
          confetti({
            particleCount: 15,
            spread: 70,
            origin: { x: Math.random(), y: 0 },
            colors: colors,
            startVelocity: 30,
            gravity: 0.6,
            scalar: 0.9,
            drift: 0.2,
            shapes: ['circle']
          });
        }

        // Graceful side accents
        if (timeLeft % 600 < 10) {
          confetti({
            particleCount: 10,
            angle: 60,
            spread: 50,
            origin: { x: 0, y: 0.2 },
            colors: colors,
            startVelocity: 35,
            gravity: 0.5,
            scalar: 0.8,
            drift: 0.1
          });

          confetti({
            particleCount: 10,
            angle: 120,
            spread: 50,
            origin: { x: 1, y: 0.2 },
            colors: colors,
            startVelocity: 35,
            gravity: 0.5,
            scalar: 0.8,
            drift: 0.1
          });
        }

        requestAnimationFrame(frame);
      }());

      // Elegant finale
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.6, x: 0.5 },
          colors: colors,
          startVelocity: 35,
          gravity: 0.7,
          scalar: 1.1,
          drift: 0.1,
          shapes: ['circle', 'square'],
          ticks: 300
        });
      }, duration - 500);
    } catch (err) {
      console.error('Verification error details:', {
        message: err.message,
        response: err.response,
        stack: err.stack
      });
      
      if (err.response) {
        setError(`Verification failed: ${err.response.data?.error || err.response.statusText}`);
      } else if (err.request) {
        setError('Unable to reach verification server. Please check your connection.');
      } else {
        setError(`Verification error: ${err.message}`);
      }
    } finally {
      setLoading(false);
      setVerificationStep(0);
    }
  }, [certificateId]);

  useEffect(() => {
    if (urlCertificateId) {
      setCertificateId(urlCertificateId);
      handleVerify();
    }
  }, [urlCertificateId, handleVerify]);

  return (
    <div className="verify-container">
      <h2>Verify Certificate</h2>
      <form className="verify-form" onSubmit={handleVerify}>
        <input
          type="text"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
          placeholder="Enter Certificate ID (e.g., CERT-XXXXX)"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      {loading && (
        <div className="verification-steps">
          {loadingSteps.map((step) => (
            <div
              key={step.id}
              className={`step ${verificationStep >= step.id ? 'active' : ''} 
                         ${verificationStep > step.id ? 'completed' : ''}`}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-text">{step.text}</div>
              <div className="step-loader"></div>
            </div>
          ))}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {certificateData && (
        <div className="certificate-details">
          <div className="verification-badge">
            <span className="badge-icon">✓</span>
            <span>Certificate Verified - {certificateData.badgeLevel} Level</span>
          </div>
          <div className="details-grid">
            <div className="detail-item">
              <label>Full Name:</label>
              <span>{certificateData.fullName}</span>
            </div>
            <div className="detail-item">
              <label>Domain:</label>
              <span>{certificateData.domain}</span>
            </div>
            <div className="detail-item">
              <label>Score & Grade:</label>
              <span>{certificateData.score}% - Grade {certificateData.grade}</span>
            </div>
            <div className="detail-item">
              <label>Issue Date:</label>
              <span>{new Date(certificateData.issueDate).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <label>Valid Until:</label>
              <span>{new Date(certificateData.expiryDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;
