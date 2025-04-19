import React, { useState, useEffect } from 'react';
import './LoadingAnimation.css';

export const AdvancedLoading = ({ stages, currentStage }) => {
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + 1));
    }, 50);

    const handleMouseMove = (e) => {
      const x = (e.clientY / window.innerHeight - 0.5) * 10;
      const y = (e.clientX / window.innerWidth - 0.5) * 10;
      setRotation({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="loading-wrapper">
      <div 
        className="advanced-loading-container"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
      >
        {stages.map((stage, index) => (
          <div
            key={index}
            className={`loading-stage-advanced ${index < currentStage ? 'complete' : ''}`}
            style={{ 
              animationDelay: `${index * 0.3}s`,
              transform: `translateZ(${index * 15}px)`,
            }}
          >
            <div className="stage-icon">
              {index < currentStage ? (
                '✓'
              ) : index === currentStage ? (
                <span className="loading-dot">●</span>
              ) : (
                '○'
              )}
            </div>
            <div 
              className="stage-content"
              style={{
                transform: `translateZ(${10 + index * 5}px)`
              }}
            >
              <div className="stage-title">{stage.title}</div>
              <div className="stage-description">{stage.description}</div>
              {index === currentStage && (
                <div className="stage-progress">
                  <div 
                    className="progress-bar"
                    style={{width: `${progress}%`}}
                  />
                  {progress}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
