const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Reads backend/.env file as text to extract raw HTML script tags pasted by the user
const getEmbeddedScript = () => {
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      if (scriptMatch && scriptMatch[1]) {
        return scriptMatch[1].trim();
      }
    }
  } catch (err) {
    console.error("Error reading script from .env file:", err);
  }
  return null;
};

// Check if IBM Orchestrate configuration exists (either via env variables or raw script)
const isIbmConfigured = () => {
  const integrationId = process.env.IBM_ORCHESTRATE_INTEGRATION_ID;
  const scriptContent = getEmbeddedScript();
  return (
    (integrationId && integrationId.trim() !== '' && integrationId !== 'your_orchestration_id_here') ||
    (scriptContent && scriptContent.trim() !== '')
  );
};

// Endpoint to retrieve client-side IBM Orchestrate configuration
app.get('/api/config', (req, res) => {
  const scriptContent = getEmbeddedScript();
  res.json({
    configured: isIbmConfigured(),
    integrationId: process.env.IBM_ORCHESTRATE_INTEGRATION_ID || '',
    crn: process.env.IBM_ORCHESTRATE_CRN || '',
    agentId: process.env.IBM_ORCHESTRATE_AGENT_ID || '',
    hostUrl: process.env.IBM_ORCHESTRATE_HOST_URL || '',
    agentEnvironmentId: process.env.IBM_ORCHESTRATE_AGENT_ENV_ID || 'live',
    script: scriptContent || '' // Serve the raw script code if found
  });
});

// Endpoint to generate signed JWT for watsonx Orchestrate secure web chat
app.get('/api/jwt', (req, res) => {
  const privateKey = process.env.IBM_ORCHESTRATE_PRIVATE_KEY;
  if (!privateKey || privateKey.trim() === '') {
    return res.status(400).json({ 
      error: "IBM_ORCHESTRATE_PRIVATE_KEY is missing in backend/.env. Please add it to generate secure JWT tokens." 
    });
  }

  try {
    const header = { alg: "RS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      sub: "agri_user_" + Math.random().toString(36).substr(2, 9),
      iss: "agriculture_handbook_backend",
      exp: now + 3600, // Expires in 1 hour
      iat: now
    };

    const base64UrlEncode = (obj) => {
      return Buffer.from(JSON.stringify(obj))
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    };

    const encodedHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(payload);
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    // Clean up private key string if they paste it with literal \n instead of actual newlines
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);
    const signature = sign.sign(formattedPrivateKey, 'base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const token = `${signatureInput}.${signature}`;
    res.json({ token });
  } catch (err) {
    console.error("Failed to generate JWT:", err);
    res.status(500).json({ error: "Internal error generating JWT: " + err.message });
  }
});

// Endpoint to check status of the IBM Agent config
app.get('/api/status', (req, res) => {
  res.json({
    configured: isIbmConfigured(),
    message: isIbmConfigured() 
      ? "IBM Orchestrate Channel configured successfully." 
      : "IBM Orchestrate credentials missing. Running in local Offline Demo Mode."
  });
});

// Endpoint to handle chat interaction for the Offline Demo Chatbot Widget
app.post('/api/chat/message', async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message content is required" });
  }

  // Fall back to Offline Advisory Engine
  const reply = getOfflineAdvisoryReply(message);
  return res.json({
    reply,
    sessionId: sessionId || "offline-session-id",
    mode: "offline"
  });
});

// A robust offline advisory rule engine to answer agriculture questions
function getOfflineAdvisoryReply(input) {
  const query = input.toLowerCase();

  // Basic Greeting
  if (query.match(/\b(hello|hi|hey|greetings|good morning|good afternoon)\b/)) {
    return "Hello! I am your AI Agriculture Assistant. I can guide you on crop cultivation, organic farming, government schemes, and soil health. \n\n*Note: I am running in **Offline Demo Mode** because IBM Orchestrate credentials are not configured in backend/.env. How can I help you today?*";
  }

  // Rice
  if (query.includes("rice") || query.includes("paddy")) {
    return `### Rice (Paddy) Cultivation Guide 🌾
Rice is a primary staple crop requiring specific warm, humid conditions:
* **Soil:** Heavy clayey or loamy soil that can retain water. Best pH range: 5.5 - 6.5.
* **Watering:** Requires standing water (flooding) of 5-10cm during the vegetative phase.
* **Pest Management:** Watch out for *Stem Borer* (apply neem oil or Bacillus thuringiensis) and *Blast Disease* (use organic copper-based fungicides).
* **Tip:** System of Rice Intensification (SRI) can reduce water usage by up to 40% while increasing yield.`;
  }

  // Wheat
  if (query.includes("wheat")) {
    return `### Wheat Cultivation Guide 🌾
Wheat is a cool-season crop mainly grown during winter (Rabi season):
* **Sowing Time:** Mid-October to December.
* **Soil:** Well-drained fertile loams or clay loams. pH 6.0 - 7.0.
* **Irrigation:** Critical watering stages are: Crown Root Initiation (21 days after sowing), flowering, and grain filling. Needs 4-6 irrigations in total.
* **Common Disease:** Yellow Rust. Keep fields weed-free and spray recommended bio-fungicides or resistance-boosting organic stimulants.`;
  }

  // Organic farming & composting
  if (query.includes("organic") || query.includes("compost") || query.includes("fertilizer")) {
    return `### Organic Composting & Fertilizers 🌱
Boost your soil health using sustainable organic methods:
1. **Three-Bin System:** Layer green waste (nitrogen-rich: vegetable peels, grass) and brown waste (carbon-rich: dry leaves, twigs, straw) in a 1:2 ratio.
2. **Moisture:** Keep the compost pile damp like a wrung-out sponge.
3. **Aeration:** Turn the pile every 10-14 days to introduce oxygen and speed up decomposition.
4. **Bio-fertilizers:** Utilize *Azotobacter* and *Phosphorus Solubilizing Bacteria (PSB)* to fix soil nitrogen and dissolve insoluble phosphorus naturally.`;
  }

  // Tomato / Vegetable
  if (query.includes("tomato") || query.includes("vegetable")) {
    return `### Vegetable & Tomato Farming Guide 🍅
Grow high-yielding vegetables with these quick steps:
* **Soil:** Loamy, rich in organic matter. Add plenty of compost before transplanting.
* **Spacing:** Space tomato plants about 18-24 inches apart. Use stakes or cages for structural support.
* **Pest:** Aphids and Fruit Borers. Plant companion herbs like Marigolds to naturally repel aphids. Use yellow sticky traps.
* **Watering:** Water at the base (drip irrigation is ideal) to prevent leaf blight and fungal diseases.`;
  }

  // Government schemes
  if (query.includes("scheme") || query.includes("subsidy") || query.includes("pm-kisan") || query.includes("pmfby")) {
    return `### Main Agricultural Schemes 🏛️
Here are the primary government schemes detailed in the Handbook:
1. **PM-KISAN:** Provides an income support of ₹6,000 per year in three equal installments to all landholding farmer families.
2. **PM Fasal Bima Yojana (PMFBY):** Highly subsidized crop insurance scheme protecting against crop losses from natural calamities. Premium is capped at 2% for Kharif and 1.5% for Rabi crops.
3. **Soil Health Card Scheme:** Provides farmers with custom nutrient reports and fertilizer recommendations for their specific land holdings.
*For detailed eligibility criteria and calculators, visit the **Schemes** tab on the dashboard.*`;
  }

  // Soil
  if (query.includes("soil") || query.includes("clay") || query.includes("sandy") || query.includes("pH")) {
    return `### Soil Management Tips 🧪
Healthy soil is the foundation of successful farming:
* **Sandy Soil:** High drainage, poor nutrient retention. Improve by adding compost, peat moss, or well-rotted manure.
* **Clay Soil:** Compacts easily, holds water. Improve drainage by adding gypsum, organic matter, and practicing no-till farming.
* **pH Level adjustment:**
  - If too acidic (pH < 5.5): Apply agricultural limestone.
  - If too alkaline (pH > 7.5): Apply agricultural sulfur or organic compost.`;
  }

  // Default helpful message
  return `I am here to assist you with agricultural queries!
I can answer questions like:
* "How do I cultivate rice?"
* "What is the PM-KISAN scheme?"
* "How do I make organic compost?"
* "What is the best soil pH for wheat?"

*Note: You can unlock the live IBM Orchestrate Channel integration by adding your credentials in the backend \`.env\` file.*`;
}

// Serve static assets if in production
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'), (err) => {
    if (err) {
      res.send("Agriculture Handbook API Backend is running! Access frontend via dev server (Port 5173).");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
