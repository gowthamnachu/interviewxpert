import  { useEffect } from 'react';

const XBot = () => {
  useEffect(() => {
    // Add container for chatbot
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    chatbotContainer.style.position = 'fixed';
    chatbotContainer.style.bottom = '20px';
    chatbotContainer.style.right = '20px';
    chatbotContainer.style.zIndex = '1000';
    document.body.appendChild(chatbotContainer);

    // Create configuration script
    const configScript = document.createElement('script');
    configScript.text = 'window.chtlConfig = { chatbotId: "6532338825" }';
    document.body.appendChild(configScript);

    // Create embed script
    const embedScript = document.createElement('script');
    embedScript.src = 'https://chatling.ai/js/embed.js';
    embedScript.async = true;
    embedScript.type = 'text/javascript';
    embedScript.dataset.id = '6532338825';
    embedScript.id = 'chatling-embed-script';
    document.body.appendChild(embedScript);

    // Cleanup function
    return () => {
      // Remove scripts and container
      document.body.removeChild(configScript);
      document.body.removeChild(embedScript);
      const container = document.getElementById('chatbot-container');
      if (container) {
        document.body.removeChild(container);
      }
      // Destroy the widget if it exists
      if (window.ChatlingWidget) {
        window.ChatlingWidget.destroy();
      }
    };
  }, []);

  return null; // This component doesn't render any visible elements
};

export default XBot;