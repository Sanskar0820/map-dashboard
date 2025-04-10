import React, { useEffect } from 'react';
import Dashboard from "./pages/Dashboard";
import i18n from './i18n';

const App = () => {

  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        if (data?.type === 'SET_LANGUAGE' && data?.lang) {
          console.log('Language received from app:', data.lang);
          i18n.changeLanguage(data.lang);
        }
      } catch (err) {
        console.error('Invalid message format', err);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // i18n.changeLanguage('hi');
  return <Dashboard />;
};

export default App;
