import os
import httpx
from dotenv import load_dotenv

# Load environment variables securely from .env
load_dotenv()

# ==========================================
# 1. Google Gemini 1.5 Flash
# ==========================================
gemini_client = None
try:
    from google import genai
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        gemini_client = genai.Client(api_key=api_key)
        print("[CROW INIT] Google Gemini 1.5 Flash initialized successfully.")
    else:
        print("[CROW INIT] GEMINI_API_KEY missing. Gemini disabled.")
except Exception as e:
    print(f"[CROW INIT] Failed to initialize Gemini: {e}")


# ==========================================
# 2. Firebase Firestore
# ==========================================
firebase_db = None
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    
    # Prevent double-initialization errors
    if not firebase_admin._apps:
        cred = credentials.Certificate("crow-service-account.json")
        firebase_admin.initialize_app(cred)
    firebase_db = firestore.client()
    print("[CROW INIT] Firebase Firestore initialized successfully.")
except Exception as e:
    print(f"[CROW INIT] Failed to initialize Firebase (graceful mock DB fallback): {e}")


# ==========================================
# 3. Google Cloud Text-to-Speech (TTS)
# ==========================================
tts_client = None
try:
    from google.cloud import texttospeech
    # Implicitly uses GOOGLE_APPLICATION_CREDENTIALS from os.environ
    tts_client = texttospeech.TextToSpeechClient()
    print("[CROW INIT] Google Cloud TTS initialized successfully.")
except Exception as e:
    print(f"[CROW INIT] Failed to initialize Google TTS: {e}")


# ==========================================
# 4. Google Maps Platform
# ==========================================
gmaps_client = None
try:
    import googlemaps
    maps_key = os.environ.get("GOOGLE_MAPS_API_KEY")
    if maps_key:
        gmaps_client = googlemaps.Client(key=maps_key)
        print("[CROW INIT] Google Maps Platform initialized successfully.")
    else:
        print("[CROW INIT] GOOGLE_MAPS_API_KEY missing. Elevation routing disabled.")
except Exception as e:
    print(f"[CROW INIT] Failed to initialize Google Maps: {e}")


# ==========================================
# 5. Open-Meteo API
# ==========================================
async def fetch_open_meteo_vizag() -> dict:
    """Sample asynchronous HTTP GET to Open-Meteo for Visakhapatnam"""
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": 17.68,
        "longitude": 83.21,
        "current_weather": True
    }
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            print("[CROW INIT] Open-Meteo live telemetry connection verified.")
            return response.json()
    except Exception as e:
        print(f"[CROW INIT] Failed to fetch Open-Meteo data: {e}")
        return {}


# ==========================================
# 6. Twilio SMS
# ==========================================
twilio_client = None
try:
    from twilio.rest import Client
    account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
    
    if account_sid and auth_token:
        twilio_client = Client(account_sid, auth_token)
        print("[CROW INIT] Twilio SMS Client initialized successfully.")
    else:
        print("[CROW INIT] Twilio credentials missing. SMS fallback disabled.")
except Exception as e:
    print(f"[CROW INIT] Failed to initialize Twilio: {e}")


# ==========================================
# 7. Plaid (Financial Mock)
# ==========================================
def mock_plaid_bank_link(user_id: str) -> dict:
    """
    Returns a static JSON bank balance to simulate Agent Gamma's 
    financial connection without requiring a real OAuth flow.
    """
    print(f"[CROW INIT] Mocking Plaid bank link for user: {user_id}")
    return {
        "user_id": user_id,
        "account_status": "active",
        "currency": "USD",
        "balance_available": 240.50,
        "balance_current": 310.20,
        "last_updated": "2026-09-30T12:00:00Z",
        "is_mock": True
    }
