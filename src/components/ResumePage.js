import React, { useState } from "react";
import { jsPDF } from "jspdf"; // jsPDF library to generate PDF
import { useNavigate } from "react-router-dom";
import "./ResumePage.css"; // Import the CSS for animations and styling

const ResumePage = () => {
  const navigate = useNavigate(); // useNavigate for page redirection
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState("");
  const [volunteerExperience, setVolunteerExperience] = useState("");
  const [photo, setPhoto] = useState(null); // State for the uploaded photo
  const [message, setMessage] = useState(""); // State for success message visibility

  // Predefined summary, skills, awards
  const summary = "A highly motivated and results-driven individual with a passion for technology and problem-solving. Seeking to contribute skills and knowledge to a dynamic team.";
  const predefinedSkills = "JavaScript, React, Node.js, HTML, CSS, Problem Solving, Teamwork, Communication, Project Management";
  const awards = "Best Developer Award - 2021, Employee of the Year - 2020";

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file)); // Convert image to URL for display
    }
  };

  // Handle PDF generation and store in localStorage
  const handleDownloadResume = () => {
    const doc = new jsPDF();

    // Add the profile picture if it exists
    if (photo) {
      doc.addImage(photo, "JPEG", 15, 15, 50, 50); // Image position and size
    }

    // Title and Header Section
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Resume", 70, 20); // Add title

    // Personal Information Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Name: ", 20, 60);
    doc.setFontSize(12);
    doc.text(name, 40, 60);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Email: ", 20, 70);
    doc.setFontSize(12);
    doc.text(email, 40, 70);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Phone: ", 20, 80);
    doc.setFontSize(12);
    doc.text(phone, 40, 80);

    // Divider line
    doc.setLineWidth(0.5);
    doc.line(20, 85, 190, 85);

    // Summary Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Summary:", 20, 100);
    doc.setFontSize(12);
    doc.text(summary, 20, 110, { maxWidth: 180 });

    // Divider line
    doc.line(20, 120, 190, 120);

    // Education Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Education:", 20, 130);
    doc.setFontSize(12);
    doc.text(education || "Bachelor's in Computer Science", 20, 140, { maxWidth: 180 });

    // Divider line
    doc.line(20, 150, 190, 150);

    // Work Experience Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Work Experience:", 20, 160);
    doc.setFontSize(12);
    doc.text(experience || "Software Developer at XYZ Corp", 20, 170, { maxWidth: 180 });

    // Divider line
    doc.line(20, 180, 190, 180);

    // Skills Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Skills:", 20, 190);
    doc.setFontSize(12);
    doc.text(skills || predefinedSkills, 20, 200, { maxWidth: 180 });

    // Divider line
    doc.line(20, 210, 190, 210);

    // Awards Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Awards and Honors:", 20, 220);
    doc.setFontSize(12);
    doc.text(awards, 20, 230, { maxWidth: 180 });

    // Divider line
    doc.line(20, 240, 190, 240);

    // Languages Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Languages:", 20, 250);
    doc.setFontSize(12);
    doc.text(languages || "English, Spanish", 20, 260, { maxWidth: 180 });

    // Divider line
    doc.line(20, 270, 190, 270);

    // Volunteer Experience Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Volunteer Experience:", 20, 280);
    doc.setFontSize(12);
    doc.text(volunteerExperience || "Volunteer Developer at Local NGO", 20, 290, { maxWidth: 180 });

    // Divider line
    doc.line(20, 300, 190, 300);

    // Save the PDF as a file
    const resumeFileName = `${name}_resume.pdf`;
    doc.save(resumeFileName);

    // Store the resume data in localStorage
    localStorage.setItem("resumeData", JSON.stringify({
      name, email, phone, education, experience, skills, languages, volunteerExperience, photo
    }));

    // Show success message after creating the resume
    setMessage("Resume Created Successfully!");
    
    // Redirect after the message is shown
    setTimeout(() => {
      navigate("/"); // Redirect to HomePage
      setMessage(""); // Clear the success message
    }, 5000); // 5 seconds delay for the message
  };

  return (
    <div className="resume-container">
      <h2>Build Your Resume</h2>
      <form>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Phone:
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        <label>
          Education:
          <textarea
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="Enter your educational background"
            required
          />
        </label>
        <label>
          Work Experience:
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Describe your work experience"
            required
          />
        </label>
        <label>
          Skills:
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="List your skills"
            required
          />
        </label>
        <label>
          Languages:
          <textarea
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            placeholder="Languages you speak"
          />
        </label>
        <label>
          Volunteer Experience:
          <textarea
            value={volunteerExperience}
            onChange={(e) => setVolunteerExperience(e.target.value)}
            placeholder="Describe any volunteer work"
          />
        </label>
        <label>
          Profile Photo:
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </label>

        <button
          type="button"
          onClick={handleDownloadResume}
          disabled={!name || !email || !phone || !education || !experience || !skills}
        >
          Download Resume
        </button>
      </form>

      {/* Success Message */}
      {message && <div className="success-message">{message}</div>}
    </div>
  );
};

export default ResumePage;
