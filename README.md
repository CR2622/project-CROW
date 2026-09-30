# Project CROW (Cybernetic Resilience & Operational Warning)

Project CROW is a B2C Citizen-Centric disaster architecture designed to provide real-time, personalized evacuation, financial budgeting, and safety information to users facing impending natural disasters like cyclones.

## Key Features

1.  **Dynamic Evacuation Routing**: Utilizes Gemini 1.5 Flash to provide personalized turn-by-turn routes that avoid flood zones, adapting dynamically to changing weather conditions via WebSockets.
2.  **Financial Budgeting**: Analyzes a mock Plaid bank link to set survival budgets and trigger simulated micro-insurance payouts if the storm severity is high and the user's balance is low.
3.  **Twilio Offline Guardian**: A fallback SMS system that dispatches critical evacuation routes if the primary network drops, ensuring citizens receive life-saving instructions even during a 5G outage.
4.  **Empathic Voice Advisory**: Generates a calm, authoritative SSML audio warning using Google Cloud Text-to-Speech, acting as a personal guardian copilot.

## Architecture

The backend is built with **FastAPI** and is fully asynchronous, utilizing `httpx` for external API calls and WebSocket connections for real-time telemetry streaming to the frontend.

-   **`app.py`**: The main FastAPI gateway handling HTTP requests and WebSocket connections.
-   **`pipeline.py`**: Fetches weather telemetry (Open-Meteo), elevation data (Google Maps), and computes vulnerability scores. Includes mock financial integrations.
-   **`agent.py`**: The core Gemini orchestration logic, injecting local disaster resilience context and strictly validating output against a multi-tiered `CrowCitizenSchema`.
-   **`database.py`**: Persists active citizen state to Firebase Firestore concurrently using UUIDs.
-   **`voice.py`**: Synthesizes the SSML text-to-speech audio files.
-   **`sms.py`**: The Twilio offline fallback implementation.

## Quickstart

```bash
cd project-crow/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Fill in your .env variables
uvicorn app:app --reload
```