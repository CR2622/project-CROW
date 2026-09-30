# Project CROW (Cybernetic Resilience & Operational Warning)

> **"The watchful crow senses the tempest before it breaks."**

Project CROW is a B2C Citizen-Centric disaster survival architecture designed for the Bengal and Visakhapatnam (Vizag) coastal corridor. It shifts disaster response from *reactive* to *anticipatory*, operating 24-48 hours pre-landfall to prevent cascading infrastructure failures from trapping citizens.

Built as a high-stakes "Crisis Command War Room," it uses Gemini 1.5 Flash to act as an Overseer Agent coordinating four distinct resilience lifelines.

## 🦅 The 4 Agent Lifelines

1. **Agent Alpha (Grid-Lock / Home Hardening):** Generates property lockdown tasks and simulates SCADA substation shutdowns to prevent flood-induced electrocution.
2. **Agent Beta (Dynamic Routing):** Calculates real-time inland medical evacuation routes, routing users away from coastal inundation zones to safe shelters.
3. **Agent Gamma (Financial Oracle):** Simulates checking a linked bank account and releasing parametric micro-insurance day-zero survival funds.
4. **Agent Delta (Offline Guardian):** A Twilio SMS fallback that texts evacuation routes if the user loses Wi-Fi or 5G connectivity.

## 🌟 Key Technical Features

- **Tri-Agent Architecture & Strict JSON Validation:** Orchestrated by Gemini 1.5 Flash using structured Pydantic schemas (`CrowCitizenSchema`).
- **Live Telemetry & Delta Checks:** WebSockets stream live Open-Meteo data every 5 seconds. To respect rate limits, the Gemini API is only triggered when wind speeds change by >10 km/h (Delta Check).
- **Dynamic Region Switcher:** Toggle between the Visakhapatnam and Bay of Bengal coastal corridors. The map and telemetry instantly reconnect and adapt.
- **Offline Guardian Device Sync:** Users can sync their device phone number (persisted via `localStorage`) to receive fallback SMS alerts during simulated 5G tower collapses.
- **Cyber-Command React UI:** Built with Vite, Tailwind CSS, Leaflet, and Lucide React, featuring a stark dark-mode aesthetic (charcoal backgrounds, pulsing alerts, and strict Google Cloud accent colors).
- **Graceful Degradation:** All external APIs (Open-Meteo, Gemini, Firebase, Google TTS, Twilio) are wrapped in try/catch blocks to ensure the UI gracefully falls back to mock data (`system_degraded: true`) rather than crashing.

---

## 🏗️ Project Structure

```text
project-crow/
├── backend/
│   ├── app.py             # FastAPI WebSocket & HTTP Gateway
│   ├── agent.py           # Gemini 1.5 Flash Orchestration
│   ├── pipeline.py        # Open-Meteo & Elevation Data Fetching
│   ├── database.py        # Firebase Firestore Sync
│   ├── sms.py             # Twilio SMS Fallback
│   └── voice.py           # Google Cloud TTS Engine
└── frontend/
    ├── src/
    │   ├── components/    # UI Widgets (Tabs, Map, Telemetry Feed)
    │   ├── context/       # Location & Phone Sync Contexts
    │   ├── hooks/         # WebSocket Auto-Reconnect Hook
    │   └── utils/         # API Fetch Helpers
    ├── tailwind.config.js # CROW Dark Mode Theme
    └── vite.config.js     # Dev Server & Backend Proxy
```

---

## 🚀 Quickstart Guide

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Environment Setup
cp .env.example .env
# Open .env and add your GEMINI_API_KEY, TWILIO, and GCP credentials

# Start the API server
uvicorn app:app --reload --port 8000
```

### 2. Frontend Setup (React/Vite)

Open a **new terminal tab**:

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Navigate to **http://localhost:5555** to access the CROW Crisis Command dashboard.

---

## 🔌 API Endpoints

- `GET /api/v1/health`: Service health check.
- `POST /api/v1/crow-analyze`: One-shot disaster analysis based on coordinates.
- `WS /api/v1/ws/dynamic-evac`: Real-time bidirectional WebSocket stream for live telemetry and agent updates.
- `POST /api/v1/simulate-outage`: Chaos trigger that fires the Twilio SMS offline fallback.
- `POST /api/v1/voice-broadcast`: Generates SSML TTS advisory audio.
