import  { useEffect } from 'react';

const ExpertAI = () => {
  useEffect(() => {
    // Add container for chatbot
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    chatbotContainer.style.position = 'fixed';
    chatbotContainer.style.top = '0';
    chatbotContainer.style.left = '0';
    chatbotContainer.style.width = '100%';
    chatbotContainer.style.height = '100%';
    chatbotContainer.style.zIndex = '1000';
    document.body.appendChild(chatbotContainer);

    // Create configuration script
    const configScript = document.createElement('script');
    configScript.text = 'window.chtlConfig = { chatbotId: "6532338825", display: "fullscreen" }';
    document.body.appendChild(configScript);

    // Create embed script
    const embedScript = document.createElement('script');
    embedScript.src = 'https://chatling.ai/js/embed.js';
    embedScript.async = true;
    embedScript.type = 'text/javascript';
    embedScript.dataset.id = '6532338825';
    embedScript.dataset.display = 'fullscreen';
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

export default ExpertAI;