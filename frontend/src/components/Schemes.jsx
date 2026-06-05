import React, { useState } from 'react';

const schemesData = [
  {
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    type: "Financial Aid",
    benefits: "Direct income support of ₹6,000 per annum in three equal installments of ₹2,000 directly into bank accounts.",
    eligibility: "All landholding farmer families across the country (subject to certain exclusion criteria like institutional landholders, tax payers, professionals).",
    documents: "Aadhaar Card, Land Holding Documents/Patta, Bank Account details.",
    link: "https://pmkisan.gov.in"
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    type: "Insurance",
    benefits: "Comprehensive insurance cover against crop failure due to natural calamities, pests, and diseases. Farmers pay extremely low premium rates.",
    eligibility: "All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.",
    documents: "Land records, Sowing Certificate from local authority, Bank Passbook, ID Proof.",
    link: "https://pmfby.gov.in"
  },
  {
    name: "Soil Health Card Scheme (SHC)",
    type: "Soil Care",
    benefits: "Provides card showing soil nutrient status (macro, micro, and physical parameters) plus recommendations for optimal fertilizer dosage.",
    eligibility: "All farmers in India. Soil testing is carried out once every 2 years for their farms.",
    documents: "Land details, Aadhaar number, Mobile number.",
    link: "https://soilhealth.dac.gov.in"
  },
  {
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    type: "Organic Farming",
    benefits: "Financial assistance of ₹50,000 per hectare for 3 years, of which ₹31,000 is directly given to farmers via DBT for organic inputs.",
    eligibility: "Farmers working in clusters of 20 hectares (minimum 50 farmers group) practicing organic farming.",
    documents: "Cluster registration, Aadhaar, Land ownership proofs.",
    link: "https://pgsindia-ncof.gov.in"
  }
];

export default function Schemes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Calculator State
  const [landArea, setLandArea] = useState(1);
  const [cropType, setCropType] = useState('Kharif');
  const [sumAssured, setSumAssured] = useState(50000);
  const [isOrganic, setIsOrganic] = useState(false);

  // Computed Calculator values
  const getPremiumRate = () => {
    if (cropType === 'Kharif') return 0.02; // 2%
    if (cropType === 'Rabi') return 0.015; // 1.5%
    return 0.05; // Commercial/Horticulture is 5%
  };

  const calculatePremium = () => {
    const rate = getPremiumRate();
    return (landArea * sumAssured * rate).toFixed(2);
  };

  const calculateGovSubsidy = () => {
    let base = 0;
    if (isOrganic) {
      // Under PKVY, subsidy is ₹31,000 per hectare for organic inputs
      base += landArea * 31000;
    }
    return base.toFixed(2);
  };

  const filteredSchemes = schemesData.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          scheme.benefits.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || scheme.type === selectedType;
    return matchesSearch && matchesType;
  });

  const types = ['All', 'Financial Aid', 'Insurance', 'Soil Care', 'Organic Farming'];

  return (
    <div className="screen-container animate-fade-in">
      
      {/* Title & Header */}
      <div>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Government Schemes Directory</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '800px' }}>
          Browse available agricultural subsidies, direct income transfers, crop insurance schemes, and calculate estimates using our official policy logic simulators.
        </p>
      </div>

      {/* Two-Column Layout: Directory on left, Calculator on right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        
        {/* Left Side: Directory */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Search & Filters */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: 'var(--bg-card)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)'
          }}>
            <input
              type="text"
              placeholder="Search schemes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-main)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    border: 'none',
                    backgroundColor: selectedType === t ? 'var(--primary-medium)' : 'var(--bg-main)',
                    color: selectedType === t ? '#ffffff' : 'var(--text-muted)',
                    fontWeight: '600',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Schemes List */}
          {filteredSchemes.map((scheme, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: '0.7rem',
                  backgroundColor: 'var(--accent-ultra-light)',
                  color: 'var(--primary-medium)',
                  fontWeight: '700',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  textTransform: 'uppercase'
                }}>
                  {scheme.type}
                </span>
                <a 
                  href={scheme.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--primary-medium)',
                    textDecoration: 'none',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  Apply Portal ↗
                </a>
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)' }}>{scheme.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                <strong>Benefits:</strong> {scheme.benefits}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <strong>Eligibility:</strong> {scheme.eligibility}
              </p>
              <div style={{
                fontSize: '0.75rem',
                backgroundColor: 'var(--bg-main)',
                padding: '0.6rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '3px solid var(--accent)'
              }}>
                📄 <strong>Required:</strong> {scheme.documents}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Calculator Widget */}
        <div className="card" style={{ 
          position: 'sticky', 
          top: '2rem',
          border: '1px solid var(--accent-pale)',
          backgroundColor: '#ffffff'
        }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.25rem', color: 'var(--primary-dark)' }}>
            Policy Benefit Estimator
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Estimate crop insurance premiums (PMFBY) and organic inputs subsidies (PKVY).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Land Area */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Land Holding Area (Hectares): <strong style={{ color: 'var(--primary)' }}>{landArea} Ha</strong>
              </label>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={landArea}
                onChange={(e) => setLandArea(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </div>

            {/* Crop Type (affects PMFBY premium rate) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Crop Season Classification (PMFBY)
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {['Kharif', 'Rabi', 'Commercial'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setCropType(type)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: cropType === type ? 'var(--accent-ultra-light)' : 'transparent',
                      color: cropType === type ? 'var(--primary-dark)' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {type} {type === 'Kharif' ? '(2%)' : type === 'Rabi' ? '(1.5%)' : '(5%)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sum Assured per Hectare */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem' }}>
                Sum Assured (₹ per Hectare)
              </label>
              <select 
                value={sumAssured} 
                onChange={(e) => setSumAssured(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  outline: 'none'
                }}
              >
                <option value={30000}>₹30,000 / Ha (Low intensity)</option>
                <option value={50000}>₹50,000 / Ha (Standard Paddy/Wheat)</option>
                <option value={80000}>₹80,000 / Ha (High value horticultural)</option>
              </select>
            </div>

            {/* Organic Switch */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-main)',
              padding: '0.8rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <strong style={{ fontSize: '0.85rem', display: 'block' }}>Organic Cultivation</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Eligible for PKVY scheme</span>
              </div>
              <input
                type="checkbox"
                checked={isOrganic}
                onChange={(e) => setIsOrganic(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
            </div>

            {/* Result Outputs */}
            <div style={{
              borderTop: '2px dashed var(--border-color)',
              paddingTop: '1rem',
              marginTop: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Farmer Share Premium (PMFBY):</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary-dark)' }}>₹{calculatePremium()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Organic Subsidy (PKVY):</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary-medium)' }}>+ ₹{calculateGovSubsidy()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Flat Income Support (PM-KISAN):</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--gold-dark)' }}>+ ₹6,000.00 / yr</strong>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--accent-ultra-light)',
              padding: '0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: 'var(--primary-dark)',
              textAlign: 'center',
              lineHeight: '1.4'
            }}>
              💡 <strong>Net Financial Support:</strong> Farmers executing certified organic farming on this acreage can expect up to <strong>₹{(parseFloat(calculateGovSubsidy()) + 6000).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</strong> in direct bank transfer benefits.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
