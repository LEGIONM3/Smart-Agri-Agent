import React, { useState } from 'react';

const handbookArticles = [
  {
    id: "rice",
    title: "Rice (Oryza sativa) Cultivation",
    category: "Grains",
    summary: "Complete guide to growing wetland paddy, spacing, and water management.",
    sowing: "Direct seed or nursery transplantation. Space seedlings at 20cm x 15cm. Sow in wet soil beds.",
    watering: "Maintain 2-5cm standing water in the field during vegetative and early reproductive stages. Drain completely 10-15 days before harvest.",
    nutrients: "Apply NPK (Nitrogen-Phosphorus-Potassium) in 3 split doses: at planting, tillering (3 weeks), and panicle initiation.",
    pests: "Stem Borer, Blast, Bacterial Blight. Use Trichogramma egg cards for stem borer control. Apply neem spray.",
    source: "FAO Rice Production Manual"
  },
  {
    id: "wheat",
    title: "Wheat (Triticum aestivum) Management",
    category: "Grains",
    summary: "Deep dive into Rabi season wheat growing stages, irrigation checkpoints, and rust disease prevention.",
    sowing: "Sow seeds at a depth of 4-5cm in moist soil. Row-to-row spacing should be 20-22.5cm.",
    watering: "Requires 4 to 6 irrigations at critical growth stages: Crown Root Initiation (CRI), Tillering, Late Jointing, Flowering, Milk stage, and Dough stage.",
    nutrients: "Requires strong basal fertilizer application (NPK 12:32:16) followed by Urea dressing before the first and second irrigations.",
    pests: "Yellow/Brown Rust, Termites. Use rust-resistant cultivars (like HD2967, DBW187). Treat seeds with Trichoderma viride.",
    source: "ICAR Wheat Production Guide"
  },
  {
    id: "maize",
    title: "Maize (Zea mays) Planting & Care",
    category: "Grains",
    summary: "Cultivating corn under tropical or temperate climates with optimal soil aeration and spacing.",
    sowing: "Sow at 3-5cm depth. Plant-to-plant spacing: 20cm, Row spacing: 60cm. Seed rate: 20 kg per hectare.",
    watering: "Sensitive to water drought at tasseling and silking stages. Requires moderate but consistent watering; avoid waterlogging.",
    nutrients: "Heavy feeder. Apply zinc sulfate along with primary NPK. Side-dress with Nitrogen when plants reach knee height.",
    pests: "Fall Armyworm (FAW), Stem Borer. Employ integrated pest management (IPM) using pheromone traps and handpicking egg masses.",
    source: "CIMMYT Maize Field Guide"
  },
  {
    id: "tomato",
    title: "Tomato (Solanum lycopersicum) Techniques",
    category: "Vegetables",
    summary: "Staking, composting, pruning, and structural care for disease-free high tomato yields.",
    sowing: "Sow seeds in trays. Transplant seedlings after 4-5 weeks. Keep spacing at 60cm between rows and 45cm between plants.",
    watering: "Drip irrigation is highly recommended. Water deeply at soil level; wetting the leaves increases fungal blight risks.",
    nutrients: "High demand for Potassium and Calcium. Add crushed eggshells or lime to prevent Blossom End Rot. Feed with organic compost tea.",
    pests: "Aphids, Fruit Borers, Root-knot Nematodes. Grow companion plants like Marigold (Tagetes) to repel nematodes and attract beneficial predators.",
    source: "World Vegetable Center Advisory"
  },
  {
    id: "compost",
    title: "Organic Composting & Vermicomposting",
    category: "Practices",
    summary: "Creating high-grade organic humus using green-to-brown waste balancing and earthworms.",
    sowing: "Build a heap minimum of 3ft x 3ft. Layer green waste (food scraps, grass) and brown waste (cardboard, leaves) in a 1:2 volume ratio.",
    watering: "Ensure moisture is kept at 50-60%. When squeezing compost, only a few drops of water should come out. Do not saturate.",
    nutrients: "Yields finished dark compost containing highly available Nitrogen, Phosphorus, Potassium, Zinc, and beneficial soil microbes.",
    pests: "Fruit flies, rodents. Keep the top layer covered with dry brown leaves or straw. Avoid putting meats, fats, or oils in the compost heap.",
    source: "Rodale Institute Organic Guide"
  },
  {
    id: "soiltest",
    title: "Step-by-Step Soil Sampling & Testing",
    category: "Practices",
    summary: "How to extract soil samples, understand pH values, and calculate nutrient deficits.",
    sowing: "Divide field into homogeneous zones. Dig a V-shaped hole 15cm deep, scrape a slice from top to bottom, and collect in a clean bucket.",
    watering: "Sample when soil is at normal moisture, not immediately after irrigation or fertilizer application.",
    nutrients: "Analyze pH, EC (Electrical Conductivity), Organic Carbon, and NPK levels. Target balanced neutral pH (6.0 - 7.0) for optimal uptake.",
    pests: "Inspect soil for wireworms, white grubs, and cutworms. Solarize soil using transparent plastic sheets during peak summer to kill weed seeds and pathogens.",
    source: "Soil Science Society Guidelines"
  },
  {
    id: "pestcontrol",
    title: "Integrated Pest Management (IPM)",
    category: "Pest Control",
    summary: "Combating crop diseases and pests using biological controls, companion planting, and organic sprays.",
    sowing: "Design field with trap crops on borders (e.g. mustard around cabbage). Use clean, certified pathogen-free seeds.",
    watering: "Overwatering promotes damping-off diseases and fungal root rots. Ensure soil dries slightly between irrigations.",
    nutrients: "Excessive Nitrogen fertilization leads to tender, watery plant tissue which attracts sucking pests like aphids.",
    pests: "Deploy natural predators (ladybugs, hoverflies). Spray home-brewed garlic-neem oil emulsion as an organic insect repellent.",
    source: "IPM Global Database"
  }
];

export default function Handbook() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [activeTabMap, setActiveTabMap] = useState({}); // Stores active tab ('sowing', 'watering', etc.) for each expanded article

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (!activeTabMap[id]) {
        setActiveTabMap(prev => ({ ...prev, [id]: 'sowing' }));
      }
    }
  };

  const setArticleTab = (id, tab) => {
    setActiveTabMap(prev => ({ ...prev, [id]: tab }));
  };

  const categories = ['All', 'Grains', 'Vegetables', 'Practices', 'Pest Control'];

  const filteredArticles = handbookArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="screen-container animate-fade-in">
      
      {/* Title & Introduction */}
      <div>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Agriculture Handbook</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '800px' }}>
          Explore detailed guides, planting charts, soil preservation methods, and organic insect prevention techniques curated from verified agricultural extension databases.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-card)',
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)'
      }}>
        {/* Category Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                backgroundColor: selectedCategory === cat ? 'var(--primary-dark)' : 'var(--bg-main)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)',
                fontWeight: '600',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <input
            type="text"
            placeholder="Search handbook..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.2rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-main)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="var(--text-light)" 
            strokeWidth="2.5" 
            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredArticles.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            No guidelines found matching your filters.
          </div>
        ) : (
          filteredArticles.map((article) => {
            const isExpanded = expandedId === article.id;
            const currentTab = activeTabMap[article.id] || 'sowing';

            return (
              <div 
                key={article.id} 
                className="card"
                style={{ 
                  padding: '1.5rem',
                  border: isExpanded ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                  boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  transition: 'all var(--transition-normal)'
                }}
              >
                {/* Header section (Clickable to expand) */}
                <div 
                  onClick={() => toggleExpand(article.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        backgroundColor: 'var(--accent-ultra-light)',
                        color: 'var(--primary-medium)',
                        fontWeight: '700',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        textTransform: 'uppercase'
                      }}>
                        {article.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                        Source: {article.source}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>
                      {article.title}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {article.summary}
                    </p>
                  </div>
                  <div style={{
                    padding: '0.25rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform var(--transition-normal)'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-medium)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Sections (Tabs) */}
                {isExpanded && (
                  <div className="animate-slide-up" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                    {/* Inner Navigation tabs */}
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '0.5rem', 
                      marginBottom: '1rem',
                      borderBottom: '1px solid var(--border-color)',
                      paddingBottom: '0.5rem'
                    }}>
                      {[
                        { key: 'sowing', label: '🌱 Sowing & Spacing' },
                        { key: 'watering', label: '💧 Irrigation & Water' },
                        { key: 'nutrients', label: '🧪 Nutrient & Compost' },
                        { key: 'pests', label: '🛡️ Integrated Pest Control' }
                      ].map(tab => (
                        <button
                          key={tab.key}
                          onClick={() => setArticleTab(article.id, tab.key)}
                          style={{
                            padding: '0.4rem 0.85rem',
                            background: 'none',
                            border: 'none',
                            borderBottom: currentTab === tab.key ? '2.5px solid var(--primary-medium)' : '2.5px solid transparent',
                            color: currentTab === tab.key ? 'var(--primary-dark)' : 'var(--text-muted)',
                            fontWeight: currentTab === tab.key ? '700' : '500',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab contents */}
                    <div style={{
                      backgroundColor: 'var(--bg-main)',
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                      color: 'var(--text-main)'
                    }}>
                      {currentTab === 'sowing' && (
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>Establishment Methods & Spacing</h4>
                          <p style={{ lineHeight: '1.6' }}>{article.sowing}</p>
                        </div>
                      )}
                      {currentTab === 'watering' && (
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>Watering Schedules & Thresholds</h4>
                          <p style={{ lineHeight: '1.6' }}>{article.watering}</p>
                        </div>
                      )}
                      {currentTab === 'nutrients' && (
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>Fertilization & Soil Amendments</h4>
                          <p style={{ lineHeight: '1.6' }}>{article.nutrients}</p>
                        </div>
                      )}
                      {currentTab === 'pests' && (
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>Pests, Diseases & Biological Controls</h4>
                          <p style={{ lineHeight: '1.6' }}>{article.pests}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
