import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import { showNotification } from './services/notification';

function App() {
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        const data = await response.json();
        if (data.status === 'ok') {
          showNotification('Successfully connected to backend server', 'info');
        }
      } catch (error) {
        showNotification('Unable to connect to backend server', 'error');
      }
    };

    checkBackendConnection();
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
      </Switch>
    </Router>
  );
}

export default App;