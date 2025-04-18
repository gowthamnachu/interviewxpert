import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import QRCode from 'qrcode';
import './Certificate.css';
import { FaDownload, FaSpinner, FaSave, FaCheck } from 'react-icons/fa';
import { config } from '../config';

const Certificate = ({ userName, domain, score, date }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingError, setSavingError] = useState(null);
  const downloadSteps = [
    { id: 1, text: 'Generating Certificate...', icon: <FaSpinner className="spin" /> },
    { id: 2, text: 'Saving to Server...', icon: <FaSave /> },
    { id: 3, text: 'Preparing Download...', icon: <FaDownload /> },
    { id: 4, text: 'Complete', icon: <FaCheck /> }
  ];
  const [currentStep, setCurrentStep] = useState(0);

  const calculateBadgeLevel = (score) => {
    if (score >= 90) return 'Gold';
    if (score >= 75) return 'Silver';
    return 'Bronze';
  };

  const generateCertificate = async () => {
    setLoading(true);
    setError(null);
    setSaving(false);
    setSavingError(null);
    setCurrentStep(1);
    
    try {
      // Step 1: Generate Certificate
      setCurrentStep(1);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const decoded = JSON.parse(atob(token.split('.')[1]));
      const certificateId = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Step 2: Save to Server with retry mechanism
      setCurrentStep(2);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let retryCount = 0;
      let response;
      while (retryCount < 3) {
        try {
          response = await axios.post(`${config.apiUrl}/certificates`, {
        certificateId,
        userId: decoded.userId,
        userName,
        fullName: userName,
        domain,
        score,
        badgeLevel: calculateBadgeLevel(score),
        issueDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        validateStatus: function (status) {
          return status < 500;
        },
        timeout: 30000
      });
      break; // Success - exit retry loop
        } catch (err) {
          retryCount++;
          if (retryCount === 3) throw err; // Throw if all retries failed
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
        }
      }

      if (!response.data) {
        throw new Error('Failed to save certificate data');
      }

      // Step 3: Prepare Download
      setCurrentStep(3);
      await new Promise(resolve => setTimeout(resolve, 800));
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Save canvas background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 297, 210, 'F');
      
      // Add elegant header with gradient
      doc.setFillColor(248, 249, 250);
      doc.rect(0, 0, 297, 40, 'F');

      // Enhanced certificate design
      doc.setLineWidth(1.5);
      doc.setDrawColor(44, 122, 123);
      doc.rect(10, 10, 277, 190);
      
      // Add watermark
      doc.setFontSize(130);
      doc.setTextColor(245, 245, 245);
      doc.setFont('helvetica', 'bold');
      doc.text('VERIFIED', 148.5, 125, { align: 'center' });

      // Certificate content
      doc.setFontSize(42);
      doc.setTextColor(44, 122, 123);
      doc.text('Certificate of Excellence', 148.5, 45, { align: 'center' });

      // Adjust divider position
      doc.setLineWidth(0.5);
      doc.setDrawColor(44, 122, 123);
      doc.line(74, 52, 223, 52);

      // Adjust other text positions accordingly
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(16);
      doc.setTextColor(90, 90, 90);
      doc.text('This is to certify that', 148.5, 85, { align: 'center' });

      // Add username with premium styling
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.setTextColor(51, 51, 51);
      doc.text(userName.toUpperCase(), 148.5, 100, { align: 'center' });

      // Add domain expertise with enhanced formatting
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(16);
      doc.setTextColor(90, 90, 90);
      doc.text('has demonstrated exceptional proficiency in', 148.5, 115, { align: 'center' });
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(44, 122, 123);
      doc.text(domain, 148.5, 127, { align: 'center' });

      // Add badge level with icon
      doc.setFontSize(20);
      doc.setTextColor(44, 122, 123);
      const badgeLevel = calculateBadgeLevel(score);
      doc.text(`${badgeLevel} Level Achievement`, 148.5, 140, { align: 'center' });

      // Add score with elegant styling
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      doc.setTextColor(90, 90, 90);
      doc.text(`with an outstanding score of`, 148.5, 152, { align: 'center' });
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(44, 122, 123);
      doc.text(`${score}%`, 148.5, 164, { align: 'center' });

      // Add date with refined formatting
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(14);
      doc.setTextColor(90, 90, 90);
      doc.text(`Awarded on ${new Date(date).toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric'
      })}`, 148.5, 179, { align: 'center' });

      // Generate QR code data URL
      const verifyUrl = `https://interviewxpert.netlify.app/verify-certificate/${certificateId}`;
      const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 150,
        color: {
          dark: '#4C9D9B',
          light: '#ffffff'
        }
      });

      // Add QR code to PDF
      doc.addImage(qrCodeDataUrl, 'PNG', 240, 150, 30, 30);

      // Additional metadata
      doc.setFontSize(10);
      doc.setTextColor(90, 90, 90);
      doc.text(`Valid Until: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 40, 180);
      doc.text(`Certificate ID: ${certificateId}`, 40, 185);
      doc.text(`Verify at: https://interviewxpert.netlify.app/verify-certificate/${certificateId}`, 40, 190);

      // Step 4: Complete
      setCurrentStep(4);
      doc.save(`${userName.replace(/\s+/g, '_')}_certificate.pdf`);
      
      // Reset after delay
      setTimeout(() => {
        setCurrentStep(0);
      }, 2000);

    } catch (error) {
      console.error('Certificate generation error:', error);
      const errorMessage = error.response?.data?.error || error.message;
      if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (error.response?.status === 503 || error.response?.status === 429) {
        setError('Server is temporarily unavailable. Please try again in a few minutes.');
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timed out. Please check your connection and try again.');
      } else {
        setError(`Failed to generate certificate: ${errorMessage}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="certificate-container">
      {error && <div className="error-message">{error}</div>}
      {savingError && <div className="error-message">Server Error: {savingError}</div>}
      
      <button 
        className="download-certificate-btn" 
        onClick={generateCertificate}
        disabled={loading || saving}
      >
        {loading ? 'Processing...' : 'Download Certificate'}
      </button>

      {currentStep > 0 && (
        <div className="download-steps">
          {downloadSteps.map((step) => (
            <div
              key={step.id}
              className={`step ${currentStep >= step.id ? 'active' : ''} 
                         ${currentStep > step.id ? 'completed' : ''}`}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-text">{step.text}</div>
              <div className="step-loader"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificate;