import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Handbook from './components/Handbook';
import Schemes from './components/Schemes';
import Resources from './components/Resources';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [ibmStatus, setIbmStatus] = useState({ configured: false, message: 'Connecting...' });

  // Poll or check status of backend/static connection
  useEffect(() => {
    const staticIntegrationId = import.meta.env.VITE_IBM_ORCHESTRATE_INTEGRATION_ID;
    if (staticIntegrationId && staticIntegrationId.trim() !== '') {
      setIbmStatus({
        configured: true,
        message: 'IBM Orchestrate Static Config Active.'
      });
    } else {
      fetch('http://localhost:5000/api/status')
        .then(res => res.json())
        .then(data => {
          setIbmStatus(data);
        })
        .catch(err => {
          setIbmStatus({ 
            configured: false, 
            message: 'Backend Offline. Running in Offline Demo Mode.' 
          });
        });
    }
  }, []);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'handbook':
        return <Handbook />;
      case 'schemes':
        return <Schemes />;
      case 'resources':
        return <Resources />;
      default:
        return <Dashboard />;
    }
  };

  const getScreenTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: "Agriculture Dashboard", subtitle: "Real-time crop matchmakers and meteorological advisories." };
      case 'handbook':
        return { title: "Handbook Guidelines", subtitle: "Verified agronomy cycles, soil care, and pest controls." };
      case 'schemes':
        return { title: "Policy Directory", subtitle: "Financial benefits, crop insurance, and calculation simulators." };
      case 'resources':
        return { title: "Helplines & Libraries", subtitle: "Direct extension desk filing and curated textbooks shelf." };
      default:
        return { title: "Agriculture Handbook", subtitle: "Smart Farming Portal" };
    }
  };

  const { title, subtitle } = getScreenTitle();

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
          </svg>
          <span className="sidebar-logo-text">AgriPortal</span>
        </div>

        <ul className="sidebar-menu">
          <li>
            <button 
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
              className={`sidebar-item-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="9" rx="1" />
                <rect x="14" y="3" width="7" height="5" rx="1" />
                <rect x="14" y="12" width="7" height="9" rx="1" />
                <rect x="3" y="16" width="7" height="5" rx="1" />
              </svg>
              Dashboard
            </button>
          </li>
          <li>
            <button 
              onClick={() => { setActiveTab('handbook'); setIsSidebarOpen(false); }}
              className={`sidebar-item-btn ${activeTab === 'handbook' ? 'active' : ''}`}
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
              Handbook Guides
            </button>
          </li>
          <li>
            <button 
              onClick={() => { setActiveTab('schemes'); setIsSidebarOpen(false); }}
              className={`sidebar-item-btn ${activeTab === 'schemes' ? 'active' : ''}`}
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.33l-7.5-5-7.5 5V21" />
              </svg>
              Gov Schemes
            </button>
          </li>
          <li>
            <button 
              onClick={() => { setActiveTab('resources'); setIsSidebarOpen(false); }}
              className={`sidebar-item-btn ${activeTab === 'resources' ? 'active' : ''}`}
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Expert Resources
            </button>
          </li>
        </ul>

        <div className="sidebar-footer">
          <p>© 2026 Agriculture Handbook</p>
          <p style={{ fontSize: '0.65rem', marginTop: '0.25rem' }}>IBM Cloud Engagement Portal</p>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="main-wrapper">
        
        {/* Header bar */}
        <header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="menu-toggle"
              aria-label="Toggle Navigation"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="header-title-container">
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
          </div>

          <div className="header-widgets">
            {/* Status indicators */}
            <div className={`status-badge ${ibmStatus.configured ? 'online' : 'offline'}`}>
              <span className="status-dot"></span>
              <span>{ibmStatus.configured ? 'IBM Custom Agent Active' : 'Offline Demo Mode'}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Inner views */}
        <div style={{ flex: 1 }}>
          {renderActiveScreen()}
        </div>

      </main>

      {/* Floating IBM Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}

export default App;
