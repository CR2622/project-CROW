import httpx
import os
from typing import Tuple, Dict

async def fetch_live_telemetry_async(lat: float, lon: float) -> Tuple[float, float, bool]:
    """
    Fetches real-time weather telemetry from Open-Meteo.
    Returns: wind_speed_kmh, surface_pressure_hpa, system_degraded flag
    """
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=wind_speed_10m,surface_pressure"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=5.0)
            response.raise_for_status()
            data = response.json()
            current = data.get("current", {})
            wind = current.get("wind_speed_10m", 125.0)
            pressure = current.get("surface_pressure", 960.0)
            return wind, pressure, False
    except Exception as e:
        print(f"Failed to fetch Open-Meteo data: {e}")
        # Fallback to Category 3 storm parameters
        return 125.0, 960.0, True

async def get_elevation_profile(lat: float, lon: float) -> Tuple[float, bool]:
    """
    Queries Google Maps SDK for elevation.
    Returns: elevation_m, system_degraded flag
    """
    api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
    if not api_key:
        return 3.5, True
        
    try:
        # Note: googlemaps python client is mostly synchronous, 
        # so we'll wrap it or use httpx directly to be truly async.
        url = f"https://maps.googleapis.com/maps/api/elevation/json?locations={lat},{lon}&key={api_key}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=5.0)
            response.raise_for_status()
            data = response.json()
            if data.get("status") == "OK" and data.get("results"):
                elevation = data["results"][0].get("elevation", 3.5)
                return float(elevation), False
            else:
                return 3.5, True
    except Exception as e:
        print(f"Failed to fetch elevation from Google Maps: {e}")
        return 3.5, True

def compute_vulnerability_score(wind_kmh: float, surface_pressure_hpa: float, elevation_m: float, distance_km: float = 5.0) -> float:
    """
    Computes vulnerability score based on formula.
    """
    surge_meters = max(0.0, (1010.0 - surface_pressure_hpa) * 0.1)
    
    base_risk = (wind_kmh * 0.4) + (surge_meters * 15.0)
    mitigation = max(elevation_m, 0.5) * (distance_km + 1.0)
    
    score = base_risk / mitigation if mitigation > 0 else 100.0
    return max(0.0, min(100.0, score))

def mock_plaid_bank_link(user_id: str) -> float:
    """
    Returns a simulated bank balance.
    """
    # Simply returning a static or pseudo-random value based on user_id
    if user_id == "poor_user":
        return 45.00
    return 240.50
