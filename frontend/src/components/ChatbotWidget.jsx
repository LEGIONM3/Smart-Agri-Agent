import React, { useState, useEffect, useRef } from 'react';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [config, setConfig] = useState({ configured: false });
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am your AI Agriculture Handbook assistant. Ask me anything about crop cycles, soil tests, pest management, or government subsidies!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Check static environment configuration OR fallback to dynamic backend configs
  useEffect(() => {
    // 1. Check if a raw script block was bundled via Vite static variables (for Vercel/GitHub Pages)
    const staticScript = import.meta.env.VITE_IBM_ORCHESTRATE_SCRIPT;
    if (staticScript && staticScript.trim() !== '') {
      const staticConfig = {
        configured: true,
        script: staticScript
      };
      setConfig(staticConfig);
      setIsOnline(true);
      executeDynamicScript(staticScript);
      return;
    }

    // 2. Check individual static environment credentials variables
    const staticIntegrationId = import.meta.env.VITE_IBM_ORCHESTRATE_INTEGRATION_ID;
    const staticCrn = import.meta.env.VITE_IBM_ORCHESTRATE_CRN;
    const staticAgentId = import.meta.env.VITE_IBM_ORCHESTRATE_AGENT_ID;
    const staticHostUrl = import.meta.env.VITE_IBM_ORCHESTRATE_HOST_URL;
    const staticAgentEnvId = import.meta.env.VITE_IBM_ORCHESTRATE_AGENT_ENV_ID || 'live';

    if (staticIntegrationId && staticIntegrationId.trim() !== '') {
      const staticConfig = {
        configured: true,
        integrationId: staticIntegrationId,
        crn: staticCrn,
        agentId: staticAgentId,
        hostUrl: staticHostUrl,
        agentEnvironmentId: staticAgentEnvId
      };
      setConfig(staticConfig);
      setIsOnline(true);
      loadIBMOrchestrate(staticConfig);
    } else {
      // 3. Fallback to Express backend configuration (which parses .env dynamically)
      fetch('http://localhost:5000/api/config')
        .then(res => res.json())
        .then(data => {
          setConfig(data);
          setIsOnline(data.configured);
          if (data.configured) {
            if (data.script && data.script.trim() !== '') {
              executeDynamicScript(data.script);
            } else {
              loadIBMOrchestrate(data);
            }
          }
        })
        .catch(err => {
          console.warn("Could not reach backend configuration, running in Offline Demo Mode.");
          setIsOnline(false);
        });
    }
  }, []);

  // Dynamically executes the raw JS code from the script tag
  const executeDynamicScript = (jsCode) => {
    try {
      // Prevent duplicate script execution during React re-renders or HMR
      if (window.wxOConfiguration) {
        console.log("watsonx Orchestrate script is already active. Skipping duplicate injection.");
        return;
      }

      // Overwrite rootElementID: "root" in the pasted script block to point to a safe mount container.
      // This ensures the chat widget does not wipe out Vite's main '#root' element.
      let cleanedCode = jsCode;
      
      cleanedCode = cleanedCode.replace(/rootElementID\s*:\s*["']root["']/g, 'rootElementID: "ibm-orchestrate-chat-mount"');
      cleanedCode = cleanedCode.replace(/rootElementId\s*:\s*["']root["']/g, 'rootElementId: "ibm-orchestrate-chat-mount"');

      // Create separate DOM mount point if missing
      let chatMount = document.getElementById('ibm-orchestrate-chat-mount');
      if (!chatMount) {
        chatMount = document.createElement('div');
        chatMount.id = 'ibm-orchestrate-chat-mount';
        document.body.appendChild(chatMount);
      }

      // Execute script block
      const scriptElement = document.createElement('script');
      scriptElement.text = cleanedCode;
      document.body.appendChild(scriptElement);
      
      console.log("Dynamically executed raw IBM Orchestrate script payload from environment configs.");
    } catch (err) {
      console.error("Failed executing dynamic script block: ", err);
    }
  };

  // Dynamically load the official IBM watsonx Orchestrate chat channel via credentials
  const loadIBMOrchestrate = (conf) => {
    try {
      // Prevent duplicate script execution during React re-renders or HMR
      if (window.wxOConfiguration) {
        console.log("watsonx Orchestrate script is already active. Skipping duplicate injection.");
        return;
      }

      // 1. Re-prepend 'crn:' to the CRN if it was entered without it
      let formattedCrn = conf.crn ? conf.crn.trim() : '';
      if (formattedCrn && !formattedCrn.startsWith('crn:')) {
        formattedCrn = 'crn:' + formattedCrn;
      }

      // 2. Format the Host URL (must start with protocol, no trailing slash)
      let hostClean = conf.hostUrl ? conf.hostUrl.trim() : '';
      if (hostClean) {
        if (!hostClean.startsWith('http')) {
          hostClean = `https://${hostClean}`;
        }
        if (hostClean.endsWith('/')) {
          hostClean = hostClean.slice(0, -1);
        }
      } else {
        hostClean = 'https://dl.watson-orchestrate.ibm.com';
      }

      // 3. Create container mount point
      let chatMount = document.getElementById('ibm-orchestrate-chat-mount');
      if (!chatMount) {
        chatMount = document.createElement('div');
        chatMount.id = 'ibm-orchestrate-chat-mount';
        document.body.appendChild(chatMount);
      }

      // 4. Initialize global config
      window.wxOConfiguration = {
        orchestrationID: conf.integrationId,
        orchestrationId: conf.integrationId,
        hostURL: hostClean,
        hostUrl: hostClean,
        deploymentPlatform: "ibmcloud", 
        crn: formattedCrn,
        rootElementID: 'ibm-orchestrate-chat-mount',
        rootElementId: 'ibm-orchestrate-chat-mount',
        chatOptions: {
          agentId: conf.agentId,
          agentID: conf.agentId,
          agentEnvironmentId: conf.agentEnvironmentId || 'live',
          agentEnvironmentID: conf.agentEnvironmentId || 'live'
        }
      };

      // 5. Inject entry loader
      const script = document.createElement('script');
      script.src = `${hostClean}/wxochat/wxoLoader.js?embed=true`;
      script.async = true;

      script.addEventListener('load', () => {
        if (window.wxoLoader && typeof window.wxoLoader.init === 'function') {
          window.wxoLoader.init();
          console.log("watsonx Orchestrate chat channel initialized successfully.");
        } else {
          console.warn("watsonx Orchestrate: wxoLoader.init function not found on script window.");
        }
      });

      script.addEventListener('error', (err) => {
        console.error("Failed to load watsonx Orchestrate script from:", script.src, err);
      });

      document.head.appendChild(script);
      console.log("watsonx Orchestrate integration active. Settings: ", window.wxOConfiguration);

    } catch (err) {
      console.error("Fatal error during watsonx Orchestrate script load: ", err);
    }
  };

  // Auto-scroll inside custom chat window
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          sessionId: sessionId
        })
      });

      const data = await response.json();

      const botMessage = {
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: data.mode
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error communicating with offline chat API:", error);
      const errorMessage = {
        sender: 'bot',
        text: "Sorry, I am having trouble connecting to my service. Please ensure the backend server is running on port 5000.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const formatBotText = (text) => {
    if (!text) return "";
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('###')) {
        return <h4 key={idx} style={{ color: 'var(--primary-dark)', marginTop: '0.6rem', marginBottom: '0.3rem', fontSize: '1rem', fontWeight: 'bold' }}>{line.replace('###', '').trim()}</h4>;
      }
      if (line.trim().startsWith('*') || line.trim().startsWith('•') || line.trim().startsWith('-')) {
        let content = line.trim().replace(/^[\*\•\-]\s*/, '');
        content = parseBold(content);
        return <li key={idx} style={{ marginLeft: '1rem', listStyleType: 'disc', fontSize: '0.85rem', marginBottom: '0.2rem' }}>{content}</li>;
      }
      if (/^\d+\.\s+/.test(line.trim())) {
        let content = line.trim().replace(/^\d+\.\s+/, '');
        content = parseBold(content);
        return <li key={idx} style={{ marginLeft: '1rem', listStyleType: 'decimal', fontSize: '0.85rem', marginBottom: '0.2rem' }}>{content}</li>;
      }
      return <p key={idx} style={{ marginBottom: '0.4rem', fontSize: '0.88rem', lineHeight: '1.4' }}>{parseBold(line)}</p>;
    });
  };

  const parseBold = (textString) => {
    const parts = textString.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      return index % 2 === 1 ? <strong key={index} style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>{part}</strong> : part;
    });
  };

  const suggestions = [
    "How do I cultivate rice?",
    "Organic compost steps",
    "Explain PM-KISAN scheme",
    "Best soil pH for wheat"
  ];

  // If Orchestrate is configured, the dynamic script takes over and we return null
  if (config.configured) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          border: 'none',
          boxShadow: 'var(--shadow-lg)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          animation: 'pulseGlow 2.5s infinite',
          transition: 'transform var(--transition-fast)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Floating Chat Box Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '6.5rem',
          right: '2rem',
          width: '380px',
          height: '520px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 998,
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--bg-sidebar)',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '700' }}>Agri Advisor</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                <span style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--gold)' 
                }}></span>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>
                  Offline Advisory Demo
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#ffffff', opacity: 0.7, cursor: 'pointer' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages List Area */}
          <div style={{
            flex: 1,
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: 'var(--bg-main)'
          }}>
            {messages.map((msg, index) => {
              const isBot = msg.sender === 'bot';
              return (
                <div 
                  key={index}
                  style={{
                    alignSelf: isBot ? 'flex-start' : 'flex-end',
                    maxWidth: '85%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isBot ? 'flex-start' : 'flex-end'
                  }}
                >
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: isBot ? '0px 12px 12px 12px' : '12px 12px 0px 12px',
                    backgroundColor: isBot ? '#ffffff' : 'var(--primary)',
                    color: isBot ? 'var(--text-main)' : '#ffffff',
                    boxShadow: isBot ? 'var(--shadow-sm)' : 'none',
                    border: isBot ? '1px solid var(--border-color)' : 'none'
                  }}>
                    {isBot ? formatBotText(msg.text) : <p style={{ fontSize: '0.88rem' }}>{msg.text}</p>}
                    
                    {isBot && (
                      <span style={{ 
                        fontSize: '0.65rem', 
                        color: 'var(--gold-dark)', 
                        backgroundColor: 'var(--gold-light)',
                        padding: '0.1rem 0.35rem',
                        borderRadius: '3px',
                        fontWeight: 'bold',
                        marginTop: '0.4rem',
                        display: 'inline-block'
                      }}>
                        Offline Demo
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-light)', marginTop: '0.25rem', padding: '0 0.2rem' }}>
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
            
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.4rem', padding: '0.75rem 1rem', backgroundColor: '#ffffff', borderRadius: '0 12px 12px 12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-light)', borderRadius: '50%', display: 'inline-block', animation: 'bounceSlow 1.4s infinite ease-in-out' }}></span>
                <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-light)', borderRadius: '50%', display: 'inline-block', animation: 'bounceSlow 1.4s infinite ease-in-out 0.2s' }}></span>
                <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-light)', borderRadius: '50%', display: 'inline-block', animation: 'bounceSlow 1.4s infinite ease-in-out 0.4s' }}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          {messages.length === 1 && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem'
            }}>
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(sug)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    color: 'var(--primary-dark)',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-ultra-light)';
                    e.currentTarget.style.borderColor = 'var(--accent-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-main)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form 
            onSubmit={handleSubmit}
            style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: '#ffffff',
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                fontSize: '0.88rem'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                padding: '0.65rem 1rem',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: (!input.trim() || isLoading) ? 0.5 : 1
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: 'rotate(45deg) translate(-1px, 1px)' }}>
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
