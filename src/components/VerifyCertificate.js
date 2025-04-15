import React, { useState } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import './VerifyCertificate.css';

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState('');
  const [certificateData, setCertificateData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault(); // Prevent form submission refresh
    if (!certificateId.trim()) {
      setError('Please enter a certificate ID');
      return;
    }

    setLoading(true);
    setError('');
    setCertificateData(null);

    try {
      const response = await axios.get(
        `http://localhost:3001/api/certificates/verify/${encodeURIComponent(certificateId.trim())}`,
        {
          validateStatus: function (status) {
            return status < 500; // Resolve only if status is less than 500
          }
        }
      );

      if (response.status === 404) {
        setError('Certificate not found. Please check the ID and try again.');
        return;
      }

      if (response.status === 200 && response.data) {
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
      } else {
        setError('Invalid certificate data received');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to verify certificate. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

      {error && <div className="error-message">{error}</div>}

      {certificateData && (
        <div className="certificate-details">
          <div className="verification-badge">
            <span className="badge-icon">✓</span>
            <span>Certificate Verified</span>
          </div>
          <div className="details-grid">
            <div className="detail-item">
              <label>Full Name:</label>
              <span>{certificateData.fullName}</span>
            </div>
            <div className="detail-item">
              <label>Username:</label>
              <span>{certificateData.userName}</span>
            </div>
            <div className="detail-item">
              <label>Domain:</label>
              <span>{certificateData.domain}</span>
            </div>
            <div className="detail-item">
              <label>Score:</label>
              <span>{certificateData.score}%</span>
            </div>
            <div className="detail-item">
              <label>Issue Date:</label>
              <span>{new Date(certificateData.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;
