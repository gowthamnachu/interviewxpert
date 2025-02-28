import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./IntroVideo.css";

const IntroVideo = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const video = document.getElementById("intro-video");

    // Redirect to login page after video ends
    video.addEventListener("ended", () => {
      navigate("/login");
    });

    return () => {
      video.removeEventListener("ended", () => navigate("/login"));
    };
  }, [navigate]);

  return (
    <div className="video-container">
      <video id="intro-video" autoPlay muted>
        <source src="/videos/intro.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default IntroVideo;
