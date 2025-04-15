import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import './Certificate.css';

const Certificate = ({ userName, domain, score, date }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateCertificate = async () => {
    setLoading(true);
    setError(null);
    const certificateId = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    try {
      // Generate PDF first
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

      // Add decorative border
      doc.setLineWidth(1.5);
      doc.setDrawColor(44, 122, 123);
      doc.rect(10, 10, 277, 190);
      doc.setLineWidth(0.5);
      doc.rect(12, 12, 273, 186);

      // Remove logo section and readjust title positioning
      doc.setFont('helvetica', 'bold');
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

      // Add score with elegant styling
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      doc.setTextColor(90, 90, 90);
      doc.text(`with an outstanding score of`, 148.5, 140, { align: 'center' });
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(44, 122, 123);
      doc.text(`${score}%`, 148.5, 152, { align: 'center' });

      // Add date with refined formatting
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(14);
      doc.setTextColor(90, 90, 90);
      doc.text(`Awarded on ${new Date(date).toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric'
      })}`, 148.5, 167, { align: 'center' });

      // Update verification text
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(`Verify at: http://localhost:3000/verify-certificate`, 148.5, 185, { align: 'center' });
      doc.text(`Certificate ID: ${certificateId}`, 148.5, 190, { align: 'center' });

      // Save to backend
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded.userId;

      await axios.post('http://localhost:3001/api/certificates', {
        certificateId,
        userId,
        userName,
        fullName: userName,
        domain,
        score,
        date,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Only save PDF if backend save was successful
      doc.save(`${userName.replace(/\s+/g, '_')}_certificate.pdf`);
    } catch (error) {
      console.error('Error generating certificate:', error);
      setError(error?.response?.data?.error || error.message || 'Failed to generate certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="certificate-container">
      {error && <div className="error-message">{error}</div>}
      <button 
        className="download-certificate-btn" 
        onClick={generateCertificate}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Download Certificate'}
      </button>
    </div>
  );
};

export default Certificate;