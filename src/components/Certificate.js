import React from 'react';
import { jsPDF } from 'jspdf';
import './Certificate.css';

const Certificate = ({ userName, domain, score, date }) => {
  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Set clean background with gradient
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 297, 210, 'F');
    
    // Add subtle gradient header
    doc.setFillColor(240, 240, 245);
    doc.rect(0, 0, 297, 40, 'F');

    // Add simple border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 277, 190);

    // Add minimal decorative line
    doc.setLineWidth(0.3);
    doc.line(30, 65, 267, 65);

    // Add circular logo watermark
    const logoImg = new Image();
    logoImg.src = '/images/logo192.png';
    doc.addImage(logoImg, 'PNG', 118.5, 75, 60, 60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(80);
    doc.setTextColor(200, 200, 200);
    doc.text('InterviewXpert', 148.5, 105, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    // Add certificate title with shadow effect
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(42);
    doc.setTextColor(0, 0, 0);
    doc.text('Certificate of Excellence', 148.5, 50, { align: 'center' });

    // Add elegant divider
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(74, 65, 223, 65);

    // Add certificate text with enhanced styling
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('This is to certify that', 148.5, 80, { align: 'center' });

    // Add username with premium styling
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.setTextColor(0, 0, 0);
    doc.text(userName.toUpperCase(), 148.5, 95, { align: 'center' });

    // Add professional title
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text('Software Development Professional', 148.5, 110, { align: 'center' });

    // Add completion text with domain expertise
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `has demonstrated exceptional proficiency in ${domain}\nby successfully completing the Advanced Mock Assessment\nwith an outstanding score of ${score}%`,
      148.5,
      130,
      { align: 'center' }
    );

    // Add achievement level with premium styling
    const achievementLevel = score >= 90 ? 'Distinction' : score >= 80 ? 'Merit' : 'Pass';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text(`Achievement Level: ${achievementLevel}`, 148.5, 155, { align: 'center' });

    // Add date with elegant formatting
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Awarded on ${new Date(date).toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    })}`, 148.5, 170, { align: 'center' });

    // Add unique certificate ID and verification info
    const certificateId = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Certificate ID: ${certificateId}`, 148.5, 185, { align: 'center' });
    doc.text('Verify this certificate at verify.interviewxpert.com', 148.5, 192, { align: 'center' });

    // Save the PDF
    doc.save(`${userName.replace(/\s+/g, '_')}_certificate.pdf`);
  };

  return (
    <div className="certificate-container">
      <button className="download-certificate-btn" onClick={generateCertificate}>
        Download Certificate
      </button>
    </div>
  );
};

export default Certificate;