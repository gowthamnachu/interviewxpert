import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf"; // jsPDF library to generate PDF
import { useNavigate, useLocation } from "react-router-dom";
import "./ResumePage.css"; // Import the CSS for animations and styling

const ResumePage = () => {
  const navigate = useNavigate(); // useNavigate for page redirection
  const location = useLocation();
  const isEditing = location.state?.isEditing;
  const resumeData = location.state?.resumeData;

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

  useEffect(() => {
    if (isEditing && resumeData) {
      setName(resumeData.name || "");
      setEmail(resumeData.email || "");
      setPhone(resumeData.phone || "");
      setEducation(resumeData.education || "");
      setExperience(resumeData.experience || "");
      setSkills(resumeData.skills || "");
      setLanguages(resumeData.languages || "");
      setVolunteerExperience(resumeData.volunteerExperience || "");
      if (resumeData.photo) setPhoto(resumeData.photo);
    } else {
      fetchResume();
    }
  }, [isEditing, resumeData]);

  const fetchResume = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/resume", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data) {
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setEducation(data.education || "");
        setExperience(data.experience || "");
        setSkills(data.skills || "");
        setLanguages(data.languages || "");
        setVolunteerExperience(data.volunteerExperience || "");
        if (data.photo) setPhoto(data.photo);
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file)); // Convert image to URL for display
    }
  };

  // Handle PDF generation and store in localStorage
  const handleDownloadResume = async () => {
    const doc = new jsPDF();

    // Add the profile picture if it exists
    if (photo) {
      doc.addImage(photo, "JPEG", 150, 15, 50, 50); // Image position and size
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

    // Generate base64 PDF data
    const pdfBase64 = doc.output('base64');
    const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/resume", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          education,
          experience,
          skills,
          languages,
          volunteerExperience,
          photo,
          pdfData: pdfDataUri // Store with proper data URI format
        })
      });

      if (response.ok) {
        setMessage(isEditing ? "Resume Updated Successfully!" : "Resume Created Successfully!");
        // Save local copy
        doc.save(`${name}_resume.pdf`);
        setTimeout(() => {
          navigate("/profile");
          setMessage("");
        }, 3000);
      } else {
        throw new Error('Failed to save resume');
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      setMessage("Failed to save resume");
    }
  };

  return (
    <div className="resume-container">
      <h2>{isEditing ? "Edit Your Resume" : "Create Your Professional Resume"}</h2>
      <form>
        <div className="form-section">
          <label>
            Profile Photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="file-input"
            />
          </label>
        </div>

        <div className="form-section">
          <label>
            Full Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., John Doe"
              required
            />
          </label>
        </div>

        <div className="form-section">
          <label>
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., john@example.com"
              required
            />
          </label>
        </div>

        <div className="form-section">
          <label>
            Phone Number
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., +1 234 567 8900"
              required
            />
          </label>
        </div>

        <div className="form-section">
          <label>
            Education
            <textarea
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="Describe your educational background, including degrees, institutions, and graduation years"
              required
            />
          </label>
        </div>

        <div className="form-section">
          <label>
            Professional Experience
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Detail your work experience, including company names, positions, and key achievements"
              required
            />
          </label>
        </div>

        <div className="form-section">
          <label>
            Technical Skills
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="List your technical skills, frameworks, and tools you're proficient in"
              required
            />
          </label>
        </div>

        <div className="form-section">
          <label>
            Languages
            <textarea
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="List languages you speak and your proficiency level"
            />
          </label>
        </div>

        <div className="form-section">
          <label>
            Volunteer Experience
            <textarea
              value={volunteerExperience}
              onChange={(e) => setVolunteerExperience(e.target.value)}
              placeholder="Share your volunteer work and community involvement"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleDownloadResume}
          disabled={!name || !email || !phone || !education || !experience || !skills}
        >
          {isEditing ? "Update Resume" : "Generate Professional Resume"}
        </button>
      </form>
      {message && <div className="success-message">{message}</div>}
    </div>
  );
};

export default ResumePage;
