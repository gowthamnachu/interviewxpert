import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf"; // jsPDF library to generate PDF
import { useNavigate, useLocation } from "react-router-dom";
import { config } from '../config';
import "./ResumePage.css"; // Import the CSS for animations and styling
import { AdvancedLoading } from './LoadingAnimation';
import { resumeLoadingStages } from '../utils/LoadingMessages';

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
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentLoadingStage, setCurrentLoadingStage] = useState(0);
  const [error, setError] = useState(null); // Improved error handling with state

  // Predefined summary, skills, awards
  const summary = "A highly motivated and results-driven individual with a passion for technology and problem-solving. Seeking to contribute skills and knowledge to a dynamic team.";
  const predefinedSkills = "JavaScript, React, Node.js, HTML, CSS, Problem Solving, Teamwork, Communication, Project Management";
  const awards = "Best Developer Award - 2021, Employee of the Year - 2020";

  useEffect(() => {
    if (isEditing && resumeData) {
      try {
        setName(resumeData.name || "");
        setEmail(resumeData.email || "");
        setPhone(resumeData.phone || "");
        setEducation(resumeData.education || "");
        setExperience(resumeData.experience || "");
        setSkills(resumeData.skills || "");
        setLanguages(resumeData.languages || "");
        setVolunteerExperience(resumeData.volunteerExperience || "");
        if (resumeData.photo) setPhoto(resumeData.photo);
      } catch (error) {
        setError("Failed to load resume data");
        console.error("Resume data loading error:", error);
      }
    } else {
      fetchResume();
    }
  }, [isEditing, resumeData]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => (prev >= 100 ? 100 : prev + 1));
    }, 50);

    const stageInterval = setInterval(() => {
      setCurrentLoadingStage(prev => (prev < 3 ? prev + 1 : prev));
    }, 1500);

    // Simulate loading completion
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
      clearTimeout(loadingTimeout);
    };
  }, []); // Remove loading from dependencies

  const fetchResume = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${config.apiUrl}/resume`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch resume");
      }

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
      setError("Failed to fetch resume data");
      console.error("Error fetching resume:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file)); // Convert image to URL for display
    }
  };

  // Improved form validation
  const validateForm = () => {
    if (!name || !email || !phone || !education || !experience || !skills) {
      setError("Please fill in all required fields");
      return false;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  // Handle PDF generation and store in localStorage
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Generate PDF first
      const doc = new jsPDF();
      // ...existing PDF generation code...

      // Get base64 string of PDF
      const pdfBase64 = doc.output('datauristring');

      // Try both endpoints
      const endpoint = `${config.apiUrl}/resume`;
      const netlifyEndpoint = `/.netlify/functions/api/resume`;
      
      let response;
      try {
        response = await fetch(endpoint, {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
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
            pdfData: pdfBase64,
            updatedAt: new Date().toISOString()
          })
        });
      } catch (err) {
        // If first endpoint fails, try Netlify endpoint
        response = await fetch(netlifyEndpoint, {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
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
            pdfData: pdfBase64,
            updatedAt: new Date().toISOString()
          })
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save resume');
      }

      // Save PDF locally
      doc.save(`${name}_resume.pdf`);
      
      setMessage(isEditing ? "Resume Updated Successfully!" : "Resume Created Successfully!");
      setTimeout(() => {
        setMessage("");
        navigate("/profile");
      }, 2000);

    } catch (error) {
      console.error("Resume operation error:", error);
      setError(error.message || "Failed to save resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="resume-loading">
        <AdvancedLoading 
          progress={loadingProgress}
          currentStage={currentLoadingStage}
          stages={resumeLoadingStages}
        />
      </div>
    );
  }

  return (
    <div className="resume-container">
      <h2>{isEditing ? "Edit Your Resume" : "Create Your Professional Resume"}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
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
          type="submit"
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
