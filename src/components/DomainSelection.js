import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DomainSelection.css';
import { FaCode, FaChartBar, FaBriefcase, FaMegaport, FaCloud, FaLaptopCode, FaDatabase, FaNetworkWired, FaShieldAlt, FaMobile, FaRobot, FaGamepad, FaServer, FaBrain, FaProjectDiagram, FaUserCog, FaChartLine, FaTools, FaMicrochip, FaGlobe } from 'react-icons/fa';

const DomainSelection = () => {
  const navigate = useNavigate();

  const handleDomainSelect = (domain) => {
    navigate('/questions', { state: { domain } });
  };

  const domains = [
    { name: 'Software Engineering', icon: FaCode },
    { name: 'Data Science', icon: FaChartBar },
    { name: 'Product Management', icon: FaBriefcase },
    { name: 'Marketing', icon: FaMegaport },
    { name: 'Cloud Computing', icon: FaCloud },
    { name: 'Frontend Development', icon: FaLaptopCode },
    { name: 'Database Management', icon: FaDatabase },
    { name: 'Network Engineering', icon: FaNetworkWired },
    { name: 'Cybersecurity', icon: FaShieldAlt },
    { name: 'Mobile Development', icon: FaMobile },
    { name: 'Artificial Intelligence', icon: FaRobot },
    { name: 'Game Development', icon: FaGamepad },
    { name: 'Backend Development', icon: FaServer },
    { name: 'Machine Learning', icon: FaBrain },
    { name: 'DevOps Engineering', icon: FaProjectDiagram },
    { name: 'System Administration', icon: FaUserCog },
    { name: 'Business Analytics', icon: FaChartLine },
    { name: 'QA Engineering', icon: FaTools },
    { name: 'Embedded Systems', icon: FaMicrochip },
    { name: 'Web Development', icon: FaGlobe }
  ];

  return (
    <div className="domain-container">
      <h2>Select Your Interview Domain</h2>
      <div className="domain-grid">
        {domains.map((domain, index) => (
          <button
            key={index}
            className="domain-button"
            onClick={() => handleDomainSelect(domain.name)}
            aria-label={`Select ${domain.name} domain`}
          >
            <domain.icon className="domain-icon" />
            <span className="domain-name">{domain.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DomainSelection;
