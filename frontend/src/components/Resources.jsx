import React, { useState } from 'react';

const literatureBooks = [
  {
    title: "FAO Crop Production Manual",
    author: "Food and Agriculture Organization",
    description: "Standard peer-reviewed manual on soil preparation, seeding rates, and climate adaptation guidelines.",
    link: "https://www.fao.org/publications/en",
    tag: "Free Manual"
  },
  {
    title: "USDA Organic Farming Handbook",
    author: "United States Dept of Agriculture",
    description: "Extensive handbook covering organic fertilization, composting techniques, crop rotation, and certification protocols.",
    link: "https://www.usda.gov/topics/organic",
    tag: "Handbook"
  },
  {
    title: "Principles of Agronomy",
    author: "Indian Society of Agronomy",
    description: "Comprehensive academic text describing fundamentals of crop physiology, weed management, and agricultural meteorology.",
    link: "https://www.isa-india.org",
    tag: "Academic"
  },
  {
    title: "Wageningen Journal of Life Sciences",
    author: "Wageningen University & Research",
    description: "High-impact research articles describing climate-resilient farming, precision agriculture, and sensor integrations.",
    link: "https://www.wageningenur.nl/en.htm",
    tag: "Research Journal"
  }
];

export default function Resources() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [queryType, setQueryType] = useState('Pest Outbreak');
  const [message, setMessage] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    setFormSubmitted(true);
    // Reset values after delay
    setTimeout(() => {
      setName('');
      setPhone('');
      setMessage('');
      setFormSubmitted(false);
    }, 4000);
  };

  return (
    <div className="screen-container animate-fade-in">
      
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Literature & Expert Advisory</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '800px' }}>
          Access open-access agricultural textbooks, download crop manuals, call verified emergency helplines, or file an extension request for field specialists.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {/* Helplines and Literature Shelf Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Emergency Advisory Helplines */}
          <div className="card" style={{ borderLeft: '4px solid var(--error)', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--error)' }}>
              📞 Immediate Helpline Desk
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Connect with certified agronomists and government extension officers for real-time diagnostic support.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-sm)'
              }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block' }}>Kisan Call Center (Toll Free)</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Operates 6:00 AM to 10:00 PM</span>
                </div>
                <a 
                  href="tel:18001801551" 
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#ffffff',
                    padding: '0.4rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    textDecoration: 'none'
                  }}
                >
                  Call 1800-180-1551
                </a>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-sm)'
              }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', display: 'block' }}>Pest Alert Hotline</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>For rapid infestation reporting</span>
                </div>
                <a 
                  href="tel:18001801234" 
                  style={{
                    backgroundColor: 'var(--error)',
                    color: '#ffffff',
                    padding: '0.4rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    textDecoration: 'none'
                  }}
                >
                  Call Alert
                </a>
              </div>
            </div>
          </div>

          {/* Curated Literature BookShelf */}
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📚 Crop Literature & Handbook Guides</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {literatureBooks.map((lit, idx) => (
                <div 
                  key={idx} 
                  style={{
                    paddingBottom: '0.75rem',
                    borderBottom: idx === literatureBooks.length - 1 ? 'none' : '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      backgroundColor: 'var(--accent-ultra-light)',
                      color: 'var(--primary-medium)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px'
                    }}>
                      {lit.tag}
                    </span>
                    <a 
                      href={lit.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}
                    >
                      Read Guide ↗
                    </a>
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--primary-dark)' }}>{lit.title}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '500' }}>By {lit.author}</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lit.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Extension Request Form Column */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>👨‍🌾 Extension Office Support Request</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Submit soil samples, plant pictures, or query details to get advice back via SMS/Call.
          </p>

          {formSubmitted ? (
            <div style={{
              backgroundColor: 'var(--accent-ultra-light)',
              border: '1px solid var(--accent-light)',
              padding: '2rem 1rem',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
              color: 'var(--primary-dark)',
              animation: 'slideUp 0.3s ease'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-medium)" strokeWidth="2.5" style={{ marginBottom: '0.5rem' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Query Successfully Logged</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                An extension agent in your local administrative division has been assigned. You will receive an SMS updates shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Farmer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Mobile Number (for SMS Alerts)</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Category of Assistance</label>
                <select
                  value={queryType}
                  onChange={(e) => setQueryType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="Pest Outbreak">Pest / Disease Outbreak Emergency</option>
                  <option value="Soil pH issues">Soil pH / Fertilizer Recommendation</option>
                  <option value="Subsidies Eligibility">Government Schemes & Subsidy Dispute</option>
                  <option value="Seed Quality">Seed Quality / Germination Issues</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>Describe your field issue</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Explain symptoms, watering details, and soil history..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    outline: 'none',
                    fontSize: '0.85rem',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-medium)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary)'}
              >
                File Extension Query
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}
