import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null); // State for resume data

  // Retrieve user data from localStorage
  const username = localStorage.getItem("userUsername");
  const email = localStorage.getItem("userEmail");
  const registrationDate = localStorage.getItem("registrationDate");

  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      navigate("/login"); // If not logged in, redirect to login page
    }

    // Get resume data from localStorage if it exists
    const storedResume = localStorage.getItem("resumeData");
    if (storedResume) {
      setResume(JSON.parse(storedResume));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("resumeData"); // Optionally clear resume on logout
    navigate("/login");
  };

  const handleDownloadResume = () => {
    const doc = new jsPDF();

    // Add the profile picture if it exists
    if (resume && resume.photo) {
      doc.addImage(resume.photo, "JPEG", 15, 15, 50, 50); // Image position and size
    }

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Resume", 70, 20); // Title

    // Personal Information Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Name: ", 20, 60);
    doc.setFontSize(12);
    doc.text(resume?.name || "Not Available", 40, 60);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Email: ", 20, 70);
    doc.setFontSize(12);
    doc.text(resume?.email || "Not Available", 40, 70);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Phone: ", 20, 80);
    doc.setFontSize(12);
    doc.text(resume?.phone || "Not Available", 40, 80);

    // Divider line
    doc.setLineWidth(0.5);
    doc.line(20, 85, 190, 85);

    // Add Summary Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Summary:", 20, 95);
    doc.setFontSize(12);
    // Correctly pass maxWidth inside the options object
    doc.text(resume?.summary || "Not Available", 20, 105, { maxWidth: 180 });

    // Divider line
    doc.line(20, 115, 190, 115);

    // Add Education Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Education:", 20, 125);
    doc.setFontSize(12);
    doc.text(resume?.education || "Not Available", 20, 135, { maxWidth: 180 });

    // Divider line
    doc.line(20, 145, 190, 145);

    // Add Work Experience Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Work Experience:", 20, 155);
    doc.setFontSize(12);
    doc.text(resume?.experience || "Not Available", 20, 165, { maxWidth: 180 });

    // Divider line
    doc.line(20, 175, 190, 175);

    // Add Skills Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Skills:", 20, 185);
    doc.setFontSize(12);
    doc.text(resume?.skills || "Not Available", 20, 195, { maxWidth: 180 });

    // Divider line
    doc.line(20, 205, 190, 205);

    // Add Languages Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Languages:", 20, 215);
    doc.setFontSize(12);
    doc.text(resume?.languages || "Not Available", 20, 225, { maxWidth: 180 });

    // Divider line
    doc.line(20, 235, 190, 235);

    // Add Volunteer Experience Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Volunteer Experience:", 20, 245);
    doc.setFontSize(12);
    doc.text(resume?.volunteerExperience || "Not Available", 20, 255, { maxWidth: 180 });

    // Divider line
    doc.line(20, 265, 190, 265);

    // Check if content exceeds page height and add page break if necessary
    const pageHeight = doc.internal.pageSize.height;
    const currentY = doc.y; // Get current vertical position
    if (currentY > pageHeight - 20) {
      doc.addPage(); // Add new page
    }

    // Save the PDF
    const resumeFileName = `${resume?.name || "My"}_resume.pdf`;
    doc.save(resumeFileName);
  };

  const handleDeleteResume = () => {
    localStorage.removeItem("resumeData");
    setResume(null); // Clear resume state
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-info">
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Account Created:</strong> {registrationDate}</p>
      </div>

      <div className="resume-section">
        {resume ? (
          <div>
            <h3>Your Resume</h3>
            <button onClick={handleDownloadResume}>Download Resume</button>
            <button onClick={handleDeleteResume}>Delete Resume</button>
          </div>
        ) : (
          <p>No resume found. Please create your resume.</p>
        )}
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfilePage;
