import React, { useState } from 'react';

const cropDatabase = [
  {
    name: "Rice (Paddy)",
    soils: ["Clay", "Loamy"],
    climates: ["Tropical"],
    water: ["High"],
    duration: "120-150 days",
    yield: "High (4-6 tons/hectare)",
    tips: "Ensure field is flooded to 5cm for first 3 weeks. Transplant seedlings when 25 days old."
  },
  {
    name: "Wheat",
    soils: ["Loamy", "Silt"],
    climates: ["Temperate", "Cool/Cold"],
    water: ["Medium"],
    duration: "110-130 days",
    yield: "High (3-5 tons/hectare)",
    tips: "Sow in lines. Crown root initiation stage (20 days after sowing) is the most critical for watering."
  },
  {
    name: "Maize (Corn)",
    soils: ["Loamy", "Silt", "Sandy"],
    climates: ["Tropical", "Temperate"],
    water: ["Medium"],
    duration: "90-110 days",
    yield: "Medium (3.5 tons/hectare)",
    tips: "Extremely sensitive to waterlogging. Ensure good drainage. Add nitrogen-rich compost."
  },
  {
    name: "Potatoes",
    soils: ["Sandy", "Loamy"],
    climates: ["Temperate", "Cool/Cold"],
    water: ["Medium"],
    duration: "90-120 days",
    yield: "High (15-20 tons/hectare)",
    tips: "Requires loose soil for tuber expansion. Earth up the soil around the base as the plant grows."
  },
  {
    name: "Pearl Millet (Bajra)",
    soils: ["Sandy", "Clay"],
    climates: ["Arid"],
    water: ["Low"],
    duration: "80-90 days",
    yield: "Medium (1.5-2 tons/hectare)",
    tips: "Highly drought resistant. Ideal crop for dry sandy soils with minimal irrigation."
  },
  {
    name: "Chickpeas (Gram)",
    soils: ["Loamy", "Silt"],
    climates: ["Temperate", "Arid"],
    water: ["Low"],
    duration: "100-120 days",
    yield: "Medium (1.8 tons/hectare)",
    tips: "Legume crop that fixes atmospheric nitrogen. Do not overwater as it leads to root rot."
  },
  {
    name: "Tomatoes",
    soils: ["Loamy", "Sandy", "Peat"],
    climates: ["Tropical", "Temperate"],
    water: ["Medium"],
    duration: "70-90 days (post-transplant)",
    yield: "High (variable)",
    tips: "Prune suckers to increase fruit size. Apply calcium to the soil to prevent blossom end rot."
  },
  {
    name: "Carrots",
    soils: ["Sandy", "Silt"],
    climates: ["Temperate", "Cool/Cold"],
    water: ["Medium"],
    duration: "75-90 days",
    yield: "Medium",
    tips: "Remove rocks and compact lumps from soil to prevent split or deformed roots."
  }
];

const weatherAdvisories = {
  "Sunny": {
    alert: "Ideal Farming Weather",
    tips: [
      "Optimal time for weeding and field preparation.",
      "Water crops early in the morning (5:00 AM - 8:00 AM) or late evening to prevent evaporation.",
      "Good conditions for drying harvested grains. Ensure protection from sudden moisture changes."
    ],
    bgClass: "weather-sunny"
  },
  "Rainy": {
    alert: "Heavy Rainfall Expected",
    tips: [
      "Suspend all pesticide and fertilizer spraying as the rain will wash it away.",
      "Ensure proper drainage channels are clear to prevent waterlogging in roots.",
      "Harvested crops should be immediately moved to dry, covered storage sheds."
    ],
    bgClass: "weather-rainy"
  },
  "Overcast": {
    alert: "High Humidity & Cloud Cover",
    tips: [
      "Perfect weather for transplantation of seedlings.",
      "High humidity increases risk of fungal blight; inspect undersides of leaves closely.",
      "Optimal condition for compost turning and aeration."
    ],
    bgClass: "weather-overcast"
  },
  "Windy": {
    alert: "Strong Winds Forecasted",
    tips: [
      "Avoid spraying chemical treatments; high drift will reduce effectiveness and damage nearby crops.",
      "Inspect stakes and trellis supports for climbing plants like beans and tomatoes.",
      "Ensure greenhouse vents are secured."
    ]
  }
};

export default function Dashboard() {
  // Recommendation state
  const [soil, setSoil] = useState('');
  const [climate, setClimate] = useState('');
  const [water, setWater] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [recommendedYet, setRecommendedYet] = useState(false);

  // Weather state
  const [weatherCondition, setWeatherCondition] = useState('Sunny');

  const handleRecommend = (e) => {
    e.preventDefault();
    if (!soil || !climate || !water) return;

    const filtered = cropDatabase.filter(crop => 
      crop.soils.includes(soil) &&
      crop.climates.includes(climate) &&
      crop.water.includes(water)
    );

    setRecommendations(filtered);
    setRecommendedYet(true);
  };

  const currentAdvisory = weatherAdvisories[weatherCondition];

  return (
    <div className="screen-container animate-fade-in">
      
      {/* Welcome Section */}
      <div className="card dashboard-hero" style={{
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-medium) 100%)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2.5rem',
        border: 'none',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: 'var(--accent)',
            fontSize: '0.8rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'inline-block',
            marginBottom: '1rem'
          }}>
            AI Agriculture Handbook & Support
          </span>
          <h2 style={{ color: '#ffffff', fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: '700' }}>
            Empowering Farmers with Smarter Cultivation Data
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '650px', fontSize: '1rem' }}>
            Access peer-reviewed crop guidelines, calculate government subsidies, check live micro-advisories, and chat with our dedicated IBM Custom Agent for real-time help.
          </p>
        </div>
        <div style={{
          position: 'absolute',
          right: '-5%',
          bottom: '-20%',
          opacity: 0.1,
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <svg width="300" height="300" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M17 8C17 4.69 14.31 2 11 2C7.69 2 5 4.69 5 8C5 11.31 7.69 14 11 14C14.31 14 17 11.31 17 8M12 16H10C6.69 16 4 18.69 4 22H18C18 18.69 15.31 16 12 16Z"/>
          </svg>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {/* Crop Recommendation Form Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-ultra-light)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-medium)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Crop Matchmaker</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Get recommendations for your soil & climate</p>
            </div>
          </div>

          <form onSubmit={handleRecommend} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-main)' }}>Soil Type</label>
              <select 
                value={soil} 
                onChange={(e) => setSoil(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  outline: 'none'
                }}
              >
                <option value="">Select Soil...</option>
                <option value="Clay">Clay (Heavy, moisture-retentive)</option>
                <option value="Loamy">Loamy (Balanced, fertile)</option>
                <option value="Sandy">Sandy (Well-drained, light)</option>
                <option value="Silt">Silt (Fine, moisture-retaining)</option>
                <option value="Peat">Peat (Acidic, highly organic)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-main)' }}>Climate Zone</label>
              <select 
                value={climate} 
                onChange={(e) => setClimate(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  outline: 'none'
                }}
              >
                <option value="">Select Climate...</option>
                <option value="Tropical">Tropical (Warm, humid)</option>
                <option value="Temperate">Temperate (Moderate, seasonal)</option>
                <option value="Arid">Arid (Dry, hot)</option>
                <option value="Cool/Cold">Cool / Alpine</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-main)' }}>Water Availability</label>
              <select 
                value={water} 
                onChange={(e) => setWater(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  outline: 'none'
                }}
              >
                <option value="">Select Water Level...</option>
                <option value="High">High (Abundant/Flooded)</option>
                <option value="Medium">Medium (Regular Rainfall/Irrigated)</option>
                <option value="Low">Low (Drought-prone/Rainfed only)</option>
              </select>
            </div>

            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '0.85rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background var(--transition-fast)',
                marginTop: '0.5rem'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--primary-medium)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary)'}
            >
              Analyze Crop Compatibility
            </button>
          </form>
        </div>

        {/* Dynamic Weather Advisor Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--gold-light)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Dynamic Weather Advisory</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Get real-time actions based on meteorological state</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem' }}>
            {Object.keys(weatherAdvisories).map((cond) => (
              <button 
                key={cond}
                onClick={() => setWeatherCondition(cond)}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.25rem',
                  border: '1px solid',
                  borderColor: weatherCondition === cond ? 'var(--primary-light)' : 'var(--border-color)',
                  backgroundColor: weatherCondition === cond ? 'var(--accent-ultra-light)' : 'transparent',
                  color: weatherCondition === cond ? 'var(--primary-dark)' : 'var(--text-muted)',
                  fontWeight: weatherCondition === cond ? '700' : '500',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cond}
              </button>
            ))}
          </div>

          <div style={{
            backgroundColor: weatherCondition === 'Rainy' ? 'var(--error-light)' : 'var(--accent-ultra-light)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            borderLeft: `4px solid ${weatherCondition === 'Rainy' ? 'var(--error)' : 'var(--accent)'}`,
            marginBottom: '1rem'
          }}>
            <h4 style={{
              color: weatherCondition === 'Rainy' ? 'var(--error)' : 'var(--primary-dark)',
              fontSize: '0.95rem',
              fontWeight: '700',
              marginBottom: '0.25rem'
            }}>
              {currentAdvisory.alert}
            </h4>
            <ul style={{
              paddingLeft: '1.2rem',
              fontSize: '0.85rem',
              color: 'var(--text-main)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}>
              {currentAdvisory.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
          
          <div style={{ marginTop: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
            *Disclaimer: Local microclimate fluctuations might alter exact scheduling. Consult extension centers.*
          </div>
        </div>
      </div>

      {/* Recommendation Results Display */}
      {recommendedYet && (
        <div className="card animate-slide-up" style={{ marginTop: '0rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '1.5rem', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-full)', display: 'inline-block' }}></span>
            Compatible Crop Matches ({recommendations.length})
          </h3>
          
          {recommendations.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontWeight: '500' }}>No exact matches found for your custom combination.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Try modifying water availability or selecting a balanced soil type like loamy.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {recommendations.map((crop, idx) => (
                <div 
                  key={idx} 
                  style={{
                    padding: '1.2rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-main)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'border-color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <div>
                    <h4 style={{ color: 'var(--primary-dark)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{crop.name}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.8rem' }}>
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', backgroundColor: '#e2e8f0', borderRadius: '4px', fontWeight: '600' }}>
                        📅 {crop.duration}
                      </span>
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', backgroundColor: 'var(--accent-pale)', borderRadius: '4px', color: 'var(--primary-dark)', fontWeight: '600' }}>
                        🌾 Yield: {crop.yield}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <strong>Key Practice:</strong> {crop.tips}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Live Market Price Widget */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>Agricultural Commodity Tracker</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Simulated standard market indices (per Quintal)</p>
          </div>
          <span style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            backgroundColor: 'var(--accent-ultra-light)',
            color: 'var(--primary-medium)',
            fontWeight: 'bold',
            borderRadius: '4px'
          }}>
            🟢 LIVE UPDATING
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {[
            { crop: "Paddy (Rice)", price: "₹2,183", change: "+1.2%", positive: true },
            { crop: "Wheat", price: "₹2,275", change: "+0.8%", positive: true },
            { crop: "Maize (Corn)", price: "₹1,960", change: "-0.5%", positive: false },
            { crop: "Soybeans", price: "₹4,300", change: "+2.4%", positive: true },
            { crop: "Potato", price: "₹1,450", change: "-1.8%", positive: false }
          ].map((item, idx) => (
            <div 
              key={idx} 
              style={{
                padding: '1rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-main)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.25rem' }}>{item.crop}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-dark)' }}>{item.price}</div>
              <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: '700', 
                color: item.positive ? 'var(--primary-medium)' : 'var(--error)',
                marginTop: '0.25rem'
              }}>
                {item.positive ? '▲' : '▼'} {item.change}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
