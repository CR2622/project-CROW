"""
Project CROW - FastAPI Gateway
Cybernetic Resilience & Operational Warning System
"""
import asyncio
import uuid
import json
import os
from typing import Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Import from existing CROW modules
from pipeline import (
    fetch_live_telemetry_async,
    get_elevation_profile,
    compute_vulnerability_score,
    mock_plaid_bank_link,
)
from agent import run_citizen_agent
from database import save_citizen_state
from sms import dispatch_offline_sms
from voice import synthesize_emergency_broadcast

load_dotenv()

# ---------------------------------------------------------------------------
# FastAPI app & CORS
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Project CROW",
    description="Cybernetic Resilience & Operational Warning — Citizen Defense API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------

class AnalyzeRequest(BaseModel):
    lat: float = 17.6868
    lon: float = 83.2185
    user_id: str = "demo_citizen"


class OutageRequest(BaseModel):
    phone_number: Optional[str] = None


class VoiceRequest(BaseModel):
    message: str


# ---------------------------------------------------------------------------
# GET /api/v1/health
# ---------------------------------------------------------------------------

@app.get("/api/v1/health")
def health_check():
    return {"status": "operational", "service": "project-crow", "version": "1.0.0"}


# ---------------------------------------------------------------------------
# POST /api/v1/crow-analyze  (one-shot analysis)
# ---------------------------------------------------------------------------

@app.post("/api/v1/crow-analyze")
async def crow_analyze(req: AnalyzeRequest):
    session_id = str(uuid.uuid4())
    try:
        wind_kmh, pressure_hpa, telemetry_degraded = await fetch_live_telemetry_async(
            req.lat, req.lon
        )
        elevation_m, elevation_degraded = await get_elevation_profile(req.lat, req.lon)

        vulnerability = compute_vulnerability_score(wind_kmh, pressure_hpa, elevation_m)
        bank_balance = mock_plaid_bank_link(req.user_id)
        system_degraded = telemetry_degraded or elevation_degraded

        # Build telemetry dict with keys matching agent.py expectations
        telemetry = {
            "wind_speed_kmh": wind_kmh,
            "surface_pressure_hpa": pressure_hpa,
        }

        agent_result = run_citizen_agent(
            telemetry=telemetry,
            elevation=elevation_m,
            vulnerability=vulnerability,
            bank_balance=bank_balance,
            degraded_flag=system_degraded,
        )

        # Persist to Firebase
        save_citizen_state(agent_result, session_id)

        return {
            "session_id": session_id,
            "system_degraded": system_degraded,
            **agent_result,
        }
    except Exception as e:
        print(f"[CROW] crow-analyze error: {e}")
        return {
            "session_id": session_id,
            "system_degraded": True,
            "system_status": "WARNING - STORM BREWING",
            "error": str(e),
            "home_hardening_tasks": [
                "Secure loose outdoor items",
                "Board windows",
                "Move valuables upstairs",
            ],
        }


# ---------------------------------------------------------------------------
# WebSocket /api/v1/ws/dynamic-evac  (real-time with Delta Check)
# ---------------------------------------------------------------------------

@app.websocket("/api/v1/ws/dynamic-evac")
async def websocket_dynamic_evac(websocket: WebSocket):
    await websocket.accept()
    session_id = str(uuid.uuid4())

    # Send session init so frontend can store the ID
    await websocket.send_json({"type": "session_init", "session_id": session_id})

    # Default coordinates: Visakhapatnam
    lat = 17.6868
    lon = 83.2185
    user_id = "demo_citizen"

    # Accept optional initial config message from client
    try:
        raw = await asyncio.wait_for(websocket.receive_text(), timeout=2.0)
        try:
            init_data = json.loads(raw)
            lat = init_data.get("lat", lat)
            lon = init_data.get("lon", lon)
            user_id = init_data.get("user_id", user_id)
        except json.JSONDecodeError:
            pass
    except (asyncio.TimeoutError, WebSocketDisconnect):
        pass

    previous_wind = 0.0  # Start at 0 to guarantee first-iteration Gemini call

    try:
        while True:
            # --- Fetch telemetry (every 5 s) ---
            try:
                wind_kmh, pressure_hpa, degraded = await fetch_live_telemetry_async(
                    lat, lon
                )
            except Exception as e:
                print(f"[CROW-WS] Telemetry fetch error: {e}")
                wind_kmh, pressure_hpa, degraded = 125.0, 960.0, True

            # Always push raw telemetry to client
            await websocket.send_json({
                "type": "telemetry",
                "data": {
                    "wind_speed_kmh": wind_kmh,
                    "surface_pressure_hpa": pressure_hpa,
                    "system_degraded": degraded,
                    "timestamp": asyncio.get_event_loop().time(),
                },
            })

            # --- Delta Check: only invoke Gemini if wind changed >10 km/h ---
            if abs(wind_kmh - previous_wind) > 10.0:
                try:
                    elevation_m, elev_degraded = await get_elevation_profile(lat, lon)
                    vulnerability = compute_vulnerability_score(
                        wind_kmh, pressure_hpa, elevation_m
                    )
                    bank_balance = mock_plaid_bank_link(user_id)
                    system_degraded = degraded or elev_degraded

                    telemetry = {
                        "wind_speed_kmh": wind_kmh,
                        "surface_pressure_hpa": pressure_hpa,
                    }

                    agent_result = run_citizen_agent(
                        telemetry=telemetry,
                        elevation=elevation_m,
                        vulnerability=vulnerability,
                        bank_balance=bank_balance,
                        degraded_flag=system_degraded,
                    )

                    # Persist state to Firebase
                    save_citizen_state(agent_result, session_id)

                    await websocket.send_json({
                        "type": "agent_update",
                        "data": agent_result,
                    })

                    previous_wind = wind_kmh

                except Exception as e:
                    print(f"[CROW-WS] Agent pipeline error: {e}")
                    await websocket.send_json({
                        "type": "agent_update",
                        "data": {
                            "system_degraded": True,
                            "system_status": "WARNING - STORM BREWING",
                            "error": str(e),
                            "home_hardening_tasks": [
                                "Secure loose outdoor items",
                                "Board windows",
                                "Move valuables upstairs",
                            ],
                        },
                    })

            await asyncio.sleep(5)

    except WebSocketDisconnect:
        print(f"[CROW-WS] Client disconnected: session {session_id}")
    except Exception as e:
        print(f"[CROW-WS] Unexpected error for session {session_id}: {e}")


# ---------------------------------------------------------------------------
# POST /api/v1/simulate-outage  (Chaos Trigger — Twilio SMS fallback)
# ---------------------------------------------------------------------------

@app.post("/api/v1/simulate-outage")
async def simulate_outage(req: OutageRequest):
    phone_number = req.phone_number or os.environ.get(
        "DEMO_PHONE_NUMBER", "+1234567890"
    )
    critical_route_text = (
        "🚨 PROJECT CROW GUARDIAN ALERT 🚨\n"
        "5G TOWER COLLAPSE DETECTED — Network offline.\n"
        "EVACUATION ROUTE: Take NH-16 North towards Anakapalle.\n"
        "AVOID: Beach Road, Gajuwaka low-lying areas.\n"
        "Nearest shelter: Anakapalle Municipal Hall.\n"
        "Stay calm. Follow this route immediately."
    )
    try:
        dispatched = dispatch_offline_sms(phone_number, critical_route_text)
        return {
            "sms_dispatched": dispatched,
            "phone_number": phone_number,
            "message": critical_route_text,
            "system_degraded": False,
        }
    except Exception as e:
        print(f"[CROW] simulate-outage error: {e}")
        return {
            "sms_dispatched": False,
            "phone_number": phone_number,
            "message": critical_route_text,
            "error": str(e),
            "system_degraded": True,
        }


# ---------------------------------------------------------------------------
# POST /api/v1/voice-broadcast  (Google Cloud TTS)
# ---------------------------------------------------------------------------

@app.post("/api/v1/voice-broadcast")
async def voice_broadcast(req: VoiceRequest):
    try:
        audio_path, tts_degraded = synthesize_emergency_broadcast(req.message)
        return {
            "audio_file": audio_path,
            "system_degraded": tts_degraded,
        }
    except Exception as e:
        print(f"[CROW] voice-broadcast error: {e}")
        return {
            "audio_file": None,
            "system_degraded": True,
            "error": str(e),
        }
